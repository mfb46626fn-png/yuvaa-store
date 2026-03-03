import { Resend } from 'resend';
import {
    getTicketCreatedUserTemplate,
    getTicketCreatedAdminTemplate,
    getTicketReplyTemplate,
    getTicketStatusTemplate,
    getOrderStatusTemplate
} from './email-templates';

// Only initialize if API key is present to prevent build errors
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const FROM_EMAIL = 'info@yuvaastore.com'; // Verified domain
const ADMIN_EMAIL = 'info@yuvaastore.com';

export async function sendTicketCreatedEmail(
    ticketId: string,
    userEmail: string,
    subject: string,
    message: string
) {
    if (!resend) return;

    const adminTicketUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/support/${ticketId}`;
    const userTicketUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account/support/${ticketId}`;

    // Notify Admin
    await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `[Yeni Destek Talebi] ${subject}`,
        html: getTicketCreatedAdminTemplate(userEmail, subject, message, adminTicketUrl)
    });

    // Notify User
    await resend.emails.send({
        from: FROM_EMAIL,
        to: userEmail,
        subject: `Destek Talebiniz Alındı: ${subject}`,
        html: getTicketCreatedUserTemplate(subject, userTicketUrl)
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
        ? "Destek Talebiniz Yanıtlandı - Yuvaa Store"
        : "[Yeni Yanıt] Destek Talebi: " + ticketId;

    const link = isAdminReply
        ? `${process.env.NEXT_PUBLIC_APP_URL}/account/support/${ticketId}`
        : `${process.env.NEXT_PUBLIC_APP_URL}/admin/support/${ticketId}`;

    await resend.emails.send({
        from: FROM_EMAIL,
        to: toEmail,
        subject: subject,
        html: getTicketReplyTemplate(replyMessage, link, isAdminReply)
    });
}

export async function sendTicketStatusEmail(
    ticketId: string,
    userEmail: string,
    status: string
) {
    if (!resend) return;

    const userTicketUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account/support/${ticketId}`;

    await resend.emails.send({
        from: FROM_EMAIL,
        to: userEmail,
        subject: `Destek Talebiniz Güncellendi - Yuvaa Store`,
        html: getTicketStatusTemplate(status, userTicketUrl)
    });
}

export async function sendOrderStatusEmail(
    orderId: string,
    userEmail: string,
    status: string
) {
    if (!resend) return;

    const orderUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account/orders`;
    let subjectPrefix = 'Siparişiniz Güncellendi';

    if (status === 'shipped') subjectPrefix = 'Siparişiniz Kargoya Verildi';
    if (status === 'delivered') subjectPrefix = 'Siparişiniz Teslim Edildi';

    await resend.emails.send({
        from: FROM_EMAIL,
        to: userEmail,
        subject: `${subjectPrefix} - Yuvaa Store`,
        html: getOrderStatusTemplate(orderId, status, orderUrl)
    });
}
