
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
                        2026 yılında Aydın, Nazilli'de, küçük bir atölyede filizlenen hayalimiz, bugün evlerinize konuk olan bir marka haline geldi.
                        Yuvaa olarak biz, seri üretimden uzak, her biri ustaların elinde şekillenen, hikayesi olan ürünlere inanıyoruz.
                    </p>
                    <p>
                        Halk eğitimde başlayan kursumuzla yola çıktık ve bu serüven, zamanla birçok kişinin ekmek yemesine, geçimini sağlamasına vesile olan büyük bir dayanışmaya dönüştü.
                        Koleksiyonlarımızda her zaman doğallığı, samimiyeti ve el emeğini ön planda tutuyoruz. Ahşabın sıcaklığı, seramiğin zarafeti ve
                        pamuğun yumuşaklığı, tasarımlarımızın ana elementlerini oluşturuyor.
                    </p>
                    <p>
                        Bize uzak olan şehirlerden; özenle hazırladığımız tablolarımızı, rölyeflerimizi ve ev dekorasyon ürünlerimizi sizlerle paylaşmak,
                        sizleri bu küçük ailemize, "yuvamıza" katmaktan büyük bir şeref duyarız.
                    </p>
                    <h3 className="font-bold text-2xl text-foreground">Misyonumuz</h3>
                    <p>
                        Yerel zanaatkarları ve el emeğini destekleyerek, geleneksel üretim tekniklerini modern tasarımla buluşturmak; her bir parçayla evinizi sizin en huzurlu "yuvanız" haline getirmek.
                    </p>
                </div>
            </div>
        </div>
    );
}
