import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { SearchBar } from './SearchBar';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export interface Tag {
  id: string;
  label: string;
  color?: string;
  icon?: string;
}

interface TagSelectorProps {
  tags: Tag[];
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  testID?: string;
  maxTags?: number;
  searchable?: boolean;
  creatable?: boolean;
  disabled?: boolean;
}

const AnimatedFlashList = Animated.createAnimatedComponent<FlashList<Tag>>(FlashList);

export const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  selectedTags,
  onTagsChange,
  label,
  error,
  containerStyle,
  testID,
  maxTags = 5,
  searchable = true,
  creatable = false,
  disabled = false,
}) => {
  const { isDarkMode } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Animation values
  const expandAnimation = useSharedValue(0);
  const tagScale = useSharedValue(1);

  const filteredTags = useMemo(() => {
    if (!searchQuery) return tags;
    const query = searchQuery.toLowerCase();
    return tags.filter(tag => 
      tag.label.toLowerCase().includes(query)
    );
  }, [tags, searchQuery]);

  const handleTagPress = useCallback((tagId: string) => {
    if (disabled) return;

    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : selectedTags.length < maxTags
      ? [...selectedTags, tagId]
      : selectedTags;

    onTagsChange(newSelectedTags);
  }, [selectedTags, maxTags, onTagsChange, disabled]);

  const handleExpand = useCallback(() => {
    if (disabled) return;
    setIsExpanded(!isExpanded);
    expandAnimation.value = withSpring(isExpanded ? 0 : 1, {
      damping: 15,
      stiffness: 150,
    });
  }, [isExpanded, disabled, expandAnimation]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCreateTag = useCallback(() => {
    if (!creatable || !searchQuery.trim()) return;
    
    const newTag: Tag = {
      id: `new-${Date.now()}`,
      label: searchQuery.trim(),
      color: theme.primary,
    };
    
    onTagsChange([...selectedTags, newTag.id]);
    setSearchQuery('');
  }, [creatable, searchQuery, selectedTags, onTagsChange, theme.primary]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      expandAnimation.value,
      [0, 1],
      [0, 200],
      Extrapolate.CLAMP
    );

    return {
      height,
      opacity: expandAnimation.value,
    };
  });

  const tagAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: tagScale.value }],
    };
  });

  const renderTag = useCallback(({ item }: { item: Tag }) => {
    const isSelected = selectedTags.includes(item.id);
    const tagColor = item.color || theme.primary;

    return (
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        layout={Layout.springify()}
        style={styles.tagContainer}
      >
        <TouchableOpacity
          onPress={() => handleTagPress(item.id)}
          style={[
            styles.tag,
            {
              backgroundColor: isSelected ? tagColor : theme.surface,
              borderColor: isSelected ? tagColor : theme.border,
            },
            tagAnimatedStyle,
          ]}
          disabled={disabled}
          testID={`${testID}-tag-${item.id}`}
        >
          {item.icon && (
            <MaterialIcons
              name={item.icon as any}
              size={16}
              color={isSelected ? theme.white : tagColor}
              style={styles.tagIcon}
            />
          )}
          <Animated.Text
            style={[
              styles.tagText,
              {
                color: isSelected ? theme.white : theme.text.primary,
              },
            ]}
          >
            {item.label}
          </Animated.Text>
          {isSelected && (
            <MaterialIcons
              name="check"
              size={16}
              color={theme.white}
              style={styles.tagIcon}
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }, [selectedTags, theme, disabled, handleTagPress, tagAnimatedStyle]);

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      {label && (
        <Animated.Text
          style={[
            styles.label,
            {
              color: error ? theme.danger : theme.text.secondary,
            },
          ]}
          testID={`${testID}-label`}
        >
          {label}
        </Animated.Text>
      )}
      <TouchableOpacity
        onPress={handleExpand}
        style={[
          styles.selector,
          {
            backgroundColor: theme.surface,
            borderColor: error ? theme.danger : theme.border,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        disabled={disabled}
        testID={`${testID}-selector`}
      >
        <View style={styles.selectedTags}>
          {selectedTags.length > 0 ? (
            selectedTags.map(tagId => {
              const tag = tags.find(t => t.id === tagId);
              if (!tag) return null;
              return (
                <View
                  key={tagId}
                  style={[
                    styles.selectedTag,
                    { backgroundColor: tag.color || theme.primary },
                  ]}
                  testID={`${testID}-selected-tag-${tagId}`}
                >
                  <Animated.Text
                    style={[styles.selectedTagText, { color: theme.white }]}
                  >
                    {tag.label}
                  </Animated.Text>
                </View>
              );
            })
          ) : (
            <Animated.Text
              style={[styles.placeholder, { color: theme.text.disabled }]}
            >
              Sélectionner des tags...
            </Animated.Text>
          )}
        </View>
        <MaterialIcons
          name={isExpanded ? 'expand-less' : 'expand-more'}
          size={24}
          color={theme.text.secondary}
        />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.dropdown,
          { backgroundColor: theme.surface },
          containerAnimatedStyle,
        ]}
        testID={`${testID}-dropdown`}
      >
        {searchable && (
          <SearchBar
            onSearch={handleSearch}
            placeholder="Rechercher des tags..."
            containerStyle={styles.searchBar}
            testID={`${testID}-search`}
          />
        )}
        <AnimatedFlashList
          data={filteredTags}
          renderItem={renderTag}
          estimatedItemSize={40}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tagList}
          testID={`${testID}-tag-list`}
        />
        {creatable && searchQuery.trim() && (
          <TouchableOpacity
            onPress={handleCreateTag}
            style={[
              styles.createTag,
              { backgroundColor: theme.primary },
            ]}
            testID={`${testID}-create-tag`}
          >
            <MaterialIcons name="add" size={20} color={theme.white} />
            <Animated.Text style={[styles.createTagText, { color: theme.white }]}>
              Créer "{searchQuery.trim()}"
            </Animated.Text>
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && (
        <Animated.Text
          style={[styles.error, { color: theme.danger }]}
          testID={`${testID}-error`}
        >
          {error}
        </Animated.Text>
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
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
    paddingHorizontal: 16,
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
  selectedTags: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 8,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  selectedTagText: {
    ...typography.caption,
    marginRight: 4,
  },
  placeholder: {
    ...typography.body1,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    borderRadius: 8,
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  searchBar: {
    margin: 8,
  },
  tagList: {
    padding: 8,
  },
  tagContainer: {
    marginVertical: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    ...typography.body2,
    marginRight: 4,
  },
  createTag: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 8,
    borderRadius: 8,
  },
  createTagText: {
    ...typography.body2,
    marginLeft: 8,
  },
  error: {
    ...typography.caption,
    marginTop: 4,
  },
}); 