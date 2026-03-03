import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

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
    variant_name?: string;
    cartItemId?: string; // Unique ID for cart management
}

interface CartState {
    items: CartItem[];
    sessionId: string | null;
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getItemCount: () => number;
    initSession: () => string;
}

// Helper to track events
const trackEvent = async (eventType: string, sessionId: string, data: any = {}) => {
    try {
        await fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_type: eventType,
                session_id: sessionId,
                event_data: data,
                path: typeof window !== 'undefined' ? window.location.pathname : ''
            })
        });
    } catch (e) {
        console.error("Failed to track event", e);
    }
};

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            sessionId: null,
            initSession: () => {
                let currentSession = get().sessionId;
                if (!currentSession) {
                    currentSession = uuidv4();
                    set({ sessionId: currentSession });
                }
                return currentSession;
            },
            addItem: (item) => {
                const currentItems = get().items;
                const activeSession = get().initSession();

                // Track analytics
                trackEvent('add_to_cart', activeSession, { product: item });

                // Find item with same ID AND same personalization
                const existingItem = currentItems.find((i) =>
                    i.id === item.id &&
                    i.variant_name === item.variant_name &&
                    JSON.stringify(i.personalization) === JSON.stringify(item.personalization)
                );

                if (existingItem) {
                    set({
                        items: currentItems.map((i) =>
                            (i.id === item.id && i.variant_name === item.variant_name && JSON.stringify(i.personalization) === JSON.stringify(item.personalization))
                                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                                : i
                        ),
                    });
                } else {
                    const newItem = {
                        ...item,
                        quantity: item.quantity || 1,
                        cartItemId: `${item.id}-${Date.now()}` // Simple unique ID
                    };
                    set({ items: [...currentItems, newItem] });
                }
            },
            removeItem: (cartItemId) => {
                set({ items: get().items.filter((i) => (i as any).cartItemId !== cartItemId && i.id !== cartItemId) });
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
            clearCart: () => set({ items: [], sessionId: null }), // Reset session on clear/purchase
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
