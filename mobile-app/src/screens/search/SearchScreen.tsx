import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
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
import { SearchBar } from '../../components/common/SearchBar';
import { ProductList, Product } from '../../components/common/ProductList';
import { RootStackParamList } from '../../navigation/types';

type SearchRouteProp = RouteProp<RootStackParamList, 'Search'>;

// TODO: Remplacer par des données réelles
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Produit de recherche 1',
    description: 'Description du produit de recherche 1',
    price: 99.99,
    image: 'https://picsum.photos/200',
    tags: ['nouveau', 'promo'],
    stock: 10,
    category: 'cat1',
    rating: 4.5,
    discount: 20,
  },
  {
    id: '2',
    name: 'Produit de recherche 2',
    description: 'Description du produit de recherche 2',
    price: 149.99,
    image: 'https://picsum.photos/201',
    tags: ['promo'],
    stock: 5,
    category: 'cat2',
    rating: 4.0,
  },
];

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<SearchRouteProp>();
  const { isDarkMode, searchHistory, addToSearchHistory, clearSearchHistory } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  const [searchQuery, setSearchQuery] = useState(route.params?.query || '');

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return [];
    return MOCK_PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      addToSearchHistory(query.trim());
    }
  }, [addToSearchHistory]);

  const handleClearHistory = useCallback(() => {
    clearSearchHistory();
  }, [clearSearchHistory]);

  const handleHistoryItemPress = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleProductPress = useCallback((product: Product) => {
    navigation.navigate('ProductDetails', { productId: product.id });
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Rechercher un produit..."
          containerStyle={styles.searchBar}
          autoFocus
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!searchQuery ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={styles.historyContainer}
          >
            <View style={styles.historyHeader}>
              <Animated.Text
                style={[styles.historyTitle, { color: theme.text.primary }]}
              >
                Historique de recherche
              </Animated.Text>
              {searchHistory.length > 0 && (
                <TouchableOpacity
                  onPress={handleClearHistory}
                  style={styles.clearButton}
                >
                  <Animated.Text
                    style={[styles.clearText, { color: theme.primary }]}
                  >
                    Effacer
                  </Animated.Text>
                </TouchableOpacity>
              )}
            </View>

            {searchHistory.length === 0 ? (
              <Animated.Text
                style={[styles.emptyText, { color: theme.text.secondary }]}
              >
                Aucun historique de recherche
              </Animated.Text>
            ) : (
              <Animated.View
                entering={FadeInDown.duration(300)}
                layout={Layout.springify()}
              >
                {searchHistory.map((query, index) => (
                  <TouchableOpacity
                    key={query}
                    onPress={() => handleHistoryItemPress(query)}
                    style={[
                      styles.historyItem,
                      { borderBottomColor: theme.border },
                      index === searchHistory.length - 1 && styles.lastHistoryItem,
                    ]}
                  >
                    <MaterialIcons
                      name="history"
                      size={20}
                      color={theme.text.secondary}
                      style={styles.historyIcon}
                    />
                    <Animated.Text
                      style={[styles.historyText, { color: theme.text.primary }]}
                      numberOfLines={1}
                    >
                      {query}
                    </Animated.Text>
                    <MaterialIcons
                      name="north-west"
                      size={20}
                      color={theme.text.secondary}
                    />
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={styles.resultsContainer}
          >
            <Animated.Text
              style={[styles.resultsCount, { color: theme.text.secondary }]}
            >
              {filteredProducts.length} résultat{filteredProducts.length !== 1 ? 's' : ''}
            </Animated.Text>

            {filteredProducts.length === 0 ? (
              <Animated.Text
                style={[styles.emptyText, { color: theme.text.secondary }]}
              >
                Aucun résultat trouvé pour "{searchQuery}"
              </Animated.Text>
            ) : (
              <ProductList
                products={filteredProducts}
                onProductPress={handleProductPress}
                containerStyle={styles.productList}
                testID="search-results"
              />
            )}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    borderBottomWidth: 1,
    borderBottomColor: 'inherit',
  },
  searchBar: {
    marginBottom: 8,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  historyContainer: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    ...typography.subtitle1,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
  },
  clearText: {
    ...typography.button,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  lastHistoryItem: {
    borderBottomWidth: 0,
  },
  historyIcon: {
    marginRight: 12,
  },
  historyText: {
    ...typography.body1,
    flex: 1,
    marginRight: 12,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsCount: {
    ...typography.subtitle2,
    marginBottom: 16,
  },
  emptyText: {
    ...typography.body1,
    textAlign: 'center',
    marginTop: 32,
  },
  productList: {
    paddingHorizontal: 8,
  },
}); 