import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { Product } from '../../components/common/ProductList';
import { RootStackParamList } from '../../navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 300;

type ProductDetailsRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

export const ProductDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ProductDetailsRouteProp>();
  const { isDarkMode, addToCart, favorites, toggleFavorite } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  const [quantity, setQuantity] = useState(1);
  const scrollY = useSharedValue(0);

  // TODO: Remplacer par des données réelles
  const product: Product = {
    id: route.params.productId,
    name: 'Produit de test',
    description: 'Description détaillée du produit avec beaucoup de texte pour tester le défilement et la mise en page. Ce produit est vraiment exceptionnel et vous allez l\'adorer !',
    price: 99.99,
    image: 'https://picsum.photos/800/600',
    tags: ['nouveau', 'promo'],
    stock: 10,
    category: 'cat1',
    rating: 4.5,
    discount: 20,
  };

  const isFavorite = favorites.includes(product.id);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [1, 0.8],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT / 2],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { scale },
        { translateY },
      ],
    };
  });

  const handleAddToCart = useCallback(() => {
    addToCart(product, quantity);
    navigation.navigate('Cart');
  }, [addToCart, product, quantity, navigation]);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(product.id);
  }, [toggleFavorite, product.id]);

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(product.stock, prev + delta)));
  }, [product.stock]);

  const hasDiscount = typeof product.discount === 'number' && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - (product.discount || 0) / 100)
    : product.price;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[styles.header, headerAnimatedStyle]}
          entering={FadeIn.duration(500)}
        >
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
          {hasDiscount && (
            <View
              style={[
                styles.discountBadge,
                { backgroundColor: theme.danger },
              ]}
            >
              <Animated.Text
                style={[styles.discountText, { color: theme.white }]}
              >
                -{product.discount}%
              </Animated.Text>
            </View>
          )}
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={[
              styles.favoriteButton,
              { backgroundColor: theme.surface },
            ]}
          >
            <MaterialIcons
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={24}
              color={isFavorite ? theme.danger : theme.text.secondary}
            />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[styles.content]}
          entering={FadeInDown.duration(500).delay(200)}
        >
          <View style={styles.titleContainer}>
            <Animated.Text
              style={[styles.title, { color: theme.text.primary }]}
              numberOfLines={2}
            >
              {product.name}
            </Animated.Text>
            {typeof product.rating === 'number' && (
              <View style={styles.ratingContainer}>
                <MaterialIcons
                  name="star"
                  size={20}
                  color={theme.warning}
                  style={styles.ratingIcon}
                />
                <Animated.Text
                  style={[styles.rating, { color: theme.text.secondary }]}
                >
                  {product.rating.toFixed(1)}
                </Animated.Text>
              </View>
            )}
          </View>

          <View style={styles.priceContainer}>
            {hasDiscount && (
              <Animated.Text
                style={[
                  styles.originalPrice,
                  { color: theme.text.disabled },
                ]}
              >
                {product.price.toFixed(2)} €
              </Animated.Text>
            )}
            <Animated.Text
              style={[styles.price, { color: theme.primary }]}
            >
              {discountedPrice.toFixed(2)} €
            </Animated.Text>
          </View>

          <Animated.Text
            style={[styles.description, { color: theme.text.secondary }]}
          >
            {product.description}
          </Animated.Text>

          <View style={styles.stockContainer}>
            <MaterialIcons
              name={product.stock > 0 ? 'inventory' : 'inventory-2'}
              size={20}
              color={product.stock > 0 ? theme.success : theme.danger}
              style={styles.stockIcon}
            />
            <Animated.Text
              style={[
                styles.stockText,
                {
                  color: product.stock > 0
                    ? theme.success
                    : theme.danger,
                },
              ]}
            >
              {product.stock > 0
                ? `${product.stock} en stock`
                : 'Rupture de stock'}
            </Animated.Text>
          </View>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => handleQuantityChange(-1)}
              style={[
                styles.quantityButton,
                { backgroundColor: theme.surface },
              ]}
              disabled={quantity <= 1}
            >
              <MaterialIcons
                name="remove"
                size={24}
                color={quantity <= 1 ? theme.text.disabled : theme.primary}
              />
            </TouchableOpacity>
            <Animated.Text
              style={[styles.quantity, { color: theme.text.primary }]}
            >
              {quantity}
            </Animated.Text>
            <TouchableOpacity
              onPress={() => handleQuantityChange(1)}
              style={[
                styles.quantityButton,
                { backgroundColor: theme.surface },
              ]}
              disabled={quantity >= product.stock}
            >
              <MaterialIcons
                name="add"
                size={24}
                color={quantity >= product.stock ? theme.text.disabled : theme.primary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleAddToCart}
            style={[
              styles.addToCartButton,
              { backgroundColor: theme.primary },
            ]}
            disabled={product.stock === 0}
          >
            <MaterialIcons
              name="shopping-cart"
              size={24}
              color={theme.white}
              style={styles.addToCartIcon}
            />
            <Animated.Text
              style={[styles.addToCartText, { color: theme.white }]}
            >
              {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  discountText: {
    ...typography.button,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    backgroundColor: 'inherit',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    ...typography.h5,
    flex: 1,
    marginRight: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    marginRight: 4,
  },
  rating: {
    ...typography.subtitle1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  originalPrice: {
    ...typography.subtitle1,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  price: {
    ...typography.h4,
    fontWeight: 'bold',
  },
  description: {
    ...typography.body1,
    marginBottom: 24,
    lineHeight: 24,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stockIcon: {
    marginRight: 8,
  },
  stockText: {
    ...typography.subtitle2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  quantity: {
    ...typography.h6,
    marginHorizontal: 16,
    minWidth: 40,
    textAlign: 'center',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
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
  addToCartIcon: {
    marginRight: 8,
  },
  addToCartText: {
    ...typography.button,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
}); 