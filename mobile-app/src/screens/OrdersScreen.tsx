import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useStore } from '../store/useStore';
import { PageTransition } from '../components/common/PageTransition';
import { colors } from '../theme/colors';
import { useOfflineRequest } from '../hooks/useConnectivity';
import { ProfileNavigationProp } from '../types/navigation';

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface OrdersScreenProps {
  navigation: ProfileNavigationProp;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ navigation }) => {
  const { theme } = useStore(state => ({
    theme: state.theme,
  }));

  const { data: orders = [], loading, error, retry } = useOfflineRequest<Order[]>({
    url: '/api/orders',
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return theme.status.warning;
      case 'processing':
        return theme.status.info;
      case 'shipped':
        return theme.status.success;
      case 'delivered':
        return theme.status.success;
      case 'cancelled':
        return theme.status.error;
      default:
        return theme.text.secondary;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleOrderPress = useCallback((orderId: string) => {
    navigation.navigate('OrderDetails', { orderId });
  }, [navigation]);

  const renderOrder = useCallback(({ item: order }: { item: Order }) => (
    <TouchableOpacity
      key={order.id}
      style={[styles.orderCard, { backgroundColor: theme.card }]}
      onPress={() => handleOrderPress(order.id)}
      testID={`order-${order.id}`}
    >
      <View style={styles.orderHeader}>
        <Text style={[styles.orderNumber, { color: theme.text.primary }]}>
          Commande #{order.orderNumber}
        </Text>
        <Text
          style={[
            styles.orderStatus,
            { color: getStatusColor(order.status) },
          ]}
        >
          {order.status.toUpperCase()}
        </Text>
      </View>

      <View style={styles.orderDetails}>
        <Text style={[styles.orderDate, { color: theme.text.secondary }]}>
          {formatDate(order.createdAt)}
        </Text>
        <Text style={[styles.orderTotal, { color: theme.text.primary }]}>
          {order.total.toFixed(2)} €
        </Text>
      </View>

      <View style={styles.orderItems}>
        {order.items.map(item => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={[styles.itemName, { color: theme.text.primary }]}>
              {item.name}
            </Text>
            <Text style={[styles.itemQuantity, { color: theme.text.secondary }]}>
              x{item.quantity}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  ), [theme, handleOrderPress]);

  return (
    <PageTransition>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.title, { color: theme.text.primary }]}>
          Mes Commandes
        </Text>

        {loading ? (
          <Text style={[styles.message, { color: theme.text.secondary }]}>
            Chargement des commandes...
          </Text>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorMessage, { color: theme.status.error }]}>
              {error.message}
            </Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: theme.primary }]}
              onPress={retry}
            >
              <Text style={[styles.retryButtonText, { color: theme.text.inverse }]}>
                Réessayer
              </Text>
            </TouchableOpacity>
          </View>
        ) : orders.length === 0 ? (
          <Text style={[styles.message, { color: theme.text.secondary }]}>
            Vous n'avez pas encore de commandes
          </Text>
        ) : (
          orders.map(order => renderOrder({ item: order }))
        )}
      </ScrollView>
    </PageTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 14,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    marginLeft: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  errorMessage: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 