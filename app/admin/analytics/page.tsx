import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { RecoveryButton } from "@/components/admin/RecoveryButton";

export const metadata = {
    title: "Analitik ve Satış Hunisi | Yuvaa Store Admin",
};

export default async function AnalyticsPage() {
    const supabase = await createServerSupabaseClient();

    // Fetch raw analytics events
    const { data: events, error } = await supabase
        .from("analytics_events")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return <div className="p-6">Veriler yüklenirken bir hata oluştu: {error.message}</div>;
    }

    const eventList = events || [];

    // Calculate funnel metrics
    const addToCartEvents = eventList.filter(e => e.event_type === 'add_to_cart');
    const beginCheckoutEvents = eventList.filter(e => e.event_type === 'begin_checkout');
    const contactEnteredEvents = eventList.filter(e => e.event_type === 'checkout_contact_entered');
    const recoverySentEvents = eventList.filter(e => e.event_type === 'recovery_email_sent');

    // Create maps for quick lookup
    const emailBySession = new Map<string, string>();
    contactEnteredEvents.forEach(e => {
        if (e.event_data?.email) {
            emailBySession.set(e.session_id, e.event_data.email);
        }
    });

    const recoverySentBySession = new Set(recoverySentEvents.map(e => e.session_id));

    // Group by session to find unique abandoned sessions
    const uniqueSessionsWithCart = new Set(addToCartEvents.map(e => e.session_id));
    const uniqueSessionsWithCheckout = new Set(beginCheckoutEvents.map(e => e.session_id));

    // Fetch actual completed orders to cross-reference (Basic logic)
    const { data: orders } = await supabase
        .from("orders")
        .select("created_at");

    const completedOrdersCount = orders?.length || 0;

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analitik & Satış Hunisi</h1>
                <p className="text-muted-foreground mt-2">
                    Müşterilerin sepete ekleme ve ödemeye geçiş davranışlarını, terk edilen sepet oranlarını buradan takip edebilirsiniz.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Toplanan Sinyal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{eventList.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Veritabanındaki toplam aktivite</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Eşsiz "Sepete Ekle" (Oturum)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{uniqueSessionsWithCart.size}</div>
                        <p className="text-xs text-muted-foreground mt-1">Farklı müşteri sepetleri</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Eşsiz "Ödemeye Geç" (Oturum)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{uniqueSessionsWithCheckout.size}</div>
                        <p className="text-xs text-muted-foreground mt-1">Checkout sayfasına ulaşanlar</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Sipariş</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{completedOrdersCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Başarılı satın almalar</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Son Terk Edilen & Aktif Oturumlar</CardTitle>
                    <CardDescription>Sitedeki en son "Sepete Ekle" ve "Ödemeye Başla" sinyalleri.</CardDescription>
                </CardHeader>
                <CardContent>
                    {eventList.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Henüz yeterli veri toplanmadı.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Tarih</th>
                                        <th className="px-4 py-3 font-medium">Aksiyon</th>
                                        <th className="px-4 py-3 font-medium">Oturum ID (Gizli)</th>
                                        <th className="px-4 py-3 font-medium">Detay</th>
                                        <th className="px-4 py-3 font-medium text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eventList.slice(0, 15).map((event) => {
                                        const email = emailBySession.get(event.session_id);
                                        const alreadySent = recoverySentBySession.has(event.session_id);

                                        return (
                                            <tr key={event.id} className="border-b last:border-0 hover:bg-muted/30">
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {format(new Date(event.created_at), "d MMM yyyy, HH:mm", { locale: tr })}
                                                </td>
                                                <td className="px-4 py-3 font-medium">
                                                    {event.event_type === "begin_checkout" ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                                                            Ödemeye Geçti
                                                        </span>
                                                    ) : event.event_type === "checkout_contact_entered" ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs">
                                                            İletişim Girildi
                                                        </span>
                                                    ) : event.event_type === "recovery_email_sent" ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                                                            Mail Gönderildi
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs">
                                                            Sepete Ekledi
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                                                    <div className="font-semibold text-foreground mb-1">
                                                        {email || 'Bilinmiyor'}
                                                    </div>
                                                    {event.session_id.split("-")[0]}...
                                                </td>
                                                <td className="px-4 py-3">
                                                    {event.event_type === "begin_checkout" ? (
                                                        <div className="text-xs">
                                                            Sepet Tutarı: <b>{event.event_data?.cartTotal || 0}₺</b> ( {event.event_data?.items || 0} Ürün )
                                                        </div>
                                                    ) : event.event_type === "checkout_contact_entered" || event.event_type === "recovery_email_sent" ? (
                                                        <div className="text-xs text-muted-foreground">
                                                            Sistem İşlemi
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs truncate max-w-[200px]" title={event.event_data?.product?.title}>
                                                            {event.event_data?.product?.title || "Bilinmeyen Ürün"}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {event.event_type === "begin_checkout" && email && (
                                                        <RecoveryButton
                                                            sessionId={event.session_id}
                                                            email={email}
                                                            alreadySent={alreadySent}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
