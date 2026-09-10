'use client';

import {signIn} from "next-auth/react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Eye, EyeOff} from "lucide-react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import styles from "./AuthForms.module.scss";

type LoginValues = {
    email: string;
    password: string;
};

export default function LoginForm() {

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const {register, handleSubmit, setError, clearErrors, formState: {errors, isSubmitting}} = useForm<LoginValues>({
        defaultValues: {email: "", password: ""},
    });

    const isBusy = isSubmitting || isRedirecting;

    async function onSubmit(values: LoginValues) {
        clearErrors("root");

        try {
            const result = await signIn("credentials", {
                email: values.email.trim(),
                password: values.password,
                redirect: false,
            });

            if (!result || !result.ok || result.error ) {
                setError("root", {
                    message: result.error === "CredentialsSignin"
                        ? "The email or password is incorrect. Please try again."
                        : "Unable to log in right now. Please try again shortly.",
                });
                return;
            }

            setIsRedirecting(true);
            router.replace("/profile");
            router.refresh();
        } catch {
            setError("root", {message: "Unable to connect. Check your connection and try again."});
        }
    }

    return (
        <div className={styles.formContainer}>
            <div className={styles.heading}>
                <h2 id="login-title">Welcome</h2>
                <p>Log in to your Unsplcopied account</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isBusy}>
                <div className={styles.field}>
                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="username"
                        placeholder="you@example.com"
                        readOnly={isBusy}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        {...register("email", {
                            required: "Enter your email address.",
                            setValueAs: (value: string) => value.trim(),
                            pattern: {value: /^[^\s@]+@(?:[^\s@.]+\.)+[^\s@.]+$/, message: "Enter a valid email address."},
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
                            placeholder="Enter your password"
                            readOnly={isBusy}
                            aria-invalid={Boolean(errors.password)}
                            aria-describedby={errors.password ? "password-error" : undefined}
                            {...register("password", {required: "Enter your password."})}
                        />
                        <button
                            type="button"
                            className={styles.visibility}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            aria-controls="password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} aria-hidden="true"/> : <Eye size={20} aria-hidden="true"/>}
                        </button>
                    </div>
                    {errors.password && <p id="password-error" className={styles.error} role="alert">{errors.password.message}</p>}
                </div>

                {errors.root && <p className={styles.submitError} role="alert">{errors.root.message}</p>}

                <button className={styles.submit} type="submit" disabled={isBusy}>
                    {isBusy ? "Logging in…" : "Log in"}
                </button>
            </form>
            <Link className={styles.backLink} href="/registration">Create an account</Link>
            <Link className={styles.backLink} href="/">Back to exploring photos</Link>
        </div>
    );
}
