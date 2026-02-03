import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";

export const metadata = {
    title: "Giriş Yap | Yuvaa Store",
};

export default function LoginPage() {
    return (
        <div className="bg-background min-h-screen grid lg:grid-cols-2">
            {/* Left: Image (Hidden on mobile) */}
            <div className="hidden lg:block relative bg-muted">
                {/* Placeholder for branding image */}
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <h1 className="font-serif text-6xl text-primary-foreground font-bold">Yuvaa</h1>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex items-center justify-center p-8">
                <div className="mx-auto w-full max-w-sm space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Tekrar Hoşgeldiniz</h1>
                        <p className="text-sm text-muted-foreground">
                            Hesabınıza giriş yapmak için bilgilerinizi girin
                        </p>
                    </div>

                    <AuthForm type="login" />

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Hesabınız yok mu?{" "}
                        <Link href="/register" className="underline underline-offset-4 hover:text-primary">
                            Kayıt Ol
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
