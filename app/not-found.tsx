import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-[#FDFBF7]">
            <div className="bg-white p-6 rounded-full shadow-sm mb-6 animate-in fade-in zoom-in duration-500">
                <SearchX size={64} className="text-secondary-foreground/60" strokeWidth={1.5} />
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4">
                404
            </h1>

            <h2 className="text-xl md:text-2xl font-medium text-muted-foreground mb-6">
                Aradığınız sayfa kayıp...
            </h2>

            <p className="text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
                Aradığınız sayfayı bulamadık ama vitrinimizde harika ürünler var.
                Belki de evinize uygun o özel parça ana sayfamızda sizi bekliyordur.
            </p>

            <Link href="/">
                <Button size="lg" className="h-12 px-8 text-base gap-2">
                    <Home size={18} />
                    Ana Sayfaya Dön
                </Button>
            </Link>
        </div>
    );
}
