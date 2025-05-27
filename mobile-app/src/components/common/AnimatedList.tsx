import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';

interface AnimatedListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  containerStyle?: ViewStyle;
  testID?: string;
  estimatedItemSize?: number;
  onEndReached?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

export function AnimatedList<T>({
  data,
  renderItem,
  containerStyle,
  testID,
  estimatedItemSize = 100,
  onEndReached,
  onRefresh,
  refreshing,
}: AnimatedListProps<T>) {
  const { isDarkMode } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  const keyExtractor = useCallback((_: T, index: number) => {
    return index.toString();
  }, []);

  const renderAnimatedItem = useCallback(
    ({ item, index }: { item: T; index: number }) => {
      return (
        <Animated.View
          entering={FadeIn.duration(300).springify()}
          exiting={FadeOut.duration(200)}
          layout={Layout.springify()}
          style={styles.itemContainer}
        >
          {renderItem(item, index)}
        </Animated.View>
      );
    },
    [renderItem]
  );

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
        contentContainerStyle={styles.contentContainer}
        testID={`${testID}-list`}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        refreshing={refreshing}
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
  itemContainer: {
    marginVertical: 4,
  },
}); 