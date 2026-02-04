import * as z from "zod";

// Regex to ban HTML characters < > /
const noHtmlRegex = /^[^<>/]*$/;
const noHtmlMessage = "Geçersiz karakterler (<, >, /) içeremez";

export const checkoutSchema = z.object({
    firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır").regex(noHtmlRegex, noHtmlMessage),
    lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır").regex(noHtmlRegex, noHtmlMessage),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    phone: z.string().min(10, "Geçerli bir telefon numarası giriniz").regex(noHtmlRegex, noHtmlMessage),
    address: z.string().min(10, "Adres en az 10 karakter olmalıdır").regex(noHtmlRegex, noHtmlMessage),
    city: z.string().min(2, "Şehir seçiniz"),
    district: z.string().min(2, "İlçe giriniz").regex(noHtmlRegex, noHtmlMessage),
    zipCode: z.string().min(5, "Posta kodu giriniz").regex(noHtmlRegex, noHtmlMessage),
    cardHolder: z.string().min(5, "Kart üzerindeki ismi giriniz").regex(noHtmlRegex, noHtmlMessage),
    cardNumber: z.string().regex(/^\d{16}$/, "Kart numarası 16 haneli olmalıdır"),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "AA/YY formatında olmalıdır"),
    cvv: z.string().regex(/^\d{3,4}$/, "CVV 3 veya 4 haneli olmalıdır"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
