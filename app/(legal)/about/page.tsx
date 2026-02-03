
import Image from "next/image";

export const metadata = {
    title: "Hakkımızda | Yuvaa Store",
};

export default function AboutPage() {
    return (
        <div className="bg-background min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="font-serif text-4xl font-medium text-foreground">Hakkımızda</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Yuvaa Store, evinize doğal dokunuşlar ve el yapımı sıcaklık katmak için kuruldu.
                    </p>
                </div>

                <div className="relative aspect-video overflow-hidden rounded-xl bg-secondary/10">
                    <Image
                        src="/images/hero-bg.png"
                        alt="Yuvaa Store Atölye"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="prose prose-stone mx-auto">
                    <p>
                        2024 yılında İstanbul'da, küçük bir atölyede filizlenen hayalimiz, bugün evlerinize konuk olan bir marka haline geldi.
                        Yuvaa olarak biz, seri üretimden uzak, her biri ustaların elinde şekillenen, hikayesi olan ürünlere inanıyoruz.
                    </p>
                    <p>
                        Koleksiyonlarımızda doğallığı ve sürdürülebilirliği ön planda tutuyoruz. Ahşabın sıcaklığı, seramiğin zarafeti ve
                        pamuğun yumuşaklığı, tasarımlarımızın ana elementlerini oluşturuyor. Bohem, İskandinav ve Minimalist tarzlardan
                        ilham alarak oluşturduğumuz ürünlerimizle, yaşam alanlarınızı sadece dekore etmiyor, onlara bir ruh katıyoruz.
                    </p>
                    <h3>Misyonumuz</h3>
                    <p>
                        Yerel zanaatkarları destekleyerek, geleneksel üretim tekniklerini modern tasarımla buluşturmak ve evinizi
                        sizin en huzurlu "yuvanız" haline getirecek parçalar sunmak.
                    </p>
                </div>
            </div>
        </div>
    );
}
