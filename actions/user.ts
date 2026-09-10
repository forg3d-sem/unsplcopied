"use server";

import { auth } from "@/lib/auth/auth";
import { getUserById } from "@/lib/db/user";
import type { User } from "@/utility/types";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function getUserData(): Promise<ActionResult<User>> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const user = await getUserById(session.user.id);
        if (!user) {
            return { success: false, error: "User not found" };
        }
        return { success: true, data: user };
    } catch (err) {
        console.error("getUserData failed:", err);
        return { success: false, error: "Could not load user data." };
    }
}