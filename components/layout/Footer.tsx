import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border bg-secondary/5 py-12 text-sm text-muted-foreground">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="font-serif text-xl font-bold text-foreground">
                            Yuvaa
                        </Link>
                        <p className="leading-relaxed">
                            Evinizin ruhunu yansıtan, el yapımı ve doğal dokulu dekorasyon ürünleri.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-primary transition-colors">
                                <Instagram size={20} />
                            </Link>
                            <Link href="#" className="hover:text-primary transition-colors">
                                <Twitter size={20} />
                            </Link>
                            <Link href="#" className="hover:text-primary transition-colors">
                                <Facebook size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Hızlı Erişim</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/products" className="hover:text-primary transition-colors">
                                    Tüm Ürünler
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories/duvar-dekoru" className="hover:text-primary transition-colors">
                                    Duvar Dekoru
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories/masa-ustu" className="hover:text-primary transition-colors">
                                    Masa Üstü
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-primary transition-colors">
                                    Hakkımızda
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary transition-colors">
                                    İletişim
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Kurumsal</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                                    Gizlilik Politikası
                                </Link>
                            </li>
                            <li>
                                <Link href="/sales-agreement" className="hover:text-primary transition-colors">
                                    Mesafeli Satış Sözleşmesi
                                </Link>
                            </li>
                            <li>
                                <Link href="/refund-policy" className="hover:text-primary transition-colors">
                                    İade ve İptal Koşulları
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">İletişim</h4>
                        <address className="not-italic leading-relaxed">
                            Bağdat Caddesi No:123<br />
                            Kadıköy, İstanbul<br />
                            Türkiye
                        </address>
                        <p>info@yuvaastore.com</p>
                        <p>+90 (216) 555 00 00</p>
                    </div>
                </div>

                <div className="border-t border-border pt-8 text-center">
                    <p>&copy; {new Date().getFullYear()} Yuvaa Store. Tüm hakları saklıdır.</p>
                </div>
            </div>
        </footer>
    );
}
