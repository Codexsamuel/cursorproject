import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  onPress,
  style,
  testID,
}) => {
  const { width } = useWindowDimensions();
  const { isDarkMode } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  // Animation values
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const rotateX = useSharedValue(0);

  // Handle press animations
  const handlePressIn = () => {
    scale.value = withSpring(0.98);
    translateY.value = withSpring(2);
    rotateX.value = withSpring(2);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    translateY.value = withSpring(0);
    rotateX.value = withSpring(0);
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      rotateX.value,
      [0, 2],
      [0, 2],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
        { perspective: 1000 },
        { rotateX: `${rotate}deg` },
      ],
    };
  });

  // Reset animation values when component unmounts
  useEffect(() => {
    return () => {
      scale.value = withTiming(1);
      translateY.value = withTiming(0);
      rotateX.value = withTiming(0);
    };
  }, []);

  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          width: width - 32, // Full width minus margins
        },
        style,
      ]}
      testID={testID}
    >
      <Animated.View style={[styles.content, animatedStyle]}>
        {children}
      </Animated.View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
}); 