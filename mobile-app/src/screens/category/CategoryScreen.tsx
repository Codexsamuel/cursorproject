import React, { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ProductList, Product } from '../../components/common/ProductList';
import { Category } from '../../components/home/CategoryCard';
import { RootStackParamList } from '../../navigation/types';

type CategoryRouteProp = RouteProp<RootStackParamList, 'Category'>;

// TODO: Remplacer par des données réelles
const MOCK_CATEGORIES: Category[] = [
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
  {
    id: '5',
    name: 'Catégorie 5',
    icon: 'category',
    color: colors.light.info,
  },
  {
    id: '6',
    name: 'Catégorie 6',
    icon: 'category',
    color: colors.light.secondary,
  },
];

// TODO: Remplacer par des données réelles
const MOCK_PRODUCTS: Record<string, Product[]> = {
  '1': [
    {
      id: '1',
      name: 'Produit nouveau 1',
      description: 'Description du produit nouveau 1',
      price: 99.99,
      image: 'https://picsum.photos/200',
      tags: ['nouveau'],
      stock: 10,
      category: '1',
      rating: 4.5,
      discount: 20,
    },
    {
      id: '2',
      name: 'Produit nouveau 2',
      description: 'Description du produit nouveau 2',
      price: 149.99,
      image: 'https://picsum.photos/201',
      tags: ['nouveau'],
      stock: 5,
      category: '1',
      rating: 4.0,
    },
  ],
  '2': [
    {
      id: '3',
      name: 'Produit en promo 1',
      description: 'Description du produit en promo 1',
      price: 79.99,
      image: 'https://picsum.photos/202',
      tags: ['promo'],
      stock: 8,
      category: '2',
      rating: 4.2,
      discount: 30,
    },
  ],
};

export const CategoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<CategoryRouteProp>();
  const { isDarkMode, selectedTags, setSelectedTags } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  const selectedCategoryId = route.params?.categoryId;
  const selectedCategory = useMemo(() => 
    MOCK_CATEGORIES.find(cat => cat.id === selectedCategoryId),
    [selectedCategoryId]
  );

  const products = useMemo(() => {
    if (!selectedCategoryId) return [];
    return MOCK_PRODUCTS[selectedCategoryId] || [];
  }, [selectedCategoryId]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    navigation.navigate('Category', { categoryId });
  }, [navigation]);

  const handleProductPress = useCallback((product: Product) => {
    navigation.navigate('ProductDetails', { productId: product.id });
  }, [navigation]);

  const handleTagPress = useCallback((tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    );
  }, [selectedTags, setSelectedTags]);

  const renderCategoryItem = useCallback(({ item, index }: { item: Category; index: number }) => (
    <TouchableOpacity
      onPress={() => handleCategoryPress(item.id)}
      style={[
        styles.categoryItem,
        { backgroundColor: item.color },
        index === 0 && styles.firstCategoryItem,
      ]}
    >
      <View style={styles.categoryIconContainer}>
        <MaterialIcons
          name={item.icon}
          size={24}
          color={colors.light.white}
        />
      </View>
      <Animated.Text
        style={styles.categoryName}
        numberOfLines={2}
      >
        {item.name}
      </Animated.Text>
    </TouchableOpacity>
  ), [handleCategoryPress]);

  const renderTagItem = useCallback(({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => handleTagPress(item)}
      style={[
        styles.tagItem,
        {
          backgroundColor: selectedTags.includes(item)
            ? theme.primary
            : theme.surface,
        },
      ]}
    >
      <Animated.Text
        style={[
          styles.tagText,
          {
            color: selectedTags.includes(item)
              ? theme.white
              : theme.text.primary,
          },
        ]}
      >
        {item}
      </Animated.Text>
    </TouchableOpacity>
  ), [handleTagPress, selectedTags, theme]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach(product => {
      product.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [products]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {!selectedCategoryId ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.Text
            entering={FadeIn.duration(300)}
            style={[styles.title, { color: theme.text.primary }]}
          >
            Catégories
          </Animated.Text>

          <FlatList
            data={MOCK_CATEGORIES}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.categoriesGrid}
          />
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View
            entering={FadeIn.duration(300)}
            style={styles.categoryHeader}
          >
            <View style={styles.categoryInfo}>
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: selectedCategory?.color },
                ]}
              >
                <MaterialIcons
                  name={selectedCategory?.icon || 'category'}
                  size={24}
                  color={colors.light.white}
                />
              </View>
              <Animated.Text
                style={[styles.categoryTitle, { color: theme.text.primary }]}
              >
                {selectedCategory?.name}
              </Animated.Text>
            </View>
          </Animated.View>

          {availableTags.length > 0 && (
            <Animated.View
              entering={FadeInDown.duration(300).delay(200)}
              style={styles.tagsContainer}
            >
              <FlatList
                data={availableTags}
                renderItem={renderTagItem}
                keyExtractor={item => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tagsList}
              />
            </Animated.View>
          )}

          <Animated.View
            entering={FadeInDown.duration(300).delay(400)}
            style={styles.productsContainer}
          >
            {products.length === 0 ? (
              <Animated.Text
                style={[styles.emptyText, { color: theme.text.secondary }]}
              >
                Aucun produit dans cette catégorie
              </Animated.Text>
            ) : (
              <ProductList
                products={products}
                onProductPress={handleProductPress}
                containerStyle={styles.productList}
                testID="category-products"
              />
            )}
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
  },
  title: {
    ...typography.h4,
    marginBottom: 24,
  },
  categoriesGrid: {
    paddingHorizontal: 8,
  },
  categoryItem: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 12,
    minHeight: 120,
    justifyContent: 'space-between',
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
  firstCategoryItem: {
    marginLeft: 16,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    ...typography.subtitle2,
    color: colors.light.white,
    fontWeight: 'bold',
  },
  categoryHeader: {
    marginBottom: 24,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryTitle: {
    ...typography.h4,
  },
  tagsContainer: {
    marginBottom: 24,
  },
  tagsList: {
    paddingHorizontal: 8,
  },
  tagItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tagText: {
    ...typography.button,
  },
  productsContainer: {
    flex: 1,
  },
  productList: {
    paddingHorizontal: 8,
  },
  emptyText: {
    ...typography.body1,
    textAlign: 'center',
    marginTop: 32,
  },
}); 