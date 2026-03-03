export const metadata = {
    title: "KVKK Aydınlatma Metni | Yuvaa Store",
};

export default function KVKKPage() {
    return (
        <div className="bg-background min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="font-serif text-3xl font-medium text-foreground mb-8">Kişisel Verilerin Korunması (KVKK) Aydınlatma Metni</h1>

                <div className="prose prose-stone max-w-none text-sm text-muted-foreground space-y-6">
                    <p>
                        <strong>Veri Sorumlusu:</strong> Yuvaa Store (Bundan sonra "Şirket" olarak anılacaktır.)
                    </p>

                    <p>
                        6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz veri sorumlusu olarak Şirketimiz tarafından aşağıda açıklanan kapsamda işlenebilecektir.
                    </p>

                    <p className="font-semibold text-foreground">1. Kişisel Verilerin İşlenme Amacı</p>
                    <p>
                        Toplanan kişisel verileriniz (ad, soyad, iletişim bilgileri, adres, ödeme işlemleri bilgileri vb.), Şirketimiz tarafından sunulan ürün ve hizmetlerden sizleri faydalandırmak için gerekli çalışmaların iş birimlerimiz tarafından yapılması, sipariş süreçlerinin yönetimi, müşteri ilişkilerinin ve şikayetlerin yönetimi, sunulan ürün ve hizmetlerin beğeni ve kullanım alışkanlıklarınıza göre özelleştirilmesi, pazarlama analiz çalışmalarının yürütülmesi (açık rızanız var ise reklam ve kampanyalardan haberdar edilmeniz) ile Şirketimizin hukuki veya ticari işleyişinin temini amaçlarıyla işlenmektedir.
                    </p>

                    <p className="font-semibold text-foreground">2. İşlenen Kişisel Verilerinizin Kimlere ve Hangi Amaçlarla Aktarılabileceği</p>
                    <p>
                        Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda, anlaşmalı olduğumuz kargo/lojistik firmalarına, ödeme altyapısı sağlayıcılarına (Örn: PayTR), bilgi teknolojileri hizmet sağlayıcılarımıza (bulut hizmetleri, yazılım desteği), kanuni yükümlülüklerimizin yerine getirilmesi amacıyla yetkili kamu kurum ve kuruluşlarına ve yasal sınırlandırmalar kapsamında iş ortaklarımıza KVKK’nın 8. ve 9. maddelerinde belirtilen şartlara uygun şekilde aktarılabilecektir.
                    </p>

                    <p className="font-semibold text-foreground">3. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</p>
                    <p>
                        Kişisel verileriniz, İnternet Sitemiz üzerinden (üyelik formu, sipariş formu, iletişim kanalları, çerezler vb.) yazılı ve elektronik ortamlarda otomatik veya kısmen otomatik yollarla toplanmaktadır. İşlemeler, KVKK madde 5 kapsamında "bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olma", "hukuki yükümlülüğün yerine getirilmesi", "ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaati" hukuki sebeplerine veya reklam/hedefleme çerezleri gibi durumlarda ise "açık rıza"nıza dayanılarak gerçekleştirilmektedir.
                    </p>

                    <p className="font-semibold text-foreground">4. İlgili Kişinin KVKK m.11 Kapsamındaki Hakları</p>
                    <p>
                        Kişisel veri sahibi olarak, Kanun’un 11. maddesinde sayılan haklarınıza (verinizin işlenip işlenmediğini öğrenme, amacına uygun kullanılıp kullanılmadığını bilme, aktarıldığı üçüncü kişileri öğrenme, eksik/yanlış işlendiyse düzeltilmesini isteme, silinmesini veya yok edilmesini talep etme vd.) sahipsiniz. Başvurularınızı info@yuvaastore.com adresine yazılı olarak veya mevzuatta öngörülen diğer yöntemlerle Şirketimize iletebilirsiniz.
                    </p>

                    <p className="font-semibold text-foreground">Çerez (Cookie) Kullanımı ve Açık Rıza</p>
                    <p>
                        Web sitemizde, temel fonksiyonların (sepet, oturum açma vb.) çalışması için "Zorunlu Çerezler" kullanılmaktadır. Bunun yanında alışveriş deneyiminizi iyileştirmek, site performansını analiz etmek ve size uygun reklam/kampanya gösterebilmek için "Analitik ve Pazarlama Çerezleri" kullanılmak istenmektedir. Bu çerezler aracılığıyla elde edilen verilerin işlenmesi ancak ana sayfada karşınıza çıkan uyarı paneli üzerinden vereceğiniz <strong>Tümünü Kabul Et (Açık Rıza)</strong> beyanınızla mümkün olacaktır. Onay vermemeniz halinde, yalnızca sitenin çalışması için gerekli olan zorunlu çerezler kullanılmaya devam edecektir.
                    </p>
                </div>
            </div>
        </div>
    );
}
