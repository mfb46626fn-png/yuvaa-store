import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "Kayıt Ol | Yuvaa Store",
};

export default function RegisterPage() {
    return (
        <div className="w-full h-screen lg:grid lg:grid-cols-2">
            {/* Left: Branding (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col relative bg-[#FDFCF8] border-r border-border/40">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.02)_100%)]" />

                <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 text-center space-y-8">
                    <div className="relative w-48 h-16">
                        <Image
                            src="/logo.png"
                            alt="Yuvaa Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <blockquote className="space-y-2 max-w-lg">
                        <p className="text-xl font-serif italic text-muted-foreground">
                            "Evinizin ruhunu yansıtan dokunuşlar."
                        </p>
                    </blockquote>
                </div>

                {/* Decoration/Footer if needed */}
                <div className="relative z-10 p-8 mt-auto text-sm text-muted-foreground/50 text-center">
                    &copy; {new Date().getFullYear()} Yuvaa Store. Tüm hakları saklıdır.
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="mx-auto w-full max-w-[350px] space-y-8">
                    {/* Mobile Logo */}
                    <div className="flex flex-col space-y-2 text-center">
                        <div className="lg:hidden mx-auto relative w-32 h-12 mb-4">
                            <Image
                                src="/logo.png"
                                alt="Yuvaa Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <h1 className="text-2xl font-serif font-semibold tracking-tight">Hesap Oluşturun</h1>
                        <p className="text-sm text-muted-foreground">
                            Yuvaa ailesine katılmak için bilgilerinizi girin
                        </p>
                    </div>

                    <AuthForm type="register" />

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Zaten hesabınız var mı?{" "}
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary transition-colors">
                            Giriş Yap
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
