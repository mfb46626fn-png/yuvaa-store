import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    slug: string;
    quantity: number;
    category?: string;
    personalization?: {
        type: "text" | "image";
        value: string;
    };
    cartItemId?: string; // Unique ID for cart management
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getItemCount: () => number;
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const currentItems = get().items;
                // Find item with same ID AND same personalization
                const existingItem = currentItems.find((i) =>
                    i.id === item.id &&
                    JSON.stringify(i.personalization) === JSON.stringify(item.personalization)
                );

                if (existingItem) {
                    set({
                        items: currentItems.map((i) =>
                            (i.id === item.id && JSON.stringify(i.personalization) === JSON.stringify(item.personalization))
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        ),
                    });
                } else {
                    // Create a unique ID for the cart item if it has personalization to allow removing specific variation
                    // Actually, modifying `id` might break things if we rely on it being product_id.
                    // Better approach: removeItem and updateQuantity should rely on an internal `cartItemId` or index, 
                    // OR we just rely on the combination.
                    // For this quick implementation, we will keep product ID but logic above handles adding separate entries? 
                    // No, `find` above returns the first match. If I add Item A (Text: "Hi") and then Item A (Text: "Bye"),
                    // the first find fails (good), so it adds a new item.
                    // BUT `removeItem` works by `id`. If I remove Item A, it might remove both or wrong one.
                    // We need to generate a unique instance ID for cart items or check personalization in remove.

                    // Let's generate a temporary unique ID for the cart item itself to be safe, 
                    // but `CartItem.id` is usually expected to be Product ID for links.
                    // Let's add `cartItemId` to CartItem interface?
                    // Refactoring to add `cartItemId` is safer but bigger change.
                    // Let's use a composite key approach for remove/update or just add a `uuid` field.

                    const newItem = {
                        ...item,
                        quantity: 1,
                        cartItemId: `${item.id}-${Date.now()}` // Simple unique ID
                    };
                    set({ items: [...currentItems, newItem] });
                }
            },
            removeItem: (cartItemId) => {
                // We need to update removeItem signature to accept cartItemId or handle logic
                set({ items: get().items.filter((i) => (i as any).cartItemId !== cartItemId && i.id !== cartItemId) });
                // Fallback: if id matches and no cartItemId (legacy items), remove it? 
                // Transitioning: New items have cartItemId.
            },
            updateQuantity: (cartItemId, quantity) => {
                const { items } = get();
                if (quantity === 0) {
                    set({ items: items.filter((i) => (i as any).cartItemId !== cartItemId && i.id !== cartItemId) });
                    return;
                }
                set({
                    items: items.map((i) =>
                        ((i as any).cartItemId === cartItemId || i.id === cartItemId) ? { ...i, quantity } : i
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            getCartTotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },
            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
