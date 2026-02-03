"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Search, Facebook, Instagram, Twitter, User, LogOut, Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/providers/AuthProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const { user, profile, signOut } = useAuth();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] flex flex-col p-0">
                <SheetHeader className="p-6 text-left border-b bg-muted/10">
                    <SheetTitle className="font-serif text-2xl font-bold text-primary">Yuvaa</SheetTitle>
                    {user && (
                        <div className="flex items-center gap-3 mt-4">
                            <Avatar>
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{profile?.full_name || "Kullanıcı"}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                        </div>
                    )}
                </SheetHeader>

                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Ürün ara..." className="pl-9" />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <nav className="flex flex-col p-4 space-y-4">
                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            className="text-lg font-medium hover:text-primary transition-colors py-2"
                        >
                            Anasayfa
                        </Link>
                        <Link
                            href="/products"
                            onClick={() => setOpen(false)}
                            className="text-lg font-medium hover:text-primary transition-colors py-2"
                        >
                            Tüm Koleksiyon
                        </Link>

                        <div className="space-y-4 pt-2">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Kategoriler</h4>
                            <div className="flex flex-col space-y-3 pl-4 border-l-2">
                                <Link href="/categories/duvar-dekoru" onClick={() => setOpen(false)} className="hover:text-primary">Duvar Dekoru</Link>
                                <Link href="/categories/masa-ustu" onClick={() => setOpen(false)} className="hover:text-primary">Masa Üstü</Link>
                                <Link href="/categories/dogal-bohem" onClick={() => setOpen(false)} className="hover:text-primary">Doğal & Bohem</Link>
                                <Link href="/categories/hediyelik" onClick={() => setOpen(false)} className="hover:text-primary">Hediyelik</Link>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Hesabım</h4>
                            {user ? (
                                <div className="flex flex-col space-y-3 pl-4 border-l-2">
                                    {profile?.role === "admin" && (
                                        <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-primary text-blue-600">
                                            <span>Yönetim Paneli</span>
                                        </Link>
                                    )}
                                    <Link href="/account/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-primary">
                                        <User size={16} />
                                        <span>Profilim</span>
                                    </Link>
                                    <Link href="/account/orders" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-primary">
                                        <Package size={16} />
                                        <span>Siparişlerim</span>
                                    </Link>
                                    <button
                                        onClick={() => { signOut(); setOpen(false); }}
                                        className="flex items-center gap-2 hover:text-red-600 text-left text-muted-foreground"
                                    >
                                        <LogOut size={16} />
                                        <span>Çıkış Yap</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Button asChild variant="outline" className="w-full justify-start">
                                        <Link href="/login" onClick={() => setOpen(false)}>Giriş Yap</Link>
                                    </Button>
                                    <Button asChild className="w-full justify-start">
                                        <Link href="/register" onClick={() => setOpen(false)}>Kayıt Ol</Link>
                                    </Button>
                                </div>
                            )}
                        </div>

                        <Separator />

                        <Link
                            href="/about"
                            onClick={() => setOpen(false)}
                            className="text-lg font-medium hover:text-primary transition-colors py-2"
                        >
                            Hakkımızda
                        </Link>
                        <Link
                            href="/contact"
                            onClick={() => setOpen(false)}
                            className="text-lg font-medium hover:text-primary transition-colors py-2"
                        >
                            İletişim
                        </Link>
                    </nav>
                </ScrollArea>

                <div className="p-6 border-t bg-secondary/5 mt-auto">
                    <div className="flex gap-4 justify-center">
                        <Button variant="ghost" size="icon" className="hover:text-primary">
                            <Instagram size={20} />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:text-primary">
                            <Twitter size={20} />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:text-primary">
                            <Facebook size={20} />
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
