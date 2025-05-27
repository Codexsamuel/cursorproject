import React, { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { Product } from '../../components/common/ProductList';

// TODO: Remplacer par un vrai panier dans le store
const MOCK_CART_ITEMS = [
  {
    product: {
      id: '1',
      name: 'Produit 1',
      description: 'Description du produit 1',
      price: 99.99,
      image: 'https://picsum.photos/200',
      tags: ['nouveau'],
      stock: 10,
      category: 'cat1',
      rating: 4.5,
      discount: 20,
    } as Product,
    quantity: 2,
  },
  {
    product: {
      id: '2',
      name: 'Produit 2',
      description: 'Description du produit 2',
      price: 149.99,
      image: 'https://picsum.photos/201',
      tags: ['promo'],
      stock: 5,
      category: 'cat2',
      rating: 4.0,
    } as Product,
    quantity: 1,
  },
];

export const CartScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDarkMode, cartItems, updateCartItemQuantity, removeFromCart } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const hasDiscount = typeof item.product.discount === 'number' && item.product.discount > 0;
      const price = hasDiscount
        ? item.product.price * (1 - (item.product.discount || 0) / 100)
        : item.product.price;
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const handleQuantityChange = useCallback((productId: string, delta: number) => {
    const item = cartItems.find(item => item.product.id === productId);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0 && newQuantity <= item.product.stock) {
        updateCartItemQuantity(productId, newQuantity);
      }
    }
  }, [cartItems, updateCartItemQuantity]);

  const handleRemoveItem = useCallback((productId: string) => {
    removeFromCart(productId);
  }, [removeFromCart]);

  const handleCheckout = useCallback(() => {
    navigation.navigate('Checkout');
  }, [navigation]);

  const handleEmptyCartNavigation = useCallback(() => {
    navigation.navigate('Main', {
      screen: 'Home'
    });
  }, [navigation]);

  if (cartItems.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <MaterialIcons
          name="shopping-cart"
          size={64}
          color={theme.text.disabled}
          style={styles.emptyIcon}
        />
        <Animated.Text
          style={[styles.emptyText, { color: theme.text.secondary }]}
        >
          Votre panier est vide
        </Animated.Text>
        <TouchableOpacity
          onPress={handleEmptyCartNavigation}
          style={[styles.continueShoppingButton, { backgroundColor: theme.primary }]}
        >
          <Animated.Text
            style={[styles.continueShoppingText, { color: theme.white }]}
          >
            Continuer mes achats
          </Animated.Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cartItems.map((item, index) => {
          const hasDiscount = typeof item.product.discount === 'number' && item.product.discount > 0;
          const discountedPrice = hasDiscount
            ? item.product.price * (1 - (item.product.discount || 0) / 100)
            : item.product.price;

          return (
            <Animated.View
              key={item.product.id}
              entering={FadeIn.duration(300).delay(index * 100)}
              layout={Layout.springify()}
              style={styles.cartItem}
            >
              <Image
                source={{ uri: item.product.image }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Animated.Text
                  style={[styles.productName, { color: theme.text.primary }]}
                  numberOfLines={2}
                >
                  {item.product.name}
                </Animated.Text>
                <View style={styles.priceContainer}>
                  {hasDiscount && (
                    <Animated.Text
                      style={[
                        styles.originalPrice,
                        { color: theme.text.disabled },
                      ]}
                    >
                      {item.product.price.toFixed(2)} €
                    </Animated.Text>
                  )}
                  <Animated.Text
                    style={[styles.price, { color: theme.primary }]}
                  >
                    {discountedPrice.toFixed(2)} €
                  </Animated.Text>
                </View>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(item.product.id, -1)}
                    style={[
                      styles.quantityButton,
                      { backgroundColor: theme.surface },
                    ]}
                    disabled={item.quantity <= 1}
                  >
                    <MaterialIcons
                      name="remove"
                      size={20}
                      color={item.quantity <= 1 ? theme.text.disabled : theme.primary}
                    />
                  </TouchableOpacity>
                  <Animated.Text
                    style={[styles.quantity, { color: theme.text.primary }]}
                  >
                    {item.quantity}
                  </Animated.Text>
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(item.product.id, 1)}
                    style={[
                      styles.quantityButton,
                      { backgroundColor: theme.surface },
                    ]}
                    disabled={item.quantity >= item.product.stock}
                  >
                    <MaterialIcons
                      name="add"
                      size={20}
                      color={item.quantity >= item.product.stock ? theme.text.disabled : theme.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveItem(item.product.id)}
                style={styles.removeButton}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={24}
                  color={theme.danger}
                />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      <Animated.View
        style={[styles.footer, { backgroundColor: theme.surface }]}
        entering={FadeInDown.duration(300)}
      >
        <View style={styles.totalContainer}>
          <Animated.Text
            style={[styles.totalLabel, { color: theme.text.secondary }]}
          >
            Total
          </Animated.Text>
          <Animated.Text
            style={[styles.totalAmount, { color: theme.text.primary }]}
          >
            {total.toFixed(2)} €
          </Animated.Text>
        </View>
        <TouchableOpacity
          onPress={handleCheckout}
          style={[styles.checkoutButton, { backgroundColor: theme.primary }]}
        >
          <Animated.Text
            style={[styles.checkoutText, { color: theme.white }]}
          >
            Passer la commande
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'inherit',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productName: {
    ...typography.subtitle1,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  originalPrice: {
    ...typography.caption,
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  price: {
    ...typography.subtitle1,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    ...typography.subtitle2,
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: 12,
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    ...typography.subtitle1,
  },
  totalAmount: {
    ...typography.h4,
    fontWeight: 'bold',
  },
  checkoutButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutText: {
    ...typography.button,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    ...typography.subtitle1,
    marginBottom: 24,
    textAlign: 'center',
  },
  continueShoppingButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  continueShoppingText: {
    ...typography.button,
    fontWeight: 'bold',
  },
}); 