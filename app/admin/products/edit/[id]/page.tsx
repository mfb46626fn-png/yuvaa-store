"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { ProductForm } from "@/components/admin/ProductForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!params?.id) return;

            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", params.id)
                .single();

            if (error) {
                console.error("Error fetching product:", error);
                toast.error("Ürün bulunamadı");
                router.push("/admin/products");
            } else {
                setProduct(data);
            }
            setIsLoading(false);
        };

        fetchProduct();
    }, [params, router]);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return <ProductForm initialData={product} />;
}
