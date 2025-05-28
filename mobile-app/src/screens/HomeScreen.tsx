import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/useStore';
import { AnimatedList } from '../components/common/AnimatedList';
import { OptimizedImage } from '../components/common/OptimizedImage';
import { PageTransition } from '../components/common/PageTransition';
import { colors } from '../theme/colors';
import { useOfflineRequest } from '../hooks/useConnectivity';
import { Product } from '../types/product';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isDarkMode } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Récupérer les produits avec support hors ligne
  const { data: products, loading, error, retry } = useOfflineRequest<Product[]>({
    url: '/api/products',
    cacheKey: 'products',
    retryOptions: {
      maxRetries: 3,
      retryDelay: 1000,
    },
  });

  // Filtrer les produits par catégorie
  const filteredProducts = selectedCategory
    ? products?.filter(product => product.category === selectedCategory)
    : products;

  // Extraire les catégories uniques
  const categories = React.useMemo(() => {
    if (!products) return [];
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const renderProduct = useCallback(({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: theme.card }]}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      testID={`product-${item.id}`}
    >
      <OptimizedImage
        uri={item.imageUrl}
        style={styles.productImage}
        testID={`product-image-${item.id}`}
      />
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: theme.text.primary }]}>
          {item.name}
        </Text>
        <Text style={[styles.productPrice, { color: theme.primary }]}>
          {item.price.toFixed(2)} €
        </Text>
      </View>
    </TouchableOpacity>
  ), [theme, navigation]);

  const renderCategoryFilter = useCallback(() => (
    <View style={styles.categoryContainer}>
      <TouchableOpacity
        style={[
          styles.categoryButton,
          !selectedCategory && { backgroundColor: theme.primary },
        ]}
        onPress={() => setSelectedCategory(null)}
        testID="category-all"
      >
        <Text style={[
          styles.categoryText,
          !selectedCategory && { color: theme.text.inverse },
        ]}>
          Tous
        </Text>
      </TouchableOpacity>
      {categories.map(category => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && { backgroundColor: theme.primary },
          ]}
          onPress={() => setSelectedCategory(category)}
          testID={`category-${category}`}
        >
          <Text style={[
            styles.categoryText,
            selectedCategory === category && { color: theme.text.inverse },
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  ), [categories, selectedCategory, theme]);

  return (
    <PageTransition testID="home-screen">
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {renderCategoryFilter()}
        <AnimatedList
          data={filteredProducts}
          renderItem={renderProduct}
          loading={loading}
          error={error}
          onRetry={retry}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          testID="products-list"
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
                Aucun produit trouvé
              </Text>
            </View>
          }
        />
      </View>
    </PageTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryContainer: {
    flexDirection: 'row',
    padding: 10,
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#F0F0F0',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    padding: 10,
  },
  productCard: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 