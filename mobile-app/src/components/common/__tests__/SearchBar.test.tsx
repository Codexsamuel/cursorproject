import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { SearchBar } from '../SearchBar';
import { useStore } from '../../../store/useStore';

// Mock the store
const mockUseStore = useStore as unknown as jest.Mock;
jest.mock('../../../store/useStore', () => ({
  useStore: jest.fn(),
}));

// Mock setTimeout
jest.useFakeTimers();

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();
  const mockOnFilterPress = jest.fn();

  beforeEach(() => {
    mockUseStore.mockReturnValue({
      isDarkMode: false,
    });
    mockOnSearch.mockClear();
    mockOnFilterPress.mockClear();
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <SearchBar
        onSearch={mockOnSearch}
        testID="test-search"
      />
    );

    const searchBar = getByTestId('test-search');
    const input = getByTestId('test-search-input');
    const filterButton = getByTestId('test-search-filter-button');

    expect(searchBar).toBeTruthy();
    expect(input).toBeTruthy();
    expect(filterButton).toBeTruthy();
  });

  it('handles search input changes with debounce', () => {
    const { getByTestId } = render(
      <SearchBar
        onSearch={mockOnSearch}
        testID="test-search"
      />
    );

    const input = getByTestId('test-search-input');
    fireEvent.changeText(input, 'test query');

    // Should not call onSearch immediately
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should call onSearch after debounce
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('handles filter button press', () => {
    const { getByTestId } = render(
      <SearchBar
        onSearch={mockOnSearch}
        onFilterPress={mockOnFilterPress}
        testID="test-search"
      />
    );

    const filterButton = getByTestId('test-search-filter-button');
    fireEvent.press(filterButton);

    expect(mockOnFilterPress).toHaveBeenCalledTimes(1);
  });

  it('shows clear button when there is text', () => {
    const { getByTestId, queryByTestId } = render(
      <SearchBar
        onSearch={mockOnSearch}
        testID="test-search"
      />
    );

    // Initially, clear button should not be visible
    expect(queryByTestId('test-search-clear-button')).toBeNull();

    // Add some text
    const input = getByTestId('test-search-input');
    fireEvent.changeText(input, 'test query');

    // Clear button should be visible
    expect(getByTestId('test-search-clear-button')).toBeTruthy();

    // Clear the text
    fireEvent.press(getByTestId('test-search-clear-button'));

    // Input should be cleared
    expect(input.props.value).toBe('');
  });

  it('applies custom styles', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <SearchBar
        onSearch={mockOnSearch}
        containerStyle={customStyle}
        testID="test-search"
      />
    );

    const container = getByTestId('test-search');
    expect(container.props.style).toContainEqual(customStyle);
  });

  it('applies dark theme styles', () => {
    mockUseStore.mockReturnValue({
      isDarkMode: true,
    });

    const { getByTestId } = render(
      <SearchBar
        onSearch={mockOnSearch}
        testID="test-search"
      />
    );

    const container = getByTestId('test-search');
    expect(container.props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: expect.any(String),
      })
    );
  });

  it('hides filter button when showFilterButton is false', () => {
    const { queryByTestId } = render(
      <SearchBar
        onSearch={mockOnSearch}
        showFilterButton={false}
        testID="test-search"
      />
    );

    expect(queryByTestId('test-search-filter-button')).toBeNull();
  });

  it('uses custom debounce time', () => {
    const { getByTestId } = render(
      <SearchBar
        onSearch={mockOnSearch}
        debounceTime={500}
        testID="test-search"
      />
    );

    const input = getByTestId('test-search-input');
    fireEvent.changeText(input, 'test query');

    // Should not call onSearch immediately
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Fast-forward timers by less than debounce time
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should not call onSearch yet
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Fast-forward to debounce time
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Should call onSearch after debounce
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('uses initial value when provided', () => {
    const initialValue = 'initial search';
    const { getByTestId } = render(
      <SearchBar
        onSearch={mockOnSearch}
        initialValue={initialValue}
        testID="test-search"
      />
    );

    const input = getByTestId('test-search-input');
    expect(input.props.value).toBe(initialValue);
  });
}); 