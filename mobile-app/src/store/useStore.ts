import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { Product, Category, Order, User } from '../services/api';
import * as api from '../services/api';

interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Products
  products: Product[];
  categories: Category[];
  favorites: string[];
  isLoadingProducts: boolean;
  isLoadingCategories: boolean;
  fetchProducts: (params?: {
    category?: string;
    search?: string;
    tags?: string[];
    sort?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  fetchCategories: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;

  // Cart
  cart: CartItem[];
  cartTotal: number;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  updateCartTotal: () => void;

  // Orders
  orders: Order[];
  isLoadingOrders: boolean;
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: {
    products: { product_id: string; quantity: number }[];
    address: string;
    payment_method: string;
  }) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const user = await api.auth.login(email, password);
          set({ user, isAuthenticated: true });
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },
      register: async (userData) => {
        try {
          const user = await api.auth.register(userData);
          set({ user, isAuthenticated: true });
        } catch (error) {
          console.error('Register error:', error);
          throw error;
        }
      },
      logout: async () => {
        try {
          await api.auth.logout();
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout error:', error);
          throw error;
        }
      },
      updateProfile: async (userData) => {
        try {
          const user = await api.auth.updateProfile(userData);
          set({ user });
        } catch (error) {
          console.error('Update profile error:', error);
          throw error;
        }
      },

      // Theme
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // Products
      products: [],
      categories: [],
      favorites: [],
      isLoadingProducts: false,
      isLoadingCategories: false,
      fetchProducts: async (params) => {
        try {
          set({ isLoadingProducts: true });
          const products = await api.products.getAll(params);
          set({ products });
        } catch (error) {
          console.error('Fetch products error:', error);
          throw error;
        } finally {
          set({ isLoadingProducts: false });
        }
      },
      fetchCategories: async () => {
        try {
          set({ isLoadingCategories: true });
          const categories = await api.categories.getAll();
          set({ categories });
        } catch (error) {
          console.error('Fetch categories error:', error);
          throw error;
        } finally {
          set({ isLoadingCategories: false });
        }
      },
      toggleFavorite: async (productId: string) => {
        try {
          const { favorites } = get();
          if (favorites.includes(productId)) {
            await api.favorites.remove(productId);
            set({ favorites: favorites.filter(id => id !== productId) });
          } else {
            await api.favorites.add(productId);
            set({ favorites: [...favorites, productId] });
          }
        } catch (error) {
          console.error('Toggle favorite error:', error);
          throw error;
        }
      },

      // Cart
      cart: [],
      cartTotal: 0,
      addToCart: async (product: Product, quantity: number) => {
        try {
          await api.cart.addItem(product.id, quantity);
          const { cart } = get();
          const existingItem = cart.find(item => item.product.id === product.id);
          if (existingItem) {
            const newCart = cart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
            set({ cart: newCart });
          } else {
            set({ cart: [...cart, { product, quantity }] });
          }
          get().updateCartTotal();
        } catch (error) {
          console.error('Add to cart error:', error);
          throw error;
        }
      },
      updateCartItem: async (productId: string, quantity: number) => {
        try {
          await api.cart.updateItem(productId, quantity);
          const { cart } = get();
          const newCart = cart.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          );
          set({ cart: newCart });
          get().updateCartTotal();
        } catch (error) {
          console.error('Update cart item error:', error);
          throw error;
        }
      },
      removeFromCart: async (productId: string) => {
        try {
          await api.cart.removeItem(productId);
          const { cart } = get();
          set({ cart: cart.filter(item => item.product.id !== productId) });
          get().updateCartTotal();
        } catch (error) {
          console.error('Remove from cart error:', error);
          throw error;
        }
      },
      clearCart: async () => {
        try {
          await api.cart.clear();
          set({ cart: [], cartTotal: 0 });
        } catch (error) {
          console.error('Clear cart error:', error);
          throw error;
        }
      },
      updateCartTotal: () => {
        const { cart } = get();
        const total = cart.reduce(
          (sum, item) => sum + (item.product.price * item.quantity),
          0
        );
        set({ cartTotal: total });
      },

      // Orders
      orders: [],
      isLoadingOrders: false,
      fetchOrders: async () => {
        try {
          set({ isLoadingOrders: true });
          const orders = await api.orders.getAll();
          set({ orders });
        } catch (error) {
          console.error('Fetch orders error:', error);
          throw error;
        } finally {
          set({ isLoadingOrders: false });
        }
      },
      createOrder: async (orderData) => {
        try {
          const order = await api.orders.create(orderData);
          set({ orders: [...get().orders, order] });
          await get().clearCart();
        } catch (error) {
          console.error('Create order error:', error);
          throw error;
        }
      },
      cancelOrder: async (orderId: string) => {
        try {
          await api.orders.cancel(orderId);
          const { orders } = get();
          const newOrders = orders.map(order =>
            order.id === orderId
              ? { ...order, status: 'cancelled' as const }
              : order
          );
          set({ orders: newOrders });
        } catch (error) {
          console.error('Cancel order error:', error);
          throw error;
        }
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        favorites: state.favorites,
        cart: state.cart,
        cartTotal: state.cartTotal,
      }),
    }
  )
); 