import React, { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  RefreshControl,
  Text,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  withSpring,
} from 'react-native-reanimated';
import { FlashList, ListRenderItemInfo, ListRenderItem } from '@shopify/flash-list';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';
import {
  FlashListRenderItemInfo,
  FlashListProps,
  convertToFlashListInfo,
} from '../../types/flash-list';

type AnimatedListProps<T> = FlashListProps<T> & {
  containerStyle?: ViewStyle;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onRetry?: () => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
};

// Définition du type pour le composant animé
type AnimatedFlashListType<T> = React.ComponentType<FlashListProps<T>>;

// Création du composant animé avec le bon type
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList) as AnimatedFlashListType<any>;

const springConfig = {
  damping: 15,
  mass: 1,
  stiffness: 120,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

export function AnimatedList<T>({
  data,
  renderItem,
  containerStyle,
  testID,
  estimatedItemSize = 100,
  onEndReached,
  onRefresh,
  refreshing,
  contentContainerStyle,
  loading,
  error,
  emptyMessage = "Aucun élément à afficher",
  onRetry,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
}: AnimatedListProps<T>) {
  const { isDarkMode } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  const keyExtractor = useCallback((_: unknown, index: number) => {
    return index.toString();
  }, []);

  const renderAnimatedItem = useCallback(
    (info: ListRenderItemInfo<T>) => {
      const flashListInfo = convertToFlashListInfo(info);
      
      return (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          layout={Layout}
          style={styles.itemContainer}
        >
          {renderItem(flashListInfo)}
        </Animated.View>
      );
    },
    [renderItem]
  );

  const refreshControl = useMemo(() => {
    if (!onRefresh) return undefined;
    return (
      <RefreshControl
        refreshing={refreshing || false}
        onRefresh={onRefresh}
        colors={[theme.primary]}
        tintColor={theme.primary}
      />
    );
  }, [onRefresh, refreshing, theme.primary]);

  const defaultEmptyComponent = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
          {onRetry && (
            <Text
              style={[styles.retryText, { color: theme.primary }]}
              onPress={onRetry}
            >
              Réessayer
            </Text>
          )}
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.emptyText, { color: theme.text.primary }]}>
          {emptyMessage}
        </Text>
      </View>
    );
  }, [loading, error, emptyMessage, onRetry, theme]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
        containerStyle,
      ]}
      testID={testID}
    >
      <AnimatedFlashList
        data={data}
        renderItem={renderAnimatedItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={estimatedItemSize}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          contentContainerStyle,
          data.length === 0 && styles.emptyContentContainer,
        ]}
        testID={`${testID}-list`}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={refreshControl}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={loading ? (
          <View style={styles.footerContainer}>
            <ActivityIndicator size="small" color={theme.primary} />
          </View>
        ) : ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent || defaultEmptyComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    marginVertical: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  footerContainer: {
    padding: 10,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 