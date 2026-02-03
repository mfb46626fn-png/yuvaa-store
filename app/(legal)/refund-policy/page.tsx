export const metadata = {
    title: "İade ve İptal Koşulları | Yuvaa Store",
};

export default function RefundPolicyPage() {
    return (
        <div className="bg-background min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-3xl prose prose-stone">
                <h1>İade ve İptal Koşulları</h1>

                <h3>İade Koşulları</h3>
                <p>
                    Yuvaa Store'dan satın aldığınız ürünleri, teslimat tarihinden itibaren 14 gün içerisinde iade edebilirsiniz.
                    İade edilecek ürünün kullanılmamış, hasar görmemiş ve orijinal ambalajında olması gerekmektedir.
                </p>
                <p>
                    <strong>Önemli Not:</strong> Müşterinin isteği üzerine özel olarak hazırlanan, kişiselleştirilen ürünlerde iade kabul edilmemektedir.
                </p>

                <h3>İade Süreci</h3>
                <ol>
                    <li>İade talebinizi sipariş numaranızla birlikte <a href="mailto:info@yuvaastore.com">info@yuvaastore.com</a> adresine iletin.</li>
                    <li>Talebini onaylandıktan sonra ürünleri anlaşmalı olduğumuz kargo firması ile bize gönderin (İade kargo ücreti alıcıya aittir).</li>
                    <li>Ürünler bize ulaşıp kontrol edildikten sonra, iade bedeli 7 iş günü içerisinde ödeme yaptığınız karta yansıtılır.</li>
                </ol>

                <h3>İptal Koşulları</h3>
                <p>
                    Siparişiniz kargoya verilmeden önce iptal talebinde bulunabilirsiniz. Kargoya verilen siparişler için iptal işlemi yapılamaz,
                    iade süreci işletilir.
                </p>

                <h3>Hasarlı Ürün</h3>
                <p>
                    Kargo teslimatı sırasında ürünün paketinde hasar (ezilme, yırtılma vb.) görürseniz, kargo görevlisine tutanak tutturarak
                    ürünü teslim almayınız. Tutanak tutulmayan hasarlı ürün bildirimlerinde sorumluluk kabul edilmemektedir.
                </p>
            </div>
        </div>
    );
}
