import type {Metadata} from "next";
import LoginForm from "@/components/AuthForms/LoginForm";
import {auth} from "@/lib/auth/auth";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
    title: "Log in | Unsplcopied",
};

export default async function LoginPage() {

    const session = await auth();

    if (session) redirect('/')

    return <LoginForm />;
}
