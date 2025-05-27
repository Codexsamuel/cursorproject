import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ProductList, Product } from '../../components/common/ProductList';
import { SearchBar } from '../../components/common/SearchBar';
import { CategoryCard } from '../../components/home/CategoryCard';

const FEATURED_CATEGORIES = [
  {
    id: '1',
    name: 'Nouveautés',
    icon: 'new-releases',
    color: colors.light.primary,
  },
  {
    id: '2',
    name: 'Promotions',
    icon: 'local-offer',
    color: colors.light.danger,
  },
  {
    id: '3',
    name: 'Meilleures ventes',
    icon: 'star',
    color: colors.light.warning,
  },
  {
    id: '4',
    name: 'Toutes les catégories',
    icon: 'category',
    color: colors.light.success,
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  // TODO: Remplacer par des données réelles
  const featuredProducts: Product[] = [
    {
      id: '1',
      name: 'Produit en vedette 1',
      description: 'Description du produit en vedette 1',
      price: 99.99,
      image: 'https://picsum.photos/200',
      tags: ['nouveau', 'promo'],
      stock: 10,
      category: 'cat1',
      rating: 4.5,
      discount: 20,
    },
    // Ajouter plus de produits...
  ];

  const handleProductPress = useCallback((product: Product) => {
    navigation.navigate('ProductDetails', { productId: product.id });
  }, [navigation]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    navigation.navigate('Category', { categoryId });
  }, [navigation]);

  const handleSearch = useCallback((query: string) => {
    navigation.navigate('Search', { query });
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={styles.header}
        >
          <SearchBar
            onSearch={handleSearch}
            placeholder="Rechercher un produit..."
            containerStyle={styles.searchBar}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInRight.duration(500).delay(200)}
          style={styles.categoriesContainer}
        >
          <View style={styles.categoriesHeader}>
            <Animated.Text
              style={[styles.sectionTitle, { color: theme.text.primary }]}
            >
              Catégories
            </Animated.Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Categories')}
              style={styles.seeAllButton}
            >
              <Animated.Text
                style={[styles.seeAllText, { color: theme.primary }]}
              >
                Voir tout
              </Animated.Text>
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={theme.primary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {FEATURED_CATEGORIES.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={() => handleCategoryPress(category.id)}
                style={[
                  styles.categoryCard,
                  index === 0 && styles.firstCategoryCard,
                ]}
              />
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View
          entering={FadeInRight.duration(500).delay(400)}
          style={styles.featuredContainer}
        >
          <View style={styles.sectionHeader}>
            <Animated.Text
              style={[styles.sectionTitle, { color: theme.text.primary }]}
            >
              Produits en vedette
            </Animated.Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Featured')}
              style={styles.seeAllButton}
            >
              <Animated.Text
                style={[styles.seeAllText, { color: theme.primary }]}
              >
                Voir tout
              </Animated.Text>
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={theme.primary}
              />
            </TouchableOpacity>
          </View>

          <ProductList
            products={featuredProducts}
            onProductPress={handleProductPress}
            containerStyle={styles.productList}
            testID="home-featured-products"
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
  },
  searchBar: {
    marginBottom: 8,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoriesList: {
    paddingHorizontal: 12,
  },
  categoryCard: {
    marginHorizontal: 4,
  },
  firstCategoryCard: {
    marginLeft: 16,
  },
  featuredContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.h6,
    fontWeight: 'bold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    ...typography.button,
    marginRight: 4,
  },
  productList: {
    paddingHorizontal: 8,
  },
}); 