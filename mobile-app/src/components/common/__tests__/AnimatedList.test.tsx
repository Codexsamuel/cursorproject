import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { View } from 'react-native';
import { AnimatedList } from '../AnimatedList';
import { useStore } from '../../../store/useStore';

// Mock du store
const mockUseStore = useStore as unknown as jest.Mock;

jest.mock('../../../store/useStore', () => ({
  useStore: jest.fn(),
}));

// Mock de FlashList car il utilise des APIs natives
jest.mock('@shopify/flash-list', () => {
  const { View } = require('react-native');
  return {
    FlashList: ({ data, renderItem, testID, ...props }: any) => (
      <View testID={testID} {...props}>
        {data.map((item: any, index: number) => (
          <View key={index} testID={`${testID}-item-${index}`}>
            {renderItem({ item, index })}
          </View>
        ))}
      </View>
    ),
  };
});

describe('AnimatedList', () => {
  const mockData = [
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
    { id: '3', title: 'Item 3' },
  ];

  const mockRenderItem = ({ item }: any) => (
    <View testID={`item-${item.id}`}>{item.title}</View>
  );

  beforeEach(() => {
    mockUseStore.mockReturnValue({
      isDarkMode: false,
      theme: {
        primary: '#000000',
        background: '#FFFFFF',
        text: { primary: '#000000' },
        danger: '#FF0000',
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders list with data correctly', () => {
    const { getByTestId, getAllByTestId } = render(
      <AnimatedList
        data={mockData}
        renderItem={mockRenderItem}
        testID="test-list"
      />
    );

    const list = getByTestId('test-list');
    expect(list).toBeTruthy();

    const items = getAllByTestId(/test-list-item-\d+/);
    expect(items).toHaveLength(mockData.length);
  });

  it('shows loading indicator when loading prop is true', () => {
    const { getByTestId } = render(
      <AnimatedList
        data={[]}
        renderItem={mockRenderItem}
        loading={true}
        testID="test-list"
      />
    );

    const loadingIndicator = getByTestId('test-list-loading');
    expect(loadingIndicator).toBeTruthy();
  });

  it('shows error message when error prop is provided', () => {
    const errorMessage = 'Une erreur est survenue';
    const { getByText } = render(
      <AnimatedList
        data={[]}
        renderItem={mockRenderItem}
        error={errorMessage}
        testID="test-list"
      />
    );

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('shows empty message when data is empty', () => {
    const emptyMessage = 'Aucun élément trouvé';
    const { getByText } = render(
      <AnimatedList
        data={[]}
        renderItem={mockRenderItem}
        emptyMessage={emptyMessage}
        testID="test-list"
      />
    );

    expect(getByText(emptyMessage)).toBeTruthy();
  });

  it('calls onRetry when retry button is pressed', () => {
    const onRetry = jest.fn();
    const { getByText } = render(
      <AnimatedList
        data={[]}
        renderItem={mockRenderItem}
        error="Error"
        onRetry={onRetry}
        testID="test-list"
      />
    );

    const retryButton = getByText('Réessayer');
    fireEvent.press(retryButton);
    expect(onRetry).toHaveBeenCalled();
  });

  it('applies custom styles correctly', () => {
    const customStyle = { backgroundColor: '#F0F0F0' };
    const { getByTestId } = render(
      <AnimatedList
        data={mockData}
        renderItem={mockRenderItem}
        containerStyle={customStyle}
        testID="test-list"
      />
    );

    const container = getByTestId('test-list');
    expect(container.props.style).toContainEqual(customStyle);
  });

  it('handles theme changes', () => {
    const { getByTestId, rerender } = render(
      <AnimatedList
        data={mockData}
        renderItem={mockRenderItem}
        testID="test-list"
      />
    );

    // Changer le thème
    mockUseStore.mockReturnValue({
      isDarkMode: true,
      theme: {
        primary: '#FFFFFF',
        background: '#000000',
        text: { primary: '#FFFFFF' },
        danger: '#FF0000',
      },
    });

    rerender(
      <AnimatedList
        data={mockData}
        renderItem={mockRenderItem}
        testID="test-list"
      />
    );

    const container = getByTestId('test-list');
    expect(container.props.style).toContainEqual({ backgroundColor: '#000000' });
  });

  it('handles refresh control correctly', async () => {
    const onRefresh = jest.fn();
    const { getByTestId } = render(
      <AnimatedList
        data={mockData}
        renderItem={mockRenderItem}
        onRefresh={onRefresh}
        refreshing={false}
        testID="test-list"
      />
    );

    const list = getByTestId('test-list');
    await act(async () => {
      fireEvent(list, 'refresh');
    });

    expect(onRefresh).toHaveBeenCalled();
  });

  it('handles end reached correctly', async () => {
    const onEndReached = jest.fn();
    const { getByTestId } = render(
      <AnimatedList
        data={mockData}
        renderItem={mockRenderItem}
        onEndReached={onEndReached}
        testID="test-list"
      />
    );

    const list = getByTestId('test-list');
    await act(async () => {
      fireEvent(list, 'endReached');
    });

    expect(onEndReached).toHaveBeenCalled();
  });
}); 