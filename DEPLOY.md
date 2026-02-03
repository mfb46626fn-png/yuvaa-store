# Yuvaa Store Yayına Alma Rehberi 🚀

Projeniz yerel bilgisayarınızda hazır ve `git` ile kaydedildi. Şimdi bunu internete açmak için aşağıdaki adımları izleyin.

## 1. GitHub Reposu Oluşturma
1.  [github.com/new](https://github.com/new) adresine gidin.
2.  **Repository name**: `yuvaa-store` (veya istediğiniz bir isim).
3.  **Public** veya **Private** seçin.
4.  "Initialize with README" vb. seçenekleri **İŞARETLEMEYİN** (boş olmalı).
5.  "Create repository" butonuna basın.

## 2. Kodu GitHub'a Yükleme
GitHub'da repoyu oluşturduktan sonra size verilen linki (`https://github.com/KULLANICI_ADI/yuvaa-store.git`) kopyalayın ve terminalde şu komutları çalıştırın:

```bash
# Mevcut ana dalı 'main' olarak adlandır
git branch -M main

# Uzak sunucuyu ekle (LINK_BURAYA kısmını kendi GitHub linkinizle değiştirin)
git remote add origin https://github.com/KULLANICI_ADI/yuvaa-store.git

# Kodları gönder
git push -u origin main
```

## 3. Vercel ile Yayına Alma (Deploy)
1.  [vercel.com/new](https://vercel.com/new) adresine gidin.
2.  **Import Git Repository** kısmından GitHub hesabınızı seçin ve az önce yüklediğiniz `yuvaa-store` reposunu bulun, "Import" deyin.
3.  **Configure Project** ekranında:
    *   **Framework Preset**: Next.js (Otomatik seçili olmalı).
    *   **Environment Variables**: Supabase ayarlarını buraya eklemelisiniz.
        *   `NEXT_PUBLIC_SUPABASE_URL`: (Supabase panelinizden alın)
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Supabase panelinizden alın)
4.  **Deploy** butonuna basın.

Yaklaşık 1-2 dakika içinde siteniz `https://yuvaa-store.vercel.app` gibi bir adreste yayına girecektir! 🎉

## Notlar
*   **Supabase Site URL**: Supabase panelinde **Authentication > URL Configuration** kısmına gidin ve **Site URL** kısmına Vercel'in size verdiği yeni adresi (örn: `https://yuvaa-store.vercel.app`) yapıştırın. Bu, Google girişinin çalışması için şarttır.
*   **Redirect URLs**: Yine aynı yerde `https://yuvaa-store.vercel.app/**` ekleyin.
