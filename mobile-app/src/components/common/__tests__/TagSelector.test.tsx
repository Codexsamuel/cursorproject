import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { TagSelector, Tag } from '../TagSelector';
import { useStore } from '../../../store/useStore';

// Mock the store
const mockUseStore = useStore as unknown as jest.Mock;
jest.mock('../../../store/useStore', () => ({
  useStore: jest.fn(),
}));

// Mock FlashList
jest.mock('@shopify/flash-list', () => ({
  FlashList: 'FlashList',
}));

describe('TagSelector Component', () => {
  const mockTags: Tag[] = [
    { id: '1', label: 'Tag 1', color: '#FF0000' },
    { id: '2', label: 'Tag 2', icon: 'star' },
    { id: '3', label: 'Tag 3', color: '#00FF00' },
  ];

  const mockOnTagsChange = jest.fn();

  beforeEach(() => {
    mockUseStore.mockReturnValue({
      isDarkMode: false,
    });
    mockOnTagsChange.mockClear();
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <TagSelector
        tags={mockTags}
        selectedTags={[]}
        onTagsChange={mockOnTagsChange}
        testID="test-tagselector"
      />
    );

    const selector = getByTestId('test-tagselector-selector');
    expect(selector).toBeTruthy();
    expect(getByTestId('test-tagselector')).toBeTruthy();
  });

  it('displays selected tags', () => {
    const selectedTags = ['1', '3'];
    const { getByTestId } = render(
      <TagSelector
        tags={mockTags}
        selectedTags={selectedTags}
        onTagsChange={mockOnTagsChange}
        testID="test-tagselector"
      />
    );

    expect(getByTestId('test-tagselector-selected-tag-1')).toBeTruthy();
    expect(getByTestId('test-tagselector-selected-tag-3')).toBeTruthy();
  });

  it('handles tag selection', () => {
    const { getByTestId } = render(
      <TagSelector
        tags={mockTags}
        selectedTags={[]}
        onTagsChange={mockOnTagsChange}
        testID="test-tagselector"
      />
    );

    // Open dropdown
    const selector = getByTestId('test-tagselector-selector');
    fireEvent.press(selector);

    // Select a tag
    const tag = getByTestId('test-tagselector-tag-1');
    fireEvent.press(tag);

    expect(mockOnTagsChange).toHaveBeenCalledWith(['1']);
  });

  it('handles tag deselection', () => {
    const { getByTestId } = render(
      <TagSelector
        tags={mockTags}
        selectedTags={['1']}
        onTagsChange={mockOnTagsChange}
        testID="test-tagselector"
      />
    );

    // Open dropdown
    const selector = getByTestId('test-tagselector-selector');
    fireEvent.press(selector);

    // Deselect the tag
    const tag = getByTestId('test-tagselector-tag-1');
    fireEvent.press(tag);

    expect(mockOnTagsChange).toHaveBeenCalledWith([]);
  });

  it('respects maxTags limit', () => {
    const { getByTestId } = render(
      <TagSelector
        tags={mockTags}
        selectedTags={['1', '2']}
        onTagsChange={mockOnTagsChange}
        maxTags={2}
        testID="test-tagselector"
      />
    );

    // Open dropdown
    const selector = getByTestId('test-tagselector-selector');
    fireEvent.press(selector);

    // Try to select another tag
    const tag = getByTestId('test-tagselector-tag-3');
    fireEvent.press(tag);

    // Should not change selection
    expect(mockOnTagsChange).not.toHaveBeenCalled();
  });

  it('handles search functionality', () => {
    const { getByTestId } = render(
      <TagSelector
        tags={mockTags}
        selectedTags={[]}
        onTagsChange={mockOnTagsChange}
        searchable
        testID="test-tagselector"
      />
    );

    // Open dropdown
    const selector = getByTestId('test-tagselector-selector');
    fireEvent.press(selector);

    // Search for a tag
    const searchInput = getByTestId('test-tagselector-search-input');
    fireEvent.changeText(searchInput, 'Tag 1');

    // Fast-forward timers for debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should filter tags
    expect(getByTestId('test-tagselector-tag-1')).toBeTruthy();
    expect(() => getByTestId('test-tagselector-tag-2')).toThrow();
  });

  it('handles tag creation when creatable is true', () => {
    const { getByTestId } = render(
      <TagSelector
        tags={mockTags}
        selectedTags={[]}
        onTagsChange={mockOnTagsChange}
        creatable
        searchable
        testID="test-tagselector"
      />
    );

    // Open dropdown
    const selector = getByTestId('test-tagselector-selector');
    fireEvent.press(selector);

    // Enter new tag name
    const searchInput = getByTestId('test-tagselector-search-input');
    fireEvent.changeText(searchInput, 'New Tag');

    // Fast-forward timers for debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Click create button
    const createButton = getByTestId('test-tagselector-create-tag');
    fireEvent.press(createButton);

    // Should create and select new tag
    expect(mockOnTagsChange).toHaveBeenCalled();
    const newTagId = mockOnTagsChange.mock.calls[0][0][0];
    expect(newTagId).toMatch(/^new-\d+$/);
  });

  it('displays error message', () => {
    const errorMessage = 'Selection invalide';
    const { getByTestId } = render(
      <TagSelector
        tags={mockTags}
        selectedTags={[]}
        onTagsChange={mockOnTagsChange}
        error={errorMessage}
        testID="test-tagselector"
      />
    );

    const error = getByTestId('test-tagselector-error');
    expect(error).toBeTruthy();
    expect(error.props.children).toBe(errorMessage);
  });

  it('applies dark theme styles', () => {
    mockUseStore.mockReturnValue({
      isDarkMode: true,
    });

    const { getByTestId } = render(
      <TagSelector
        tags={mockTags}
        selectedTags={[]}
        onTagsChange={mockOnTagsChange}
        testID="test-tagselector"
      />
    );

    const selector = getByTestId('test-tagselector-selector');
    expect(selector.props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: expect.any(String),
      })
    );
  });

  it('handles disabled state', () => {
    const { getByTestId } = render(
      <TagSelector
        tags={mockTags}
        selectedTags={[]}
        onTagsChange={mockOnTagsChange}
        disabled
        testID="test-tagselector"
      />
    );

    const selector = getByTestId('test-tagselector-selector');
    expect(selector.props.style).toContainEqual(
      expect.objectContaining({
        opacity: 0.5,
      })
    );

    // Try to open dropdown
    fireEvent.press(selector);
    expect(() => getByTestId('test-tagselector-dropdown')).toThrow();
  });
}); 