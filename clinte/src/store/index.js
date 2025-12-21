import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  setUser: (user) => set({ user }),
  updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart')) || [],
  
  addToCart: (course) => {
    const items = get().items;
    const exists = items.find(item => item._id === course._id);
    if (!exists) {
      set({ items: [...items, course] });
      localStorage.setItem('cart', JSON.stringify([...items, course]));
    }
  },

  removeFromCart: (courseId) => {
    const filtered = get().items.filter(item => item._id !== courseId);
    set({ items: filtered });
    localStorage.setItem('cart', JSON.stringify(filtered));
  },

  clearCart: () => {
    set({ items: [] });
    localStorage.removeItem('cart');
  },

  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.price, 0);
  },
}));
