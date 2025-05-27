import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  Animated,
} from 'react-native';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  testID,
  onFocus,
  onBlur,
  ...props
}) => {
  const { isDarkMode } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;
  const [isFocused, setIsFocused] = useState(false);
  const [labelAnimation] = useState(new Animated.Value(props.value ? 1 : 0));

  const handleFocus = useCallback(
    (e: any) => {
      setIsFocused(true);
      Animated.timing(labelAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
      onFocus?.(e);
    },
    [onFocus, labelAnimation]
  );

  const handleBlur = useCallback(
    (e: any) => {
      setIsFocused(false);
      if (!props.value) {
        Animated.timing(labelAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
      onBlur?.(e);
    },
    [onBlur, props.value, labelAnimation]
  );

  const labelTranslateY = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  const labelScale = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      {label && (
        <Animated.Text
          style={[
            styles.label,
            {
              color: error
                ? theme.danger
                : isFocused
                ? theme.primary
                : theme.text.secondary,
              transform: [
                { translateY: labelTranslateY },
                { scale: labelScale },
              ],
            },
            labelStyle,
          ]}
          testID={`${testID}-label`}
        >
          {label}
        </Animated.Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error
              ? theme.danger
              : isFocused
              ? theme.primary
              : theme.border,
            backgroundColor: theme.surface,
          },
        ]}
        testID={`${testID}-input-container`}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: theme.text.primary,
              paddingLeft: leftIcon ? 40 : 16,
              paddingRight: rightIcon ? 40 : 16,
            },
            inputStyle,
          ]}
          placeholderTextColor={theme.text.disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          testID={`${testID}-input`}
          {...props}
        />
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
      {error && (
        <Text
          style={[styles.error, { color: theme.danger }, errorStyle]}
          testID={`${testID}-error`}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...typography.body2,
    marginBottom: 8,
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
  },
  input: {
    flex: 1,
    ...typography.body1,
    paddingVertical: 12,
  },
  iconContainer: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  error: {
    ...typography.caption,
    marginTop: 4,
  },
}); 