import * as z from "zod";

export const authSchema = z.object({
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"), // Changed from 6 to 8 as requested
    fullName: z.string().optional(),
    phone: z.string().min(10, "Geçerli bir telefon numarası giriniz").optional(),
});

export type AuthFormValues = z.infer<typeof authSchema>;
