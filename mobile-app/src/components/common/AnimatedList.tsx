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
};

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
  contentContainerStyle,
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
          entering={FadeIn.duration(300).springify()}
          exiting={FadeOut.duration(200)}
          layout={Layout.springify()}
          style={styles.itemContainer}
        >
          {renderItem(flashListInfo)}
        </Animated.View>
      );
    },
    [renderItem]
  ) as ListRenderItem<T>;

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
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
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