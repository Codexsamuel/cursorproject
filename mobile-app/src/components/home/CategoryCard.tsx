import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  View,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export interface Category {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  style?: ViewStyle;
  testID?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  style,
  testID,
}) => {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, { backgroundColor: category.color }, style]}
        testID={testID}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={category.icon}
            size={24}
            color={colors.light.white}
          />
        </View>
        <Animated.Text
          style={styles.name}
          numberOfLines={2}
        >
          {category.name}
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.subtitle2,
    color: colors.light.white,
    fontWeight: 'bold',
  },
}); 