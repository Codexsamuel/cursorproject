import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useStore } from '../store/useStore';
import { OptimizedImage } from '../components/common/OptimizedImage';
import { PageTransition } from '../components/common/PageTransition';
import { AnimatedList } from '../components/common/AnimatedList';
import { colors } from '../theme/colors';
import { Product, Review } from '../types/product';
import { useOfflineRequest } from '../hooks/useConnectivity';
import { HomeNavigationProp } from '../types/navigation';

interface ProductDetailsScreenProps {
  navigation: HomeNavigationProp;
  route: {
    params: {
      productId: string;
    };
  };
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { product } = route.params;
  const { isDarkMode } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  // Récupérer les avis avec support hors ligne
  const { data: reviews = [], loading: reviewsLoading, error: reviewsError, retry: retryReviews } = useOfflineRequest<Review[]>({
    url: `/api/products/${product.id}/reviews`,
    cacheKey: `product-${product.id}-reviews`,
  });

  const handleAddToCart = useCallback(() => {
    // TODO: Implémenter l'ajout au panier
    console.log('Ajouter au panier:', product);
  }, [product]);

  const renderReview = useCallback(({ item }: { item: Review }) => (
    <View style={[styles.reviewCard, { backgroundColor: theme.card }]}>
      <View style={styles.reviewHeader}>
        <Text style={[styles.reviewerName, { color: theme.text.primary }]}>
          {item.userName}
        </Text>
        <Text style={[styles.reviewDate, { color: theme.text.secondary }]}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <Text
            key={star}
            style={[
              styles.star,
              { color: star <= item.rating ? theme.primary : theme.text.disabled },
            ]}
          >
            ★
          </Text>
        ))}
      </View>
      <Text style={[styles.reviewComment, { color: theme.text.primary }]}>
        {item.comment}
      </Text>
    </View>
  ), [theme]);

  return (
    <PageTransition testID="product-details-screen">
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <OptimizedImage
          uri={product.imageUrl}
          style={styles.productImage}
          testID="product-details-image"
        />
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: theme.text.primary }]}>
            {product.name}
          </Text>
          <Text style={[styles.productPrice, { color: theme.primary }]}>
            {product.price.toFixed(2)} €
          </Text>
          <Text style={[styles.productDescription, { color: theme.text.secondary }]}>
            {product.description}
          </Text>
          <View style={styles.stockInfo}>
            <Text style={[styles.stockText, { color: theme.text.secondary }]}>
              En stock: {product.stock} unités
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addToCartButton, { backgroundColor: theme.primary }]}
            onPress={handleAddToCart}
            testID="add-to-cart-button"
          >
            <Text style={[styles.addToCartText, { color: theme.text.inverse }]}>
              Ajouter au panier
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reviewsSection}>
          <Text style={[styles.reviewsTitle, { color: theme.text.primary }]}>
            Avis clients
          </Text>
          <AnimatedList
            data={reviews}
            renderItem={renderReview}
            loading={reviewsLoading}
            error={reviewsError}
            onRetry={retryReviews}
            testID="reviews-list"
            ListEmptyComponent={
              <Text style={[styles.noReviews, { color: theme.text.secondary }]}>
                Aucun avis pour ce produit
              </Text>
            }
          />
        </View>
      </ScrollView>
    </PageTransition>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  productImage: {
    width: width,
    height: width,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  stockInfo: {
    marginBottom: 20,
  },
  stockText: {
    fontSize: 14,
  },
  addToCartButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsSection: {
    padding: 20,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  reviewCard: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  reviewDate: {
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  star: {
    fontSize: 20,
    marginRight: 2,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
  noReviews: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
  },
}); 