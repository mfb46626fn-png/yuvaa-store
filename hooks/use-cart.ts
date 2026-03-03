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
    personalization?: { type: "text" | "image"; value: string; };
    variant_name?: string;
    slug: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (data: CartItem) => void;
    removeItem: (id: string, custom_note?: string, variant_name?: string, personalizationValue?: string) => void;
    clearCart: () => void;
}

export const useCart = create(
    persist<CartStore>(
        (set, get) => ({
            items: [],
            addItem: (data: CartItem) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) =>
                    item.id === data.id &&
                    item.custom_note === data.custom_note &&
                    item.variant_name === data.variant_name &&
                    item.personalization?.value === data.personalization?.value
                );

                if (existingItem) {
                    // Miktar artır
                    set({
                        items: currentItems.map((item) =>
                            (item.id === data.id &&
                                item.custom_note === data.custom_note &&
                                item.variant_name === data.variant_name &&
                                item.personalization?.value === data.personalization?.value)
                                ? { ...item, quantity: item.quantity + data.quantity }
                                : item
                        )
                    });
                } else {
                    set({ items: [...get().items, data] });
                }
            },
            removeItem: (id: string, custom_note?: string, variant_name?: string, personalizationValue?: string) => {
                set({
                    items: get().items.filter((item) => !(
                        item.id === id &&
                        item.custom_note === custom_note &&
                        item.variant_name === variant_name &&
                        item.personalization?.value === personalizationValue
                    ))
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
