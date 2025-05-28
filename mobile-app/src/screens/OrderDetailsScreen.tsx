import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useStore } from '../store/useStore';
import { PageTransition } from '../components/common/PageTransition';
import { useOfflineRequest } from '../hooks/useConnectivity';
import { ProfileNavigationProp } from '../types/navigation';
import { OptimizedImage } from '../components/common/OptimizedImage';

interface OrderDetailsScreenProps {
  navigation: ProfileNavigationProp;
  route: {
    params: {
      orderId: string;
    };
  };
}

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: OrderItem[];
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    type: 'card' | 'paypal';
    last4?: string;
    email?: string;
  };
}

export const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({ navigation, route }) => {
  const { theme } = useStore(state => ({
    theme: state.theme,
  }));

  const { data: order, loading, error, retry } = useOfflineRequest<Order>({
    url: `/api/orders/${route.params.orderId}`,
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return theme.status.warning;
      case 'processing':
        return theme.status.info;
      case 'shipped':
        return theme.status.info;
      case 'delivered':
        return theme.status.success;
      case 'cancelled':
        return theme.status.error;
      default:
        return theme.text.secondary;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En cours de traitement';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <PageTransition testID="order-details-loading">
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={[styles.loadingText, { color: theme.text.primary }]}>
            Chargement...
          </Text>
        </View>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition testID="order-details-error">
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={[styles.errorText, { color: theme.status.error }]}>
            Une erreur est survenue lors du chargement de la commande.
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.primary }]}
            onPress={retry}
            testID="retry-button"
          >
            <Text style={[styles.retryButtonText, { color: theme.text.inverse }]}>
              Réessayer
            </Text>
          </TouchableOpacity>
        </View>
      </PageTransition>
    );
  }

  if (!order) {
    return (
      <PageTransition testID="order-details-not-found">
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={[styles.errorText, { color: theme.text.primary }]}>
            Commande non trouvée
          </Text>
        </View>
      </PageTransition>
    );
  }

  return (
    <PageTransition testID="order-details-screen">
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={[styles.orderNumber, { color: theme.text.primary }]}>
            Commande #{order.id}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(order.status) },
            ]}
          >
            <Text style={[styles.statusText, { color: theme.text.inverse }]}>
              {getStatusText(order.status)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Date de commande
          </Text>
          <Text style={[styles.sectionText, { color: theme.text.secondary }]}>
            {formatDate(order.createdAt)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Articles
          </Text>
          {order.items.map(item => (
            <View
              key={item.id}
              style={[styles.itemContainer, { borderBottomColor: theme.border }]}
            >
              <OptimizedImage
                source={{ uri: item.product.image }}
                style={styles.itemImage}
                testID={`item-image-${item.id}`}
              />
              <View style={styles.itemDetails}>
                <Text style={[styles.itemName, { color: theme.text.primary }]}>
                  {item.product.name}
                </Text>
                <Text style={[styles.itemQuantity, { color: theme.text.secondary }]}>
                  Quantité: {item.quantity}
                </Text>
                <Text style={[styles.itemPrice, { color: theme.text.primary }]}>
                  {item.price.toFixed(2)} €
                </Text>
              </View>
            </View>
          ))}
          <View style={[styles.totalContainer, { borderTopColor: theme.border }]}>
            <Text style={[styles.totalLabel, { color: theme.text.primary }]}>
              Total
            </Text>
            <Text style={[styles.totalAmount, { color: theme.text.primary }]}>
              {order.total.toFixed(2)} €
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Adresse de livraison
          </Text>
          <Text style={[styles.sectionText, { color: theme.text.secondary }]}>
            {order.shippingAddress.street}
          </Text>
          <Text style={[styles.sectionText, { color: theme.text.secondary }]}>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </Text>
          <Text style={[styles.sectionText, { color: theme.text.secondary }]}>
            {order.shippingAddress.country}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Mode de paiement
          </Text>
          {order.paymentMethod.type === 'card' ? (
            <Text style={[styles.sectionText, { color: theme.text.secondary }]}>
              Carte terminant par {order.paymentMethod.last4}
            </Text>
          ) : (
            <Text style={[styles.sectionText, { color: theme.text.secondary }]}>
              PayPal ({order.paymentMethod.email})
            </Text>
          )}
        </View>
      </ScrollView>
    </PageTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  retryButton: {
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 20,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 