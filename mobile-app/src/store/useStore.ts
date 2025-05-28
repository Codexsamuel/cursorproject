import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { Product, Category, Order, User } from '../services/api';
import * as api from '../services/api';
import { Theme } from '../theme';

interface CartItem {
  product: Product;
  quantity: number;
}

export interface AppError {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: number;
}

export interface AppState {
  // Thème
  isDarkMode: boolean;
  theme: Theme;
  toggleTheme: () => void;

  // Authentification
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;

  // Cache
  cache: Record<string, any>;
  setCache: (key: string, value: any) => void;
  getCache: (key: string) => any;
  clearCache: () => void;

  // État de connexion
  isOnline: boolean;
  setIsOnline: (isOnline: boolean) => void;

  // Gestion des erreurs
  errors: AppError[];
  addError: (error: AppError) => void;
  removeError: (errorId: string) => void;
  clearErrors: () => void;

  // État de l'application
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

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

  // New fields
  setTheme: (theme: Theme) => void;
  setUser: (user: User | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Thème
      isDarkMode: false,
      theme: 'light',
      toggleTheme: () =>
        set(state => {
          const isDarkMode = !state.isDarkMode;
          return {
            isDarkMode,
            theme: isDarkMode ? colors.dark : colors.light,
          };
        }),

      // Authentification
      user: null,
      isAuthenticated: false,
      login: (user: User) =>
        set({
          user,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      // Cache
      cache: {},
      setCache: (key: string, value: any) =>
        set(state => ({
          cache: {
            ...state.cache,
            [key]: value,
          },
        })),
      getCache: (key: string) => get().cache[key],
      clearCache: () => set({ cache: {} }),

      // État de connexion
      isOnline: true,
      setIsOnline: (isOnline: boolean) => set({ isOnline }),

      // Gestion des erreurs
      errors: [],
      addError: (error: Omit<AppError, 'id' | 'timestamp'>) =>
        set(state => ({
          errors: [
            ...state.errors,
            {
              ...error,
              id: Date.now().toString(),
              timestamp: Date.now(),
            },
          ],
        })),
      removeError: (errorId: string) =>
        set(state => ({
          errors: state.errors.filter(error => error.id !== errorId),
        })),
      clearErrors: () => set({ errors: [] }),

      // État de l'application
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),

      // Products
      products: [],
      categories: [],
      favorites: [],
      isLoadingProducts: true,
      isLoadingCategories: true,
      fetchProducts: async (params) => {
        // Implementation of fetchProducts
      },
      fetchCategories: async () => {
        // Implementation of fetchCategories
      },
      toggleFavorite: async (productId) => {
        // Implementation of toggleFavorite
      },

      // Cart
      cart: [],
      cartTotal: 0,
      addToCart: async (product, quantity) => {
        // Implementation of addToCart
      },
      updateCartItem: async (productId, quantity) => {
        // Implementation of updateCartItem
      },
      removeFromCart: async (productId) => {
        // Implementation of removeFromCart
      },
      clearCart: async () => {
        // Implementation of clearCart
      },
      updateCartTotal: () => {
        // Implementation of updateCartTotal
      },

      // Orders
      orders: [],
      isLoadingOrders: true,
      fetchOrders: async () => {
        // Implementation of fetchOrders
      },
      createOrder: async (orderData) => {
        // Implementation of createOrder
      },
      cancelOrder: async (orderId) => {
        // Implementation of cancelOrder
      },

      // New fields
      setTheme: (theme) => set({ theme }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        isDarkMode: state.isDarkMode,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cache: state.cache,
      }),
    }
  )
);

// Sélecteurs pour optimiser les performances
export const selectIsDarkMode = (state: AppState) => state.isDarkMode;
export const selectIsLoading = (state: AppState) => state.isLoading;
export const selectErrors = (state: AppState) => state.errors;
export const selectIsOnline = (state: AppState) => state.isOnline;
export const selectIsAuthenticated = (state: AppState) => state.isAuthenticated;

// Hook personnalisé pour la gestion des erreurs
export const useErrorHandler = () => {
  const { addError, removeError, clearErrors, errors } = useStore();

  const handleError = (error: Error | string) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    addError({
      message: errorMessage,
      type: 'error',
      timestamp: Date.now(),
    });
  };

  return {
    handleError,
    removeError,
    clearErrors,
    errors,
  };
};

// Hook personnalisé pour la gestion du cache
export const useCache = () => {
  const { setCache, getCache, clearCache } = useStore();

  const cacheData = async <T>(key: string, data: T, ttl: number = 3600000) => {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    setCache(key, cacheItem);
  };

  const getCachedData = <T>(key: string): T | null => {
    const cacheItem = getCache(key);
    if (!cacheItem) return null;

    const { data, timestamp, ttl } = cacheItem;
    if (Date.now() - timestamp > ttl) {
      setCache(key, null);
      return null;
    }

    return data as T;
  };

  return {
    cacheData,
    getCachedData,
    clearCache,
  };
}; 