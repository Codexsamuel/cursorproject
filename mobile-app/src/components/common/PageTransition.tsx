import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';

export type TransitionType = 'fade' | 'slide' | 'scale' | 'none';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: TransitionType;
  duration?: number;
  style?: ViewStyle;
  onTransitionEnd?: () => void;
  testID?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  duration = 300,
  style,
  onTransitionEnd,
  testID,
}) => {
  const { isDarkMode } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Animation d'entrée
    switch (type) {
      case 'scale':
        scale.value = withSpring(1, {
          damping: 15,
          stiffness: 120,
        });
        break;
      case 'fade':
        opacity.value = withTiming(1, {
          duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        break;
    }

    // Nettoyage
    return () => {
      if (type === 'scale') {
        scale.value = withSpring(0.95);
      } else if (type === 'fade') {
        opacity.value = withTiming(0, { duration: duration / 2 });
      }
    };
  }, [type, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const getEnteringAnimation = () => {
    switch (type) {
      case 'slide':
        return SlideInRight.duration(duration);
      case 'fade':
        return FadeIn.duration(duration);
      case 'scale':
        return undefined;
      default:
        return undefined;
    }
  };

  const getExitingAnimation = () => {
    switch (type) {
      case 'slide':
        return SlideOutLeft.duration(duration);
      case 'fade':
        return FadeOut.duration(duration);
      case 'scale':
        return undefined;
      default:
        return undefined;
    }
  };

  if (type === 'none') {
    return <View style={[styles.container, style]}>{children}</View>;
  }

  return (
    <AnimatedView
      style={[
        styles.container,
        { backgroundColor: theme.background },
        style,
        type !== 'slide' && animatedStyle,
      ]}
      entering={getEnteringAnimation()}
      exiting={getExitingAnimation()}
      onLayout={() => onTransitionEnd?.()}
      testID={testID}
    >
      {children}
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 