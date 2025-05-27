import { ListRenderItemInfo } from '@shopify/flash-list';

export type FlashListRenderItemInfo<T> = {
  item: T;
  index: number;
};

export type FlashListRenderItem<T> = (info: FlashListRenderItemInfo<T>) => React.ReactElement;

export interface FlashListProps<T> {
  data: T[];
  renderItem: FlashListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
  estimatedItemSize?: number;
  onEndReached?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  contentContainerStyle?: any;
  testID?: string;
}

// Type guard pour vérifier si un objet est un FlashListRenderItemInfo
export function isFlashListRenderItemInfo<T>(info: any): info is FlashListRenderItemInfo<T> {
  return info && typeof info === 'object' && 'item' in info && 'index' in info;
}

// Fonction utilitaire pour convertir ListRenderItemInfo en FlashListRenderItemInfo
export function convertToFlashListInfo<T>(info: ListRenderItemInfo<T>): FlashListRenderItemInfo<T> {
  return {
    item: info.item,
    index: info.index,
  };
} 