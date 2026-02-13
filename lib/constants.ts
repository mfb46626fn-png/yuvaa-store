export const SITE_CONFIG = {
    title: "Yuvaa Store",
    description: "Evinizin Ruhu: Yuvaa. El yapımı detaylar, doğal dokular ve bohem esintilerle yaşam alanınıza sıcaklık katın.",
    hero: {
        title: "Evinizin Ruhu: Yuvaa",
        description: "El yapımı detaylar, doğal dokular ve bohem esintilerle yaşam alanınıza sıcaklık katın.",
        buttonText: "Koleksiyonu Keşfet",
        imageUrl: "/images/hero-bg.png" // Ensure this image exists or update path
    },
    footer: {
        copyright: "© 2024 Yuvaa Store. Tüm hakları saklıdır.",
        socials: {
            instagram: "https://instagram.com/yuvaastore",
            twitter: "https://twitter.com/yuvaastore"
        }
    }
};

export const CATEGORIES = [
    {
        id: "ev-dekorasyon",
        title: "Ev Dekorasyon",
        slug: "ev-dekorasyon",
        image_url: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "mutfak",
        title: "Mutfak",
        slug: "mutfak",
        image_url: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "banyo",
        title: "Banyo",
        slug: "banyo",
        image_url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "aydinlatma",
        title: "Aydınlatma",
        slug: "aydinlatma",
        image_url: "https://images.unsplash.com/photo-1513506003011-3b03c8b08d54?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "tekstil",
        title: "Tekstil",
        slug: "tekstil",
        image_url: "https://images.unsplash.com/photo-1522771753035-4a5046b86fb8?q=80&w=600&auto=format&fit=crop"
    }
];

// Helper to get category title by slug
export function getCategoryTitle(slug: string) {
    const category = CATEGORIES.find(c => c.slug === slug);
    return category ? category.title : slug;
}
