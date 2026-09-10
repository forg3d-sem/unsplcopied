"use server";

import bcrypt from "bcryptjs";
import { createUser } from "@/lib/db/user";
import { registrationSchema } from "@/lib/zod/authSchema";
import { z } from "zod";

export type RegisterState = {
    success?: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
};

export async function registerUser(
    values: unknown
): Promise<RegisterState> {
    const parsed = registrationSchema.safeParse(values);

    if (!parsed.success) {
        return { fieldErrors: z.flattenError(parsed.error).fieldErrors};
    }

    const { first_name, email, password } = parsed.data;

    try {
        const pass_hash = await bcrypt.hash(password, 10);
        await createUser({ first_name, email, pass_hash });
    } catch (err: unknown) {
        if (isUniqueViolation(err)) {
            return { error: "An account with this email already exists." };
        }
        console.error("registerUser failed:", err);
        return { error: "Something went wrong. Please try again." };
    }

    return { success: true };
}

function isUniqueViolation(err: unknown): boolean {
    return (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code: string }).code === "23505"
    );
}