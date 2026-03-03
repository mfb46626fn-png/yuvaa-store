import { createServerSupabaseClient } from "@/lib/supabase-server";
import {
    Star, CheckCircle, MessageSquareText,
    Users,
    Store,
    Mail,
    Package,
    Trash2,
    XCircle,
    ImageIcon,
    RotateCcw
} from "lucide-react";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Yorum Yönetimi | Admin Paneli",
};

export default async function AdminReviewsPage() {
    const supabase = await createServerSupabaseClient();

    // Fetch all reviews, join with products to get product title
    const { data: reviews, error } = await supabase
        .from("product_reviews")
        .select(`
    *,
    products(
        title,
        slug,
        images
    )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Yorumlar yüklenirken hata:", error);
    }

    async function toggleApproval(reviewId: string, currentStatus: boolean, e: FormData) {
        "use server";
        const supabase = await createServerSupabaseClient();
        console.log("toggleApproval", reviewId, currentStatus)
        const { error } = await supabase
            .from("product_reviews")
            .update({ is_approved: !currentStatus })
            .eq("id", reviewId);

        if (error) {
            console.error("Yorum durumu güncellenemedi:", error);
        } else {
            revalidatePath("/admin/reviews");
        }
    }

    async function deleteReview(reviewId: string, images: string[], e: FormData) {
        "use server";
        const supabase = await createServerSupabaseClient();

        if (images && images.length > 0) {
            const filePaths = images.map(url => {
                const parts = url.split('/');
                return `user_uploads / ${parts[parts.length - 1]} `;
            });

            await supabase.storage.from('reviews').remove(filePaths);
        }

        const { error } = await supabase
            .from("product_reviews")
            .delete()
            .eq("id", reviewId);

        if (error) {
            console.error("Yorum silinemedi:", error);
        } else {
            revalidatePath("/admin/reviews");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Yorumları</h1>
                    <p className="text-muted-foreground mt-1">
                        Sitenize yapılan tüm ürün değerlendirmeleri buradan onaylanır veya reddedilir.
                    </p>
                </div>
            </div>

            {reviews && reviews.length > 0 ? (
                <div className="grid gap-6">
                    {reviews.map((review) => (
                        <Card key={review.id} className={review.is_approved ? "border-green-500/30" : "border-orange-500/50"}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Product Info (Left Side) */}
                                    <div className="w-full md:w-1/4 flex flex-row md:flex-col items-center md:items-start gap-4 border-b md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-4">
                                        {review.products?.images?.[0] ? (
                                            <img
                                                src={review.products.images[0]}
                                                alt={review.products.title}
                                                className="w-16 h-16 md:w-full md:h-32 object-cover rounded-md border"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 md:w-full md:h-32 bg-secondary rounded-md flex items-center justify-center">
                                                <ImageIcon className="text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="flex-1 md:w-full">
                                            <p className="font-semibold line-clamp-2 md:mb-2">{review.products?.title || "Bilinmeyen Ürün"}</p>
                                            <div className="flex items-center gap-1 mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w - 4 h - 4 ${star <= review.rating ? "fill-orange-400 text-orange-400" : "fill-muted text-muted"} `}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Review Content (Middle) */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-lg">{review.user_name}</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(review.created_at).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })}
                                                </p>
                                            </div>
                                            <Badge variant={review.is_approved ? "default" : "secondary"} className={review.is_approved ? "bg-green-600 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-600 text-white"}>
                                                {review.is_approved ? "Yayında" : "Onay Bekliyor"}
                                            </Badge>
                                        </div>

                                        <p className="text-foreground/90 whitespace-pre-wrap mb-4 bg-muted/30 p-4 rounded-lg border">
                                            {review.comment}
                                        </p>

                                        {review.images && review.images.length > 0 && (
                                            <div className="flex gap-2">
                                                {review.images.map((img: string, i: number) => (
                                                    <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="block w-20 h-20 rounded-md overflow-hidden border hover:opacity-90 transition-opacity">
                                                        <img src={img} alt="Müşteri fotoğrafı" className="w-full h-full object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions (Right Side) */}
                                    <div className="w-full md:w-48 flex md:flex-col gap-2 justify-end md:justify-start border-t md:border-t-0 pt-4 md:pt-0">
                                        <form action={toggleApproval.bind(null, review.id, review.is_approved)} className="flex-1 md:flex-none">
                                            <Button
                                                type="submit"
                                                variant={review.is_approved ? "outline" : "default"}
                                                className={`w - full ${!review.is_approved ? "bg-green-600 hover:bg-green-700" : ""} `}
                                            >
                                                {review.is_approved ? (
                                                    <><XCircle className="w-4 h-4 mr-2" /> Yayından Kaldır</>
                                                ) : (
                                                    <><CheckCircle className="w-4 h-4 mr-2" /> Onayla & Yayınla</>
                                                )}
                                            </Button>
                                        </form>

                                        <form action={deleteReview.bind(null, review.id, review.images || [])} className="flex-1 md:flex-none">
                                            <Button type="submit" variant="destructive" className="w-full">
                                                <Trash2 className="w-4 h-4 mr-2" /> Kökten Sil
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <Star className="w-12 h-12 mb-4 text-muted" />
                        <h3 className="text-lg font-medium text-foreground">Henüz ürün değerlendirmesi yok</h3>
                        <p>Müşterileriniz ürünlerinizi değerlendirdiğinde yorumlar burada onayınıza sunulacaktır.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
