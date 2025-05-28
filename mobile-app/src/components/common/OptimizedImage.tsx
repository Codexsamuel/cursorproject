import React from 'react';
import { Image, ImageProps, StyleSheet } from 'react-native';
import { useStore } from '../../store/useStore';

export interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  source: {
    uri: string;
  };
  testID?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ source, style, testID, ...props }) => {
  const { isOnline } = useStore(state => ({
    isOnline: state.isOnline,
  }));

  const imageStyle = StyleSheet.flatten(style);

  return (
    <Image
      source={source}
      style={[
        styles.image,
        imageStyle,
        !isOnline && styles.offlineImage,
      ]}
      testID={testID}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  offlineImage: {
    opacity: 0.7,
  },
}); 