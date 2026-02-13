import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner'; // Opsiyonel: Bildirim için (henüz sonner yüklü değil, console.log kullanacağım veya basit alert)

export interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
    custom_note?: string;
    slug: string;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    addItem: (data: CartItem) => void;
    removeItem: (id: string, custom_note?: string) => void;
    updateQuantity: (id: string, quantity: number, custom_note?: string) => void;
    clearCart: () => void;
}

export const useCart = create(
    persist<CartStore>(
        (set, get) => ({
            isOpen: false,
            onOpen: () => set({ isOpen: true }),
            onClose: () => set({ isOpen: false }),
            items: [],
            addItem: (data: CartItem) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === data.id && item.custom_note === data.custom_note);

                if (existingItem) {
                    // Miktar artır
                    set({
                        items: currentItems.map((item) =>
                            (item.id === data.id && item.custom_note === data.custom_note)
                                ? { ...item, quantity: item.quantity + data.quantity }
                                : item
                        )
                    });
                } else {
                    set({ items: [...get().items, data] });
                }
            },
            removeItem: (id: string, custom_note?: string) => {
                // Not: Aynı ürün farklı notlarla eklenebilir, bu yüzden sadece ID ile silmek hepsini silebilir. 
                // Basitlik için ID kontrolü yeterli olabilir ama kişiselleştirme varsa notu da kontrol etmek daha doğru.
                set({
                    items: get().items.filter((item) => !(item.id === id && item.custom_note === custom_note))
                });
            },
            updateQuantity: (id: string, quantity: number, custom_note?: string) => {
                set({
                    items: get().items.map((item) =>
                        (item.id === id && item.custom_note === custom_note)
                            ? { ...item, quantity: quantity }
                            : item
                    )
                });
            },
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
