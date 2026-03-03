"use client";

import { useState, useEffect } from "react";
import { Star, Upload, Loader2, X, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";

interface Review {
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    images: string[];
    created_at: string;
}

export function ProductReviews({ productId }: { productId: string }) {
    const supabase = createClient();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        user_name: "",
        rating: 5,
        comment: "",
    });
    const [images, setImages] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?productId=${productId}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error("Failed to load reviews:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            // Limit to 3 images max
            const remainingSlots = 3 - images.length;
            const allowedFiles = filesArray.slice(0, remainingSlots);

            setImages(prev => [...prev, ...allowedFiles]);

            // Create object URLs for preview
            const newUrls = allowedFiles.map(file => URL.createObjectURL(file));
            setImageUrls(prev => [...prev, ...newUrls]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImageUrls(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const uploadImages = async (): Promise<string[]> => {
        const uploadedUrls: string[] = [];

        for (const file of images) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `user_uploads/${fileName}`;

            const { data, error } = await supabase.storage
                .from('reviews')
                .upload(filePath, file);

            if (error) {
                console.error('Error uploading image:', error);
                throw error;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('reviews')
                .getPublicUrl(filePath);

            uploadedUrls.push(publicUrl);
        }

        return uploadedUrls;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.user_name.trim() || !formData.comment.trim()) {
            toast.error("Lütfen isminizi ve yorumunuzu girin.");
            return;
        }

        setIsSubmitting(true);
        try {
            let uploadedImageUrls: string[] = [];

            if (images.length > 0) {
                uploadedImageUrls = await uploadImages();
            }

            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product_id: productId,
                    ...formData,
                    images: uploadedImageUrls,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Bir hata oluştu");

            toast.success("Yorumunuz başarıyla gönderildi!", {
                description: "Onaylandıktan sonra bu sayfada yayınlanacaktır."
            });

            setIsDialogOpen(false);
            setFormData({ user_name: "", rating: 5, comment: "" });
            setImages([]);
            setImageUrls([]);

        } catch (error: any) {
            toast.error("Yorum gönderilemedi", { description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <div className="mt-12 border-t pt-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-serif font-medium">Müşteri Yorumları</h2>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${star <= parseFloat(averageRating) ? "fill-orange-400 text-orange-400" : "fill-muted text-muted"}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-medium">{averageRating} / 5.0</span>
                        <span className="text-sm text-muted-foreground">({reviews.length} Değerlendirme)</span>
                    </div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Yorum Yaz</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Ürünü Değerlendirin</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Puanınız</Label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= formData.rating ? "fill-orange-400 text-orange-400" : "fill-muted text-muted"}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="user_name">İsim Soyisim</Label>
                                <Input
                                    id="user_name"
                                    value={formData.user_name}
                                    onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="comment">Yorumunuz</Label>
                                <Textarea
                                    id="comment"
                                    rows={4}
                                    value={formData.comment}
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Fotoğraf Ekle (Opsiyonel, Max 3)</Label>
                                {images.length < 3 && (
                                    <div className="relative border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleImageChange}
                                        />
                                        <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                                        <span className="text-sm text-muted-foreground">Tıklayın veya Fotoğraf Seçin</span>
                                    </div>
                                )}

                                {images.length > 0 && (
                                    <div className="flex gap-2 mt-2">
                                        {imageUrls.map((url, i) => (
                                            <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden border">
                                                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(i)}
                                                    className="absolute top-1 right-1 bg-black/50 hover:bg-black text-white rounded-full p-0.5"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {isSubmitting ? "Gönderiliyor..." : "Yorumu Gönder"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Display Reviews */}
            {isLoading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            ) : reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="border rounded-xl p-5 bg-card text-card-foreground shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-semibold">{review.user_name}</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-3.5 h-3.5 ${star <= review.rating ? "fill-orange-400 text-orange-400" : "fill-muted text-muted"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground pr-1">
                                    {new Date(review.created_at).toLocaleDateString('tr-TR')}
                                </span>
                            </div>
                            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                {review.comment}
                            </p>

                            {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                                    {review.images.map((img, i) => (
                                        <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="block w-20 h-20 rounded-md overflow-hidden border hover:opacity-90 transition-opacity">
                                            <img src={img} alt="Müşteri fotoğrafı" className="w-full h-full object-cover" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 px-4 border rounded-xl border-dashed bg-muted/10">
                    <MessageSquareText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" strokeWidth={1.5} />
                    <h3 className="text-lg font-medium text-foreground">Henüz değerlendirme yok</h3>
                    <p className="text-muted-foreground text-sm mt-1 max-w-sm mx-auto">
                        Bu ürün için ilk yorumu yapan siz olun. Düşünceleriniz bizim ve diğer müşterilerimiz için çok değerli.
                    </p>
                </div>
            )}
        </div>
    );
}
