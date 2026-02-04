import * as z from "zod";

export const productSchema = z.object({
    title: z.string().min(3, "Ürün adı en az 3 karakter olmalıdır"),
    description: z.string().optional(),
    price: z.coerce.number().min(0.01, "Fiyat 0'dan büyük olmalıdır"),
    salePrice: z.coerce.number().optional().nullable(),
    stockQuantity: z.coerce.number().int().min(0, "Stok negatif olamaz"),
    categoryId: z.string().min(1, "Kategori seçiniz").nullable(),
    material: z.string().optional(),
    dimensions: z.string().optional(),
    isPersonalized: z.boolean().default(false),
    // Images are handled separately via dropzone state usually, but can be part of form if using hidden inputs
    // For now, we'll keep images separate or validate them manually before submission as they are arrays
});

export type ProductFormValues = z.infer<typeof productSchema>;
