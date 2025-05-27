import React, { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Platform,
  RefreshControl,
  ListRenderItemInfo,
  FlatList,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SearchBar } from './SearchBar';
import { TagSelector, Tag } from './TagSelector';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
  stock: number;
  category: string;
  rating?: number;
  discount?: number;
}

interface ProductListProps {
  products: Product[];
  onProductPress: (product: Product) => void;
  onRefresh?: () => Promise<void>;
  onSearch?: (query: string) => void;
  onTagChange?: (tags: string[]) => void;
  containerStyle?: ViewStyle;
  testID?: string;
  availableTags?: Tag[];
  selectedTags?: string[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductPress,
  onRefresh,
  onSearch,
  onTagChange,
  containerStyle,
  testID,
  availableTags = [],
  selectedTags = [],
  loading = false,
  error,
  emptyMessage = 'Aucun produit trouvé',
}) => {
  const { isDarkMode } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(product =>
        selectedTags.every(tagId => product.tags.includes(tagId))
      );
    }

    return filtered;
  }, [products, selectedTags]);

  const handleProductPress = useCallback((product: Product) => {
    onProductPress(product);
  }, [onProductPress]);

  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      await onRefresh();
    }
  }, [onRefresh]);

  const handleSearch = useCallback((query: string) => {
    onSearch?.(query);
  }, [onSearch]);

  const handleTagChange = useCallback((tags: string[]) => {
    onTagChange?.(tags);
  }, [onTagChange]);

  const renderProduct = useCallback(({ item }: ListRenderItemInfo<Product>) => {
    const hasDiscount = typeof item.discount === 'number' && item.discount > 0;
    const discountedPrice = hasDiscount
      ? item.price * (1 - (item.discount || 0) / 100)
      : item.price;

    return (
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        layout={Layout.springify()}
        style={styles.productContainer}
      >
        <TouchableOpacity
          onPress={() => handleProductPress(item)}
          style={[
            styles.product,
            { backgroundColor: theme.surface },
          ]}
          testID={`${testID}-product-${item.id}`}
        >
          <View style={styles.productImageContainer}>
            <Animated.Image
              source={{ uri: item.image }}
              style={styles.productImage}
              testID={`${testID}-product-image-${item.id}`}
            />
            {hasDiscount && (
              <View
                style={[
                  styles.discountBadge,
                  { backgroundColor: theme.danger },
                ]}
                testID={`${testID}-product-discount-${item.id}`}
              >
                <Animated.Text
                  style={[styles.discountText, { color: theme.white }]}
                >
                  -{item.discount}%
                </Animated.Text>
              </View>
            )}
          </View>
          <View style={styles.productInfo}>
            <Animated.Text
              style={[styles.productName, { color: theme.text.primary }]}
              numberOfLines={2}
            >
              {item.name}
            </Animated.Text>
            <Animated.Text
              style={[styles.productDescription, { color: theme.text.secondary }]}
              numberOfLines={2}
            >
              {item.description}
            </Animated.Text>
            <View style={styles.productFooter}>
              <View style={styles.priceContainer}>
                {hasDiscount && (
                  <Animated.Text
                    style={[
                      styles.originalPrice,
                      { color: theme.text.disabled },
                    ]}
                  >
                    {item.price.toFixed(2)} €
                  </Animated.Text>
                )}
                <Animated.Text
                  style={[styles.price, { color: theme.primary }]}
                >
                  {discountedPrice.toFixed(2)} €
                </Animated.Text>
              </View>
              {typeof item.rating === 'number' && (
                <View style={styles.ratingContainer}>
                  <MaterialIcons
                    name="star"
                    size={16}
                    color={theme.warning}
                    style={styles.ratingIcon}
                  />
                  <Animated.Text
                    style={[styles.rating, { color: theme.text.secondary }]}
                  >
                    {item.rating.toFixed(1)}
                  </Animated.Text>
                </View>
              )}
            </View>
            <View style={styles.stockContainer}>
              <MaterialIcons
                name={item.stock > 0 ? 'inventory' : 'inventory-2'}
                size={16}
                color={item.stock > 0 ? theme.success : theme.danger}
                style={styles.stockIcon}
              />
              <Animated.Text
                style={[
                  styles.stockText,
                  {
                    color: item.stock > 0
                      ? theme.success
                      : theme.danger,
                  },
                ]}
              >
                {item.stock > 0
                  ? `${item.stock} en stock`
                  : 'Rupture de stock'}
              </Animated.Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [theme, handleProductPress]);

  const renderHeader = useCallback(() => {
    return (
      <Animated.View
        style={[styles.header]}
        testID={`${testID}-header`}
      >
        {onSearch && (
          <SearchBar
            onSearch={handleSearch}
            placeholder="Rechercher un produit..."
            containerStyle={styles.searchBar}
            testID={`${testID}-search`}
          />
        )}
        {onTagChange && availableTags.length > 0 && (
          <TagSelector
            tags={availableTags}
            selectedTags={selectedTags}
            onTagsChange={handleTagChange}
            containerStyle={styles.tagSelector}
            testID={`${testID}-tags`}
          />
        )}
      </Animated.View>
    );
  }, [
    onSearch,
    onTagChange,
    availableTags,
    selectedTags,
    handleSearch,
    handleTagChange,
  ]);

  const renderEmpty = useCallback(() => {
    return (
      <View style={styles.emptyContainer} testID={`${testID}-empty`}>
        <MaterialIcons
          name="search-off"
          size={48}
          color={theme.text.disabled}
          style={styles.emptyIcon}
        />
        <Animated.Text
          style={[styles.emptyText, { color: theme.text.secondary }]}
        >
          {error || emptyMessage}
        </Animated.Text>
      </View>
    );
  }, [theme, error, emptyMessage]);

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              colors={[theme.primary]}
              tintColor={theme.primary}
            />
          ) : undefined
        }
        testID={`${testID}-list`}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  tagSelector: {
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  productContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  product: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
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
  productImageContainer: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    ...typography.caption,
    fontWeight: 'bold',
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productName: {
    ...typography.subtitle1,
    marginBottom: 4,
  },
  productDescription: {
    ...typography.body2,
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    marginRight: 4,
  },
  rating: {
    ...typography.caption,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockIcon: {
    marginRight: 4,
  },
  stockText: {
    ...typography.caption,
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
    ...typography.body1,
    textAlign: 'center',
  },
}); 