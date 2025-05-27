import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  ListRenderItemInfo,
  FlatListProps,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';

interface AnimatedListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  data: T[];
  renderItem: (info: ListRenderItemInfo<T>) => React.ReactElement;
  containerStyle?: ViewStyle;
  testID?: string;
  estimatedItemSize?: number;
}

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

export function AnimatedList<T>({
  data,
  renderItem,
  containerStyle,
  testID,
  estimatedItemSize = 100,
  ...props
}: AnimatedListProps<T>) {
  const { isDarkMode } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  const keyExtractor = useCallback((item: any, index: number) => {
    return item.id?.toString() || index.toString();
  }, []);

  const renderAnimatedItem = useCallback(
    (info: ListRenderItemInfo<T>) => {
      return (
        <Animated.View
          entering={FadeIn.duration(300).springify()}
          exiting={FadeOut.duration(200)}
          layout={Layout.springify()}
          style={styles.itemContainer}
        >
          {renderItem(info)}
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
        {...props}
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