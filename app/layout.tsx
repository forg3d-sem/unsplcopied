import type {Metadata} from "next";
import './global.scss';
import Header from "@/components/ui/Header/Header";
import Frame from "@/components/ui/Frame/Frame";


export const metadata: Metadata = {
    title: "Unsplcopied",
    description: "Test assignment, not a real thing.",
};

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html
            lang="en"
        >
            <body
                cz-shortcut-listen="true"
            >
                <Header/>
                <main>
                    <Frame>
                        {children}
                    </Frame>
                </main>
            </body>
        </html>
    );
}
