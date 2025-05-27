import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  Layout,
} from 'react-native-reanimated';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';

interface PageTransitionProps {
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
  type?: 'fade' | 'slide' | 'scale';
  duration?: number;
  delay?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  style,
  testID,
  type = 'slide',
  duration = 300,
  delay = 0,
}) => {
  const { isDarkMode } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  // Animation values
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Start animations after delay
    const timer = setTimeout(() => {
      progress.value = withTiming(1, {
        duration,
      });
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [duration, delay, progress, scale]);

  const getEnteringAnimation = () => {
    switch (type) {
      case 'fade':
        return FadeIn.duration(duration).delay(delay);
      case 'slide':
        return SlideInRight.duration(duration).delay(delay);
      case 'scale':
        return Layout.springify().damping(15).stiffness(150).delay(delay);
      default:
        return SlideInRight.duration(duration).delay(delay);
    }
  };

  const getExitingAnimation = () => {
    switch (type) {
      case 'fade':
        return FadeOut.duration(duration);
      case 'slide':
        return SlideOutLeft.duration(duration);
      case 'scale':
        return Layout.springify().damping(15).stiffness(150);
      default:
        return SlideOutLeft.duration(duration);
    }
  };

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [type === 'slide' ? 50 : 0, 0],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      progress.value,
      [0, 1],
      [type === 'fade' ? 0 : 1, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX },
        { scale: type === 'scale' ? scale.value : 1 },
      ],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.background },
        containerAnimatedStyle,
        style,
      ]}
      entering={getEnteringAnimation()}
      exiting={getExitingAnimation()}
      testID={testID}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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