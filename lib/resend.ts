import { Resend } from 'resend';

// Only initialize if API key is present to prevent build errors
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const FROM_EMAIL = 'support@resend.dev'; // Replace with your verified domain in production
const ADMIN_EMAIL = 'info@yuvaastore.com'; // Replace with actual admin email

export async function sendTicketCreatedEmail(
    ticketId: string,
    userEmail: string,
    subject: string,
    message: string
) {
    if (!resend) return;

    // Notify Admin
    await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `[Yeni Destek Talebi] ${subject}`,
        html: `
            <h1>Yeni Destek Talebi</h1>
            <p><strong>Kullanıcı:</strong> ${userEmail}</p>
            <p><strong>Konu:</strong> ${subject}</p>
            <p><strong>Mesaj:</strong></p>
            <p>${message}</p>
            <br/>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/support/${ticketId}">Talebi Görüntüle</a>
        `
    });

    // Notify User
    await resend.emails.send({
        from: FROM_EMAIL,
        to: userEmail,
        subject: `Destek Talebiniz Alındı: ${subject}`,
        html: `
            <h1>Talebiniz Alındı</h1>
            <p>Merhaba,</p>
            <p>Destek talebiniz bize ulaştı. En kısa sürede dönüş yapacağız.</p>
            <br/>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/support/${ticketId}">Talebi Görüntüle</a>
        `
    });
}

export async function sendReplyEmail(
    ticketId: string,
    toEmail: string,
    replyMessage: string,
    isAdminReply: boolean
) {
    if (!resend) return;

    const subject = isAdminReply
        ? "Destek Talebiniz Yanıtlandı"
        : "Yeni Yanıt Var";

    const link = isAdminReply
        ? `${process.env.NEXT_PUBLIC_APP_URL}/account/support/${ticketId}`
        : `${process.env.NEXT_PUBLIC_APP_URL}/admin/support/${ticketId}`;

    await resend.emails.send({
        from: FROM_EMAIL,
        to: toEmail,
        subject: subject,
        html: `
            <h1>Yeni Mesaj</h1>
            <p>${replyMessage}</p>
            <br/>
            <a href="${link}">Talebi Görüntüle</a>
        `
    });
}

export async function sendTicketStatusEmail(
    ticketId: string,
    userEmail: string,
    status: string
) {
    if (!resend) return;

    await resend.emails.send({
        from: FROM_EMAIL,
        to: userEmail,
        subject: `Destek Talebiniz Güncellendi: ${status}`,
        html: `
            <h1>Durum Güncellemesi</h1>
            <p>Destek talebinizin durumu <strong>${status}</strong> olarak güncellendi.</p>
            <br/>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/support/${ticketId}">Talebi Görüntüle</a>
        `
    });
}
