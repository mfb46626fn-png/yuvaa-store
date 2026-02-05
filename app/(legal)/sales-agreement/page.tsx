export const metadata = {
    title: "Mesafeli Satış Sözleşmesi | Yuvaa Store",
};

export default function SalesAgreementPage() {
    return (
        <div className="bg-background min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="font-serif text-3xl font-medium text-foreground mb-8">Mesafeli Satış Sözleşmesi</h1>

                <div className="prose prose-stone max-w-none text-sm text-muted-foreground space-y-6">
                    <p className="font-semibold text-foreground">MADDE 1 - KONU</p>
                    <p>
                        İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait www.yuvaastore.com internet sitesinden elektronik ortamda siparişini yaptığı aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmelere Dair Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
                    </p>

                    <p className="font-semibold text-foreground">MADDE 2 - SATICI BİLGİLERİ</p>
                    <p>
                        Ünvanı: Yuvaa Store (Bundan sonra SATICI olarak anılacaktır)<br />
                        Adres: Bağdat Caddesi No:123, Kadıköy, İstanbul<br />
                        Telefon: +90 (216) 555 00 00<br />
                        E-posta: info@yuvaastore.com
                    </p>

                    <p className="font-semibold text-foreground">MADDE 3 - ALICI BİLGİLERİ</p>
                    <p>
                        Müşteri olarak www.yuvaastore.com sitesine üye olan veya sipariş veren kişi. (Bundan sonra ALICI olarak anılacaktır).
                        Üye olurken veya sipariş verirken kullanılan adres ve iletişim bilgileri esas alınır.
                    </p>

                    <p className="font-semibold text-foreground">MADDE 4 - SÖZLEŞME KONUSU ÜRÜN VE TESLİMAT</p>
                    <p>
                        4.1. Ürünlerin Cinsi ve Türü, Miktarı, Marka/Modeli, Rengi ve Tüm Vergiler Dahil Satış Bedeli www.yuvaastore.com adlı web sitesindeki ürün tanıtım sayfasında yer alan bilgilerde ve işbu sözleşmenin ayrılmaz parçası sayılan faturada belirtildiği gibidir.
                    </p>
                    <p>
                        4.2. Teslimat, satıcı tarafından kargo şirketi aracılığı ile alıcının yukarıda belirtilen adresine yapılacaktır. Teslimat masrafları (kargo ücreti) aksi belirtilmedikçe ALICI'ya aittir.
                    </p>

                    <p className="font-semibold text-foreground">MADDE 5 - CAYMA HAKKI</p>
                    <p>
                        ALICI, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren 14 (on dört) gün içinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkına sahiptir. Cayma hakkının kullanılması için bu süre içinde SATICI'ya faks, e-posta veya telefon ile bildirimde bulunulması şarttır.
                    </p>
                    <p>
                        İade edilecek ürünlerin kutusu, ambalajı, varsa standart aksesuarları ile birlikte eksiksiz ve hasarsız olarak teslim edilmesi gerekmektedir. Kişiye özel olarak üretilen veya hazırlanan ürünlerde cayma hakkı kullanılamaz.
                    </p>

                    <p className="font-semibold text-foreground">MADDE 6 - YETKİLİ MAHKEME</p>
                    <p>
                        İşbu sözleşmenin uygulanmasında, Sanayi ve Ticaret Bakanlığınca ilan edilen değere kadar Tüketici Hakem Heyetleri ile ALICI'nın veya SATICI'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.
                    </p>
                </div>
            </div>
        </div>
    );
}
