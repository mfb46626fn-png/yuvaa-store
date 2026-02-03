export const metadata = {
    title: "Gizlilik Politikası | Yuvaa Store",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-background min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-3xl prose prose-stone">
                <h1>Gizlilik Politikası</h1>
                <p>Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>

                <p>
                    Yuvaa Store olarak, müşterilerimizin kişisel verilerinin güvenliğine büyük önem veriyoruz.
                    Bu Gizlilik Politikası, web sitemizi kullandığınızda bilgilerinizin nasıl toplandığını,
                    kullanıldığını ve korunduğunu açıklar.
                </p>

                <h3>1. Toplanan Bilgiler</h3>
                <p>
                    Sipariş verdiğinizde veya sitemize üye olduğunuzda; adınız, e-posta adresiniz,
                    telefon numaranız ve teslimat adresiniz gibi kişisel bilgileri topluyoruz.
                    Ödeme bilgileriniz (kredi kartı vb.) sunucularımızda saklanmaz, doğrudan güvenli ödeme altyapısı üzerinden işlenir.
                </p>

                <h3>2. Bilgilerin Kullanımı</h3>
                <p>
                    Topladığımız bilgiler şu amaçlarla kullanılır:
                </p>
                <ul>
                    <li>Siparişlerinizi işlemek ve teslim etmek.</li>
                    <li>Sipariş durumu hakkında bilgilendirme yapmak.</li>
                    <li>Müşteri hizmetleri desteği sağlamak.</li>
                    <li>Yasal yükümlülükleri yerine getirmek.</li>
                </ul>

                <h3>3. Çerezler (Cookies)</h3>
                <p>
                    Web sitemiz, alışveriş deneyiminizi iyileştirmek ve tercihlerinizi hatırlamak için çerezler kullanır.
                    Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.
                </p>

                <h3>4. Bilgi Paylaşımı</h3>
                <p>
                    Kişisel bilgileriniz, sipariş teslimatı için kargo firmaları gibi zorunlu hizmet sağlayıcılar dışında,
                    yasal bir zorunluluk olmadıkça üçüncü taraflarla paylaşılmaz.
                </p>

                <h3>5. İletişim</h3>
                <p>
                    Gizlilik politikamızla ilgili sorularınız için <a href="mailto:info@yuvaastore.com">info@yuvaastore.com</a> adresinden
                    bize ulaşabilirsiniz.
                </p>
            </div>
        </div>
    );
}
