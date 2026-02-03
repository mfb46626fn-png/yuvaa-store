export const metadata = {
    title: "Mesafeli Satış Sözleşmesi | Yuvaa Store",
};

export default function TermsPage() {
    return (
        <div className="bg-background min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-3xl prose prose-stone">
                <h1>Mesafeli Satış Sözleşmesi</h1>
                <p>
                    İşbu sözleşme, Alıcı'nın, Yuvaa Store (Satıcı) tarafından işletilen internet sitesi üzerinden
                    sipariş vererek satın almak istediği ürün/hizmetin satışı ve teslimi ile ilgili olarak
                    6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince
                    tarafların hak ve yükümlülüklerini düzenler.
                </p>

                <h3>1. Taraflar</h3>
                <p>
                    <strong>Satıcı:</strong> Yuvaa Store<br />
                    Adres: Bağdat Caddesi No:123, Kadıköy, İstanbul<br />
                    E-posta: info@yuvaastore.com
                </p>
                <p>
                    <strong>Alıcı:</strong> Web sitesi üzerinden sipariş veren müşteri.
                </p>

                <h3>2. Konu</h3>
                <p>
                    İşbu sözleşmenin konusu, Alıcı'nın Satıcı'ya ait web sitesinden elektronik ortamda siparişini yaptığı,
                    nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak tarafların hak ve yükümlülüklerinin saptanmasıdır.
                </p>

                <h3>3. Cayma Hakkı</h3>
                <p>
                    Alıcı, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren
                    14 (on dört) gün içinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin
                    malı reddederek sözleşmeden cayma hakkına sahiptir.
                </p>
                <p>
                    Kişiye özel olarak üretilen veya hazırlanan ürünlerde cayma hakkı kullanılamaz.
                </p>

                <h3>4. Uyuşmazlık Çözümü</h3>
                <p>
                    İşbu sözleşmeden doğacak uyuşmazlıklarda, Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.
                </p>
            </div>
        </div>
    );
}
