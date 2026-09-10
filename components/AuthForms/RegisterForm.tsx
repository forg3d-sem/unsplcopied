'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "@/actions/auth";
import styles from "./AuthForms.module.scss";

type RegisterValues = {
    first_name: string;
    email: string;
    password: string;
};

export default function RegisterForm() {

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const { register, handleSubmit, setError, clearErrors, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
        defaultValues: { first_name: "", email: "", password: "" },
    });

    const isBusy = isSubmitting || isRedirecting;

    async function onSubmit(values: RegisterValues) {
        clearErrors("root");

        const trimmed = {
            first_name: values.first_name.trim(),
            email: values.email.trim(),
            password: values.password,
        };

        const result = await registerUser(trimmed);

        if (result.fieldErrors) {
            for (const [field, messages] of Object.entries(result.fieldErrors)) {
                setError(field as keyof RegisterValues, { message: messages[0] });
            }
            return;
        }

        if (result.error) {
            setError("root", { message: result.error });
            return;
        }


        setIsRedirecting(true);
        router.replace("/login");
        router.refresh();
    }

    return (
        <div className={styles.formContainer}>
            <div className={styles.heading}>
                <h2 id="register-title">Create an account</h2>
            </div>

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isBusy}>
                <div className={styles.field}>
                    <label htmlFor="first_name">Name</label>
                    <input
                        id="first_name"
                        type="text"
                        placeholder="Your name"
                        readOnly={isBusy}
                        aria-invalid={Boolean(errors.first_name)}
                        aria-describedby={errors.first_name ? "first_name-error" : undefined}
                        {...register("first_name", {
                            required: "Enter your name.",
                            setValueAs: (value: string) => value.trim(),
                        })}
                    />
                    {errors.first_name && <p id="first_name-error" className={styles.error} role="alert">{errors.first_name.message}</p>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        readOnly={isBusy}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        {...register("email", {
                            required: "Enter your email address.",
                            setValueAs: (value: string) => value.trim(),
                            pattern: { value: /^[^\s@]+@(?:[^\s@.]+\.)+[^\s@.]+$/, message: "Enter a valid email address." },
                        })}
                    />
                    {errors.email && <p id="email-error" className={styles.error} role="alert">{errors.email.message}</p>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="password">Password</label>
                    <div className={styles.password}>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="At least 8 characters"
                            readOnly={isBusy}
                            aria-invalid={Boolean(errors.password)}
                            aria-describedby={errors.password ? "password-error" : undefined}
                            {...register("password", {
                                required: "Enter a password.",
                                minLength: { value: 8, message: "Password must be at least 8 characters." },
                            })}
                        />
                        <button
                            type="button"
                            className={styles.visibility}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            aria-controls="password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                        </button>
                    </div>
                    {errors.password && <p id="password-error" className={styles.error} role="alert">{errors.password.message}</p>}
                </div>

                {errors.root && <p className={styles.submitError} role="alert">{errors.root.message}</p>}

                <button className={styles.submit} type="submit" disabled={isBusy}>
                    {isBusy ? "Creating account…" : "Create account"}
                </button>
            </form>
            <Link className={styles.backLink} href="/login">Already have an account? Log in</Link>
            <Link className={styles.backLink} href="/">Back to exploring photos</Link>
        </div>
    );
}