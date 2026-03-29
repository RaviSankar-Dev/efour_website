import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BASE_URL } from '../utils/api';

const useStore = create(
    persist(
        (set, get) => ({
            cart: [],
            isCartOpen: false,
            isDarkMode: false,

            toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
            openCart: () => set({ isCartOpen: true }),
            closeCart: () => set({ isCartOpen: false }),

            addToCart: (item, quantity = 1) => {
                const cart = get().cart;
                const existingItem = cart.find((i) => i.id === item.id);

                if (existingItem) {
                    set({
                        cart: cart.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
                        ),
                    });
                } else {
                    set({ cart: [...cart, { ...item, quantity: quantity }] });
                }
                // Automatically open cart on add - DISABLED per user request for multi-select
                // set({ isCartOpen: true });
            },

            removeFromCart: (id) =>
                set((state) => ({
                    cart: state.cart.filter((i) => i.id !== id),
                })),

            updateQuantity: (id, quantity) =>
                set((state) => ({
                    cart: state.cart.map((i) =>
                        i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
                    ).filter(i => i.quantity > 0),
                })),

            clearCart: () => set({ cart: [] }),

            toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

            // Helper to check if stalls are open (9 AM - 11 PM)
            isOpen: () => {
                const hour = new Date().getHours();
                return hour >= 9 && hour < 23;
            },

            // Centralized Data & Loading States
            rides: [],
            menuData: [],
            isLoading: { rides: false, menu: false },
            lastFetched: { rides: null, menu: null },

            fetchRides: async (force = false) => {
                const { lastFetched, isLoading } = get();
                // Cache for 5 minutes unless forced
                if (!force && lastFetched.rides && (Date.now() - lastFetched.rides < 300000)) return;
                if (isLoading.rides) return;

                set(state => ({ isLoading: { ...state.isLoading, rides: true } }));
                try {
                    const res = await fetch(`${BASE_URL}/api/e4/rides?all=true`);
                    if (!res.ok) throw new Error(`API Error: ${res.status}`);
                    const data = await res.json();
                    let items = Array.isArray(data) ? data : (data.rides || data.data || []);

                    const mappedRides = items.filter(Boolean).map(item => ({
                        id: item._id || item.id,
                        title: item.name,
                        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
                        image: item.image ? decodeURIComponent(item.image) : '',
                        desc: item.desc || item.description || '',
                        category: item.category,
                        ageGroup: item.ageGroup,
                        status: item.status,
                    }));

                    set({
                        rides: mappedRides,
                        lastFetched: { ...get().lastFetched, rides: Date.now() }
                    });
                } catch (err) {
                    console.error('Failed to fetch rides:', err);
                } finally {
                    set(state => ({ isLoading: { ...state.isLoading, rides: false } }));
                }
            },

            fetchMenu: async (force = false) => {
                const { lastFetched, isLoading } = get();
                // Cache for 5 minutes unless forced
                if (!force && lastFetched.menu && (Date.now() - lastFetched.menu < 300000)) return;
                if (isLoading.menu) return;

                set(state => ({ isLoading: { ...state.isLoading, menu: true } }));
                try {
                    const res = await fetch(`${BASE_URL}/api/e4/dine?all=true`);
                    if (!res.ok) throw new Error(`API Error: ${res.status}`);
                    const data = await res.json();

                    // Support both array responses and wrapped objects
                    let items = [];
                    if (Array.isArray(data)) {
                        items = data;
                    } else if (Array.isArray(data?.data)) {
                        items = data.data;
                    } else if (Array.isArray(data?.menu)) {
                        items = data.menu;
                    } else if (Array.isArray(data?.products)) {
                        items = data.products;
                    }

                    const decodedItems = items.filter(Boolean).map(item => ({
                        ...item,
                        image: item.image ? decodeURIComponent(item.image) : '',
                    }));

                    set({
                        menuData: decodedItems,
                        lastFetched: { ...get().lastFetched, menu: Date.now() }
                    });
                } catch (err) {
                    console.error('Failed to fetch menu:', err);
                } finally {
                    set(state => ({ isLoading: { ...state.isLoading, menu: false } }));
                }
            },

            user: null,
            setUser: (user) => set({ user }),

            tickets: [], // Store for confirmed tickets
            addTicket: (ticket) => set((state) => ({
                tickets: [ticket, ...state.tickets]
            })),

            // Toast Notification State
            toast: { message: null, type: 'success', isVisible: false },
            showToast: (message, type = 'success') => {
                set({ toast: { message, type, isVisible: true } });
                setTimeout(() => {
                    set((state) => ({ toast: { ...state.toast, isVisible: false } }));
                }, 3000);
            },
            hideToast: () => set((state) => ({ toast: { ...state.toast, isVisible: false } })),
        }),
        {
            name: 'efour-storage',
        }
    )
);

export default useStore;
