import type {Metadata} from "next";
import RegisterForm from "@/components/AuthForms/RegisterForm";

export const metadata: Metadata = {
    title: "Registration | Unsplcopied",
};

export default function LoginPage() {
    return <RegisterForm/>;
}
