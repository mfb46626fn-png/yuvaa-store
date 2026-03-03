import * as z from "zod";

export const loginSchema = z.object({
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
});

export const registerSchema = loginSchema.extend({
    fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
    phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
});

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
    confirmPassword: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"], // set the path of the error
});

export type AuthFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
