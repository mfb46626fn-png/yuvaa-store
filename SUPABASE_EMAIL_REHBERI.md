# Supabase E-posta ve Domain Ayarları Rehberi

Şu anda e-postalarda `localhost:3000` veya karmaşık `supabase.co` linklerinin görünmesini engellemek ve maillerin doğrudan sizin alan adınızdan (`yuvaastore.com`) gitmesi için aşağıdaki 3 adımı izlemelisiniz.

---

## ADIM 1: Site URL ve Yönlendirme Ayarlarını Düzeltmek

Supabase Dashboard'a giriş yapın ve projenizi seçin.
1. Sol menüden **Authentication** > **URL Configuration** sekmesine gidin.
2. **Site URL** kısmına canlı sitenizin adresini yazın: `https://yuvaastore.com` (veya vercel linkiniz).
3. **Redirect URLs** kısmına şu linkleri ekleyin:
   - `https://yuvaastore.com/**`
   - Test için lokali tutmak isterseniz `http://localhost:3000/**` de kalabilir.

---

## ADIM 2: Kendi Domaininiz ile E-posta Göndermek (SMTP Ayarı)

Supabase varsayılan olarak `noreply@mail.app.supabase.io` adresinden mail atar. Bunu düzeltmek için:

1. Menüden **Project Settings** (Sol en alttaki çark ikonu) > **Authentication** sekmesine gidin.
2. Aşağı kaydırıp **SMTP Settings** bölümünü bulun ve **Enable Custom SMTP** seçeneğini açın.
3. Resend kullanıyorsanız bilgileri şu şekilde girin:
   - **Sender email:** `info@yuvaastore.com` (Veya Resend'de doğruladığınız adres)
   - **Sender name:** `Yuvaa Store`
   - **Host:** `smtp.resend.com`
   - **Port:** `465`
   - **Username:** `resend`
   - **Password:** Resend'den oluşturduğunuz API Key
4. Kaydedin.

> **ÖNEMLİ (SPAM SORUNU):** Eğer attığınız mailler Spam'e düşüyorsa veya Resend hata veriyorsa, bunun en büyük sebebi Resend paneline gidip alan adınızı (yuvaastore.com) DNS kayıtları (TXT, MX vb.) ile Hostinger/Cloudflare üzerinden **doğrulamamış** olmanızdır. Resend > Domains menüsündeki DNS işlemlerini mutlaka yapın.

---

## ADIM 3: Türkçe ve Tamamen Kendi Domaininize Ait Şablonlar

Sol menüden **Authentication** > **Email Templates** sekmesine gidin. Aşağıdaki şablonları ilgili bölümlerin **Source** kısmına yapıştırın.

**DİKKAT:** Kodu kopyalarken lütfen **sadece** `<div ...` ile başlayan kısımdan `</div>` ile biten kısma kadar kopyalayın. Aşağıdaki bloklarda başlık, not veya markdown (```) işaretlerini SAKIN ALMAYIN. Bozuk metin eklerseniz mail Spam'e düşer ve tasarım bozulur!

---

### 1. Confirm Signup (Hesap Doğrulama)

Bu şablon, yeni kayıt olan kullanıcıların hesabını doğrulaması içindir. Artık doğrudan `yuvaastore.com/auth/confirm` üzerinden çalışacaktır.

**Subject:** Yuvaa Store'a Hoş Geldiniz - Hesabınızı Doğrulayın

**Message Body (Source sekmesine yapıştırın - Sadece içindeki kodu alın):**

<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FDFCF8; border-radius: 8px; border: 1px solid #eaeaea;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #c96530; font-family: Georgia, serif; font-size: 32px; margin: 0;">Yuvaa</h1>
    <p style="font-style: italic; color: #666; margin-top: 5px;">"Evinizin ruhunu yansıtan dokunuşlar."</p>
  </div>
  
  <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
    <h2 style="color: #333; font-size: 24px; margin-top: 0; text-align: center;">Aramıza Hoş Geldiniz!</h2>
    <p style="color: #555; font-size: 16px; line-height: 1.6;">
      Merhaba, <br><br>
      Yuvaa Store hesabı oluşturduğunuz için teşekkür ederiz. Alışverişe başlamak ve favori dekorasyon ürünlerinizi keşfetmek için hesabınızı doğrulamanız gerekmektedir.
    </p>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup&next=/login" style="background-color: #c96530; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Hesabımı Doğrula</a>
    </div>
    
  </div>
  
  <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
    <p>&copy; 2024 Yuvaa Store. Tüm hakları saklıdır.</p>
    <p>Bu e-postayı siz talep etmediyseniz, görmezden gelebilirsiniz.</p>
  </div>
</div>

---

### 2. Reset Password (Şifre Sıfırlama)

Bu şablon, "Şifremi Unuttum" diyen kullanıcılara gidecektir. Bu da `yuvaastore.com` domaininiz üzerinden çalışacaktır.

**Subject:** Şifre Sıfırlama Talebiniz - Yuvaa Store

**Message Body (Source sekmesine yapıştırın - Sadece içindeki kodu alın):**

<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FDFCF8; border-radius: 8px; border: 1px solid #eaeaea;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #c96530; font-family: Georgia, serif; font-size: 32px; margin: 0;">Yuvaa</h1>
  </div>
  
  <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
    <h2 style="color: #333; font-size: 24px; margin-top: 0; text-align: center;">Şifremi Sıfırla</h2>
    <p style="color: #555; font-size: 16px; line-height: 1.6;">
      Merhaba, <br><br>
      Yuvaa Store hesabınız için bir şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz.
    </p>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password" style="background-color: #c96530; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Şifremi Yenile</a>
    </div>
    
    <p style="color: #777; font-size: 14px; line-height: 1.5; border-top: 1px solid #eee; padding-top: 20px;">
      Bu talebi siz yapmadıysanız lütfen bu e-postayı dikkate almayın ve şifrenizi kimseyle paylaşmayın.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
    <p>&copy; 2024 Yuvaa Store. Tüm hakları saklıdır.</p>
  </div>
</div>
