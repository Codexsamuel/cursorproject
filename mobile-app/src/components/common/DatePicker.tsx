import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  testID?: string;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  error,
  containerStyle,
  testID,
  mode = 'date',
  minimumDate,
  maximumDate,
  disabled = false,
}) => {
  const { isDarkMode } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;
  const [showPicker, setShowPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Animation values
  const scale = useSharedValue(1);
  const labelAnimation = useSharedValue(value ? 1 : 0);

  const handlePress = useCallback(() => {
    if (!disabled) {
      setShowPicker(true);
      setIsFocused(true);
      scale.value = withSpring(0.98, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [disabled, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  }, [scale]);

  const handleChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      setShowPicker(false);
      setIsFocused(false);

      if (event.type === 'set' && selectedDate) {
        onChange(selectedDate);
      }
    },
    [onChange]
  );

  const formatDate = useCallback((date: Date) => {
    switch (mode) {
      case 'date':
        return format(date, 'dd MMMM yyyy', { locale: fr });
      case 'time':
        return format(date, 'HH:mm', { locale: fr });
      case 'datetime':
        return format(date, 'dd MMMM yyyy HH:mm', { locale: fr });
      default:
        return format(date, 'dd MMMM yyyy', { locale: fr });
    }
  }, [mode]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const labelAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      labelAnimation.value,
      [0, 1],
      [0, -25],
      Extrapolate.CLAMP
    );
    const labelScale = interpolate(
      labelAnimation.value,
      [0, 1],
      [1, 0.8],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateY },
        { scale: labelScale },
      ],
    };
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
            },
            labelAnimatedStyle,
          ]}
          testID={`${testID}-label`}
        >
          {label}
        </Animated.Text>
      )}
      <TouchableOpacity
        onPress={handlePress}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.7}
        testID={`${testID}-button`}
      >
        <Animated.View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.surface,
              borderColor: error
                ? theme.danger
                : isFocused
                ? theme.primary
                : theme.border,
              opacity: disabled ? 0.5 : 1,
            },
            containerAnimatedStyle,
          ]}
          testID={`${testID}-input-container`}
        >
          <MaterialIcons
            name={mode === 'time' ? 'access-time' : 'event'}
            size={20}
            color={isFocused ? theme.primary : theme.text.secondary}
            style={styles.icon}
          />
          <Animated.Text
            style={[
              styles.text,
              {
                color: theme.text.primary,
              },
            ]}
            testID={`${testID}-text`}
          >
            {formatDate(value)}
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
      {error && (
        <Animated.Text
          style={[styles.error, { color: theme.danger }]}
          testID={`${testID}-error`}
        >
          {error}
        </Animated.Text>
      )}
      {showPicker && (
        <DateTimePicker
          value={value}
          mode={mode}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          testID={`${testID}-picker`}
        />
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
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    ...typography.body1,
    flex: 1,
  },
  error: {
    ...typography.caption,
    marginTop: 4,
  },
}); 