// Base wrapper for all emails to maintain consistent Yuvaa Store branding
function getBaseTemplate(title: string, content: string) {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FDFCF8; border-radius: 8px; border: 1px solid #eaeaea;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #c96530; font-family: Georgia, serif; font-size: 32px; margin: 0;">Yuvaa</h1>
        <p style="font-style: italic; color: #666; margin-top: 5px;">"Evinizin ruhunu yansıtan dokunuşlar."</p>
      </div>
      
      <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
        <h2 style="color: #333; font-size: 24px; margin-top: 0; text-align: center;">${title}</h2>
        ${content}
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Yuvaa Store. Tüm hakları saklıdır.</p>
        <p>Lütfen bu e-postayı yanıtlamayın. Destek için sitemizdeki iletişim formunu kullanabilirsiniz.</p>
      </div>
    </div>
    `;
}

// ---------------------------------------------------------------------------
// Support Ticket Templates
// ---------------------------------------------------------------------------

export function getTicketCreatedUserTemplate(subject: string, ticketUrl: string) {
  const content = `
    <p style="color: #555; font-size: 16px; line-height: 1.6;">
      Merhaba, <br><br>
      <strong>"${subject}"</strong> konulu destek talebiniz ekibimize ulaştı. 
      Müşteri temsilcilerimiz konuyu inceleyip en kısa sürede size dönüş yapacaktır.
    </p>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="${ticketUrl}" style="background-color: #c96530; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Talebimi Görüntüle</a>
    </div>
    `;
  return getBaseTemplate("Talebiniz Alındı", content);
}

export function getTicketCreatedAdminTemplate(userEmail: string, subject: string, message: string, ticketUrl: string) {
  const content = `
    <p style="color: #555; font-size: 16px; line-height: 1.6;">
      Sistemde yeni bir destek talebi oluşturuldu.
    </p>
    <div style="background-color: #F8F9FA; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #E9ECEF;">
      <p style="margin: 0 0 10px 0;"><strong>Kullanıcı:</strong> ${userEmail}</p>
      <p style="margin: 0 0 10px 0;"><strong>Konu:</strong> ${subject}</p>
      <p style="margin: 0;"><strong>Mesaj:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
    </div>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="${ticketUrl}" style="background-color: #333333; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Onayla ve Yanıtla</a>
    </div>
    `;
  return getBaseTemplate("Yeni Destek Talebi", content);
}

export function getTicketReplyTemplate(replyMessage: string, ticketUrl: string, isAdminReply: boolean) {
  const title = isAdminReply ? "Talebinize Yanıt Geldi" : "Yeni Müşteri Yanıtı";
  const greeting = isAdminReply ? "Merhaba," : "Sistem Bildirimi,";

  const content = `
    <p style="color: #555; font-size: 16px; line-height: 1.6;">
      ${greeting} <br><br>
      Destek talebinize yeni bir yanıt eklendi:
    </p>
    <div style="background-color: #F8F9FA; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #c96530;">
      <p style="margin: 0; color: #444; font-style: italic;">"${replyMessage.replace(/\n/g, '<br/>')}"</p>
    </div>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="${ticketUrl}" style="background-color: #c96530; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Mesajı Gör</a>
    </div>
    `;
  return getBaseTemplate(title, content);
}

export function getTicketStatusTemplate(status: string, ticketUrl: string) {
  let statusTr = status;
  switch (status) {
    case 'open': statusTr = 'Açık'; break;
    case 'in_progress': statusTr = 'İnceleniyor'; break;
    case 'resolved': statusTr = 'Çözüldü'; break;
    case 'closed': statusTr = 'Kapatıldı'; break;
  }

  const content = `
    <p style="color: #555; font-size: 16px; line-height: 1.6;">
      Merhaba, <br><br>
      Destek talebinizin durumu güncellenmiştir.
      <br/>
      Yeni Durum: <strong style="color: #c96530;">${statusTr}</strong>
    </p>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="${ticketUrl}" style="background-color: #c96530; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Talebimi Görüntüle</a>
    </div>
    `;
  return getBaseTemplate("Durum Güncellemesi", content);
}

// ---------------------------------------------------------------------------
// Order Templates
// ---------------------------------------------------------------------------

export function getOrderStatusTemplate(orderId: string, status: string, orderUrl: string) {
  let statusTr = status;
  let title = "Siparişiniz Güncellendi";
  let message = "Siparişinizin durumunda bir değişiklik oldu.";

  switch (status) {
    case 'pending':
      statusTr = 'Bekliyor';
      title = 'Siparişiniz Alındı';
      message = 'Siparişiniz başarıyla oluşturuldu ve onay bekliyor.';
      break;
    case 'processing':
      statusTr = 'Hazırlanıyor';
      title = 'Siparişiniz Hazırlanıyor';
      message = 'Siparişiniz onaylandı, paketleme işlemleri başladı.';
      break;
    case 'shipped':
      statusTr = 'Kargoya Verildi';
      title = 'Siparişiniz Yola Çıktı!';
      message = 'Paketiniz kargo firmasına teslim edilmiştir.';
      break;
    case 'delivered':
      statusTr = 'Teslim Edildi';
      title = 'Siparişiniz Teslim Edildi';
      message = 'Siparişiniz kargo firması tarafından size/alıcıya teslim edildi. Güzel günlerde kullanın!';
      break;
    case 'cancelled':
      statusTr = 'İptal Edildi';
      title = 'Siparişiniz İptal Edildi';
      message = 'Siparişiniz iptal edilmiştir. Bir sorun olduğunu düşünüyorsanız lütfen bizimle iletişime geçin.';
      break;
  }

  const content = `
    <p style="color: #555; font-size: 16px; line-height: 1.6;">
      Merhaba, <br><br>
      <strong style="color: #333;">#${orderId.substring(0, 8).toUpperCase()}</strong> numaralı siparişinizle ilgili güncel durum:
    </p>
    
    <div style="background-color: #F8F9FA; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center; border: 1px dashed #c96530;">
      <h3 style="margin: 0 0 10px 0; color: #c96530; font-size: 20px;">${statusTr}</h3>
      <p style="margin: 0; color: #666; font-size: 14px;">${message}</p>
    </div>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="${orderUrl}" style="background-color: #333333; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Sipariş Detayları</a>
    </div>
    `;
  return getBaseTemplate(title, content);
}

// ---------------------------------------------------------------------------
// Abandoned Cart Templates
// ---------------------------------------------------------------------------

export function getAbandonedCartTemplate(cartUrl: string, itemsHtml: string) {
  const title = "Sepetinizde Ürünler Unuttunuz!";

  const content = `
    <p style="color: #555; font-size: 16px; line-height: 1.6;">
      Merhaba, <br><br>
      Sitemizi ziyaret ettiğiniz için teşekkür ederiz. Görünüşe göre sepetinizde bazı harika ürünler bıraktınız.
      Onlar hala sizi bekliyor! Birlikte evinizin ruhunu yansıtacak detayları tamamlayalım.
    </p>
    
    <div style="background-color: #FDFCF8; padding: 20px; border-radius: 6px; margin: 25px 0; border: 1px solid #eaeaea;">
      <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">Sepetinizdeki Ürünler:</h3>
      ${itemsHtml}
    </div>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="${cartUrl}" style="background-color: #c96530; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px rgba(201, 101, 48, 0.2);">Alışverişi Tamamla</a>
    </div>
    
    <p style="color: #888; font-size: 14px; text-align: center; margin-top: 30px;">
      Sipariş sürecinde bir sorun yaşadıysanız, bize her zaman ulaşabilirsiniz.
    </p>
    `;
  return getBaseTemplate(title, content);
}
