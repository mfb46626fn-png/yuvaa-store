export const metadata = {
    title: "İptal ve İade Koşulları | Yuvaa Store",
};

export default function RefundPolicyPage() {
    return (
        <div className="bg-background min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="font-serif text-3xl font-medium text-foreground mb-8">İptal ve İade Koşulları</h1>

                <div className="prose prose-stone max-w-none text-sm text-muted-foreground space-y-6">
                    <p className="font-semibold text-foreground">İADE ŞARTLARI</p>
                    <p>
                        Yuvaa Store olarak, satın aldığınız ürünlerden memnun kalmanız bizim için önceliklidir. 6502 sayılı Tüketicinin Korunması Hakkında Kanun gereğince, teslimat tarihinden itibaren 14 gün içinde cayma hakkınızı kullanarak ürünleri iade edebilirsiniz.
                    </p>

                    <p className="font-semibold text-foreground">İade Süreci Nasıl İşler?</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>İade etmek istediğiniz ürün, kullanılmamış, hasar görmemiş ve orijinal ambalajında olmalıdır.</li>
                        <li>Faturanızın aslını ürünle birlikte göndermeniz gerekmektedir.</li>
                        <li>Sitemizdeki "Hesabım > Siparişlerim" bölümünden iade talebi oluşturun.</li>
                        <li>Size verilecek kargo kodu ile ürünü anlaşmalı olduğumuz kargo firmasına ücretsiz teslim edebilirsiniz.</li>
                    </ul>

                    <p className="font-semibold text-foreground">İADESİ KABUL EDİLMEYEN ÜRÜNLER</p>
                    <p>
                        Aşağıdaki ürünlerde cayma hakkı kullanılamaz ve iadesi kabul edilmemektedir:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Alıcının isteği üzerine özel olarak üretilen, üzerinde değişiklik veya ilave yapılarak kişiye özel hale getirilen ürünler.</li>
                        <li>Niteliği itibarıyla geri gönderilmeye elverişli olmayan ürünler.</li>
                        <li>Ambalajı açılmış, denenmiş veya kullanılmış ürünler (hijyen açısından).</li>
                    </ul>

                    <p className="font-semibold text-foreground">ÜCRET İADESİ</p>
                    <p>
                        İade ettiğiniz ürün depomuza ulaştıktan sonra gerekli kontroller yapılır. İade şartlarına uygun bulunması durumunda 3 iş günü içinde ücret iadesi işlemi başlatılır. Bankanıza bağlı olarak iadenin hesabınıza yansıması 7-10 iş gününü bulabilir.
                    </p>

                    <p className="font-semibold text-foreground">SİPARİŞ İPTALİ</p>
                    <p>
                        Siparişiniz kargoya verilmeden önce "Hesabım" sayfasından veya müşteri hizmetlerimizi arayarak iptal talebinde bulunabilirsiniz. Kargoya verilen siparişler için iptal işlemi yapılamaz, ürün teslim alındıktan sonra iade süreci işletilmelidir.
                    </p>
                </div>
            </div>
        </div>
    );
}
