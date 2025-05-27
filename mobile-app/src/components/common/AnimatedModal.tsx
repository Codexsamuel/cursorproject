import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  ViewStyle,
  Dimensions,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AnimatedModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  testID?: string;
  animationType?: 'slide' | 'fade';
  closeOnBackdropPress?: boolean;
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  visible,
  onClose,
  children,
  containerStyle,
  testID,
  animationType = 'slide',
  closeOnBackdropPress = true,
}) => {
  const { isDarkMode } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  // Animation values
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      StatusBar.setBarStyle('dark-content');
      if (animationType === 'slide') {
        translateY.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        });
      } else {
        opacity.value = withTiming(1, { duration: 300 });
      }
    } else {
      if (animationType === 'slide') {
        translateY.value = withSpring(SCREEN_HEIGHT, {
          damping: 15,
          stiffness: 150,
        }, () => {
          runOnJS(StatusBar.setBarStyle)('light-content');
        });
      } else {
        opacity.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(StatusBar.setBarStyle)('light-content');
        });
      }
    }
  }, [visible, animationType]);

  const modalStyle = useAnimatedStyle(() => {
    if (animationType === 'slide') {
      return {
        transform: [{ translateY: translateY.value }],
      };
    }
    return {
      opacity: opacity.value,
    };
  });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: animationType === 'slide'
      ? withSpring(visible ? 0.5 : 0, { damping: 15 })
      : opacity.value * 0.5,
  }));

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={onClose}
      testID={testID}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View
          style={[
            styles.backdrop,
            { backgroundColor: theme.overlay },
            backdropStyle,
          ]}
          testID={`${testID}-backdrop`}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.container,
                {
                  backgroundColor: theme.surface,
                },
                containerStyle,
                modalStyle,
              ]}
              testID={`${testID}-content`}
            >
              {children}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
}); 