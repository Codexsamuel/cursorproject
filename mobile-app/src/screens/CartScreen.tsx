import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useStore } from '../store/useStore';
import { OptimizedImage } from '../components/common/OptimizedImage';
import { PageTransition } from '../components/common/PageTransition';
import { colors } from '../theme/colors';
import { Product } from '../types/product';
import { CartNavigationProp } from '../types/navigation';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartScreenProps {
  navigation: CartNavigationProp;
}

export const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { isDarkMode } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  // TODO: Remplacer par les données réelles du panier
  const cartItems: CartItem[] = [];
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleUpdateQuantity = useCallback((productId: string, delta: number) => {
    // TODO: Implémenter la mise à jour de la quantité
    console.log('Mise à jour quantité:', productId, delta);
  }, []);

  const handleRemoveItem = useCallback((productId: string) => {
    // TODO: Implémenter la suppression d'un article
    console.log('Supprimer article:', productId);
  }, []);

  const handleCheckout = useCallback(() => {
    // TODO: Implémenter le passage à la caisse
    console.log('Passer à la caisse');
  }, []);

  const renderCartItem = useCallback(({ item }: { item: CartItem }) => (
    <View style={[styles.cartItem, { backgroundColor: theme.card }]}>
      <OptimizedImage
        uri={item.product.imageUrl}
        style={styles.productImage}
        testID={`cart-item-image-${item.product.id}`}
      />
      <View style={styles.itemInfo}>
        <Text style={[styles.productName, { color: theme.text.primary }]}>
          {item.product.name}
        </Text>
        <Text style={[styles.productPrice, { color: theme.primary }]}>
          {item.product.price.toFixed(2)} €
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: theme.primary }]}
            onPress={() => handleUpdateQuantity(item.product.id, -1)}
            testID={`decrease-quantity-${item.product.id}`}
          >
            <Text style={[styles.quantityButtonText, { color: theme.text.inverse }]}>
              -
            </Text>
          </TouchableOpacity>
          <Text style={[styles.quantity, { color: theme.text.primary }]}>
            {item.quantity}
          </Text>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: theme.primary }]}
            onPress={() => handleUpdateQuantity(item.product.id, 1)}
            testID={`increase-quantity-${item.product.id}`}
          >
            <Text style={[styles.quantityButtonText, { color: theme.text.inverse }]}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.product.id)}
        testID={`remove-item-${item.product.id}`}
      >
        <Text style={[styles.removeButtonText, { color: theme.danger }]}>
          ×
        </Text>
      </TouchableOpacity>
    </View>
  ), [theme, handleUpdateQuantity, handleRemoveItem]);

  return (
    <PageTransition testID="cart-screen">
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          testID="cart-items-list"
        >
          {cartItems.length === 0 ? (
            <View style={styles.emptyCart}>
              <Text style={[styles.emptyCartText, { color: theme.text.secondary }]}>
                Votre panier est vide
              </Text>
              <TouchableOpacity
                style={[styles.continueShoppingButton, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('Home')}
                testID="continue-shopping-button"
              >
                <Text style={[styles.continueShoppingText, { color: theme.text.inverse }]}>
                  Continuer les achats
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {cartItems.map(item => renderCartItem({ item }))}
              <View style={[styles.totalContainer, { backgroundColor: theme.card }]}>
                <Text style={[styles.totalLabel, { color: theme.text.primary }]}>
                  Total
                </Text>
                <Text style={[styles.totalAmount, { color: theme.primary }]}>
                  {total.toFixed(2)} €
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.checkoutButton, { backgroundColor: theme.primary }]}
                onPress={handleCheckout}
                testID="checkout-button"
              >
                <Text style={[styles.checkoutButtonText, { color: theme.text.inverse }]}>
                  Passer à la caisse
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </PageTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 15,
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    padding: 5,
  },
  removeButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  checkoutButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyCartText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  continueShoppingButton: {
    padding: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  continueShoppingText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 