"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        hero_title: "",
        hero_description: "",
        hero_button_text: "",
        hero_image_url: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from("site_settings")
                    .select("*")
                    .single();

                if (error && error.code !== 'PGRST116') { // Ignore missing row (defaults)
                    throw error;
                }

                if (data) {
                    setSettings({
                        hero_title: data.hero_title || "",
                        hero_description: data.hero_description || "",
                        hero_button_text: data.hero_button_text || "",
                        hero_image_url: data.hero_image_url || "",
                    });
                }
            } catch (error) {
                console.error("Settings fetch error:", error);
                toast.error("Ayarlar yüklenemedi.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, [supabase]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Update or Insert (Upsert) - ID is always 1
            const { error } = await supabase
                .from("site_settings")
                .upsert({
                    id: 1,
                    ...settings,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            toast.success("Site ayarları güncellendi! 🎉");
        } catch (error) {
            console.error("Settings save error:", error);
            toast.error("Kaydetme başarısız.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div>Yükleniyor...</div>;

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Site Ayarları</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ana Sayfa (Hero) Düzenleme</CardTitle>
                    <CardDescription>
                        Sitenizin giriş ekranındaki büyük görseli ve yazıları buradan yönetebilirsiniz.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="hero_title">Başlık (Büyük Yazı)</Label>
                        <Input
                            id="hero_title"
                            value={settings.hero_title}
                            onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                            placeholder="Örn: Evinizin Ruhu: Yuvaa"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="hero_description">Açıklama (Alt Yazı)</Label>
                        <Textarea
                            id="hero_description"
                            value={settings.hero_description}
                            onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
                            placeholder="Örn: El yapımı detaylar..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="hero_button_text">Buton Yazısı</Label>
                            <Input
                                id="hero_button_text"
                                value={settings.hero_button_text}
                                onChange={(e) => setSettings({ ...settings, hero_button_text: e.target.value })}
                                placeholder="Örn: Koleksiyonu Keşfet"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="hero_image_url">Görsel URL</Label>
                            <Input
                                id="hero_image_url"
                                value={settings.hero_image_url}
                                onChange={(e) => setSettings({ ...settings, hero_image_url: e.target.value })}
                                placeholder="/images/hero-bg.jpg"
                            />
                            <p className="text-xs text-muted-foreground">
                                Dosyalarım'a yüklediğiniz görselin linkini buraya yapıştırın.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto">
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
