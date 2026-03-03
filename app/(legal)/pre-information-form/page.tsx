import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
    title: "Ön Bilgilendirme Formu | Yuvaa Store",
};

export default function PreInformationFormPage() {
    return (
        <div className="bg-background min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="font-serif text-3xl font-medium text-foreground mb-8">Ön Bilgilendirme Formu</h1>

                <div className="prose prose-stone max-w-none text-sm text-muted-foreground space-y-6">
                    <p className="font-semibold text-foreground">1. SATICI BİLGİLERİ</p>
                    <p>
                        Ünvanı: Yuvaa Store<br />
                        Adres: Aydın, Nazilli, Türkiye<br />
                        Telefon: 0505 254 77 86<br />
                        E-posta: info@yuvaastore.com
                    </p>

                    <p className="font-semibold text-foreground">2. KONU</p>
                    <p>
                        İşbu Ön Bilgilendirme Formu'nun ("Form") konusu, ALICI'nın, SATICI'ya ait www.yuvaastore.com uzantılı internet sitesinden ("İnternet Sitesi") sipariş vererek satın almak istediği, İnternet Sitesi'nde nitelikleri ve satış fiyatı belirtilen ürünlerin satışı ve teslimi ile ilgili olarak Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince bilgilendirilmesidir.
                    </p>

                    <p className="font-semibold text-foreground">3. ÜRÜN BİLGİELERİ VE FİYAT</p>
                    <p>
                        Satın alınan ürünlerin temel özellikleri (türü, miktarı, rengi, adedi vd.) İnternet Sitesi'nde, ALICI'nın sipariş detaylarında ve işbu Form 'un kabulü sonrası e-posta ile gönderilen sipariş özetinde yer almaktadır. Ürünlerin tüm vergiler dâhil satış fiyatı gösterilmiştir.
                    </p>

                    <p className="font-semibold text-foreground">4. ÖDEME VE TESLİMAT</p>
                    <p>
                        ALICI, siparişini tamamlamadan önce Kredi/Banka Kartı veya belirtilen diğer ödeme yöntemleri ile ödemeyi gerçekleştirecektir.<br />
                        Sipariş onayından sonra ürün(ler), ALICI'nın belirttiği teslimat adresine anlaşmalı kargo firması aracılığı ile gönderilir. Teslimat süresi ürünün stok durumu ve teslimat adresine göre değişiklik gösterebilir, genel teslimat süresi sipariş onayından itibaren yasal sınır olan 30 gündür.
                    </p>

                    <p className="font-semibold text-foreground">5. CAYMA HAKKI VE İADE</p>
                    <p>
                        ALICI, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma hakkının kullanımı için ürünün hasarsız, kullanılmamış ve yeniden satılabilir durumda olması şarttır. Kişiye özel üretilen veya kişiselleştirilen ürünlerde mevzuat gereği cayma hakkı bulunmamaktadır.
                    </p>

                    <p className="font-semibold text-foreground">6. ŞİKAYET VE İTİRAZ</p>
                    <p>
                        ALICI, şikayet ve itirazları konusunda başvurularını, Ticaret Bakanlığı'nca her yıl Aralık ayında belirlenen parasal sınırlar dâhilinde mal veya hizmeti satın aldığı veya ikametgahının bulunduğu yerdeki Tüketici Hakem Heyetine veya Tüketici Mahkemesine yapabilir.
                    </p>
                </div>
            </div>
        </div>
    );
}
