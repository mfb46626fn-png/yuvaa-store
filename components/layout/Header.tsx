"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartSheet } from "@/components/cart/CartSheet";
import { MobileNav } from "@/components/layout/MobileNav";
import { Search, User, LogOut, ShoppingBag, LayoutDashboard, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
    const pathname = usePathname();
    const { user, profile, signOut } = useAuth();

    // Do not show header on admin pages
    if (pathname?.startsWith("/admin")) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Mobile Menu */}
                <div className="flex items-center md:hidden">
                    <MobileNav />
                </div>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-serif text-2xl font-bold tracking-tight text-primary">
                        Yuvaa
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                        Anasayfa
                    </Link>
                    <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
                        Tüm Koleksiyon
                    </Link>
                    <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
                        Kategoriler
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                        Hakkımızda
                    </Link>
                    <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                        İletişim
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="hidden sm:flex hover:text-primary">
                        <Search size={20} />
                    </Button>

                    <CartSheet />

                    {/* Auth Dropdown */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{profile?.full_name || "Kullanıcı"}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {profile?.role === "admin" && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin">
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                <span>Yönetim Paneli</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem asChild>
                                        <Link href="/account/profile">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profilim</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/account/orders">
                                            <ShoppingBag className="mr-2 h-4 w-4" />
                                            <span>Siparişlerim</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Çıkış Yap</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/login">Giriş Yap</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/register">Kayıt Ol</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
