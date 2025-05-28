import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { View } from 'react-native';
import { AnimatedList } from '../AnimatedList';
import { OptimizedImage } from '../OptimizedImage';
import { PageTransition } from '../PageTransition';
import { useStore } from '../../../store/useStore';

// Mock du store
const mockUseStore = useStore as unknown as jest.Mock;

jest.mock('../../../store/useStore', () => ({
  useStore: jest.fn(),
}));

// Mock de FlashList
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

// Mock de react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('Integration Tests', () => {
  const mockData = [
    { id: '1', imageUrl: 'https://example.com/image1.jpg', title: 'Item 1' },
    { id: '2', imageUrl: 'https://example.com/image2.jpg', title: 'Item 2' },
  ];

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

    // Mock des animations
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders a list of items with optimized images', () => {
    const renderItem = ({ item }: any) => (
      <View testID={`item-${item.id}`}>
        <OptimizedImage
          uri={item.imageUrl}
          testID={`image-${item.id}`}
          style={{ width: 100, height: 100 }}
        />
        <View>{item.title}</View>
      </View>
    );

    const { getByTestId, getAllByTestId } = render(
      <AnimatedList
        data={mockData}
        renderItem={renderItem}
        testID="test-list"
      />
    );

    const list = getByTestId('test-list');
    expect(list).toBeTruthy();

    const items = getAllByTestId(/item-\d+/);
    expect(items).toHaveLength(mockData.length);

    const images = getAllByTestId(/image-\d+/);
    expect(images).toHaveLength(mockData.length);
  });

  it('handles page transitions with list content', () => {
    const renderItem = ({ item }: any) => (
      <View testID={`item-${item.id}`}>
        <OptimizedImage
          uri={item.imageUrl}
          testID={`image-${item.id}`}
          style={{ width: 100, height: 100 }}
        />
        <View>{item.title}</View>
      </View>
    );

    const { getByTestId } = render(
      <PageTransition testID="test-transition">
        <AnimatedList
          data={mockData}
          renderItem={renderItem}
          testID="test-list"
        />
      </PageTransition>
    );

    const transition = getByTestId('test-transition');
    expect(transition).toBeTruthy();

    const list = getByTestId('test-list');
    expect(list).toBeTruthy();
  });

  it('handles theme changes across components', () => {
    const renderItem = ({ item }: any) => (
      <View testID={`item-${item.id}`}>
        <OptimizedImage
          uri={item.imageUrl}
          testID={`image-${item.id}`}
          style={{ width: 100, height: 100 }}
        />
        <View>{item.title}</View>
      </View>
    );

    const { getByTestId, rerender } = render(
      <PageTransition testID="test-transition">
        <AnimatedList
          data={mockData}
          renderItem={renderItem}
          testID="test-list"
        />
      </PageTransition>
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
      <PageTransition testID="test-transition">
        <AnimatedList
          data={mockData}
          renderItem={renderItem}
          testID="test-list"
        />
      </PageTransition>
    );

    const transition = getByTestId('test-transition');
    expect(transition.props.style).toContainEqual({ backgroundColor: '#000000' });
  });

  it('handles loading states across components', () => {
    const renderItem = ({ item }: any) => (
      <View testID={`item-${item.id}`}>
        <OptimizedImage
          uri={item.imageUrl}
          testID={`image-${item.id}`}
          style={{ width: 100, height: 100 }}
          showLoadingIndicator={true}
        />
        <View>{item.title}</View>
      </View>
    );

    const { getByTestId } = render(
      <PageTransition testID="test-transition">
        <AnimatedList
          data={mockData}
          renderItem={renderItem}
          loading={true}
          testID="test-list"
        />
      </PageTransition>
    );

    const list = getByTestId('test-list');
    expect(list).toBeTruthy();

    // Vérifier que les indicateurs de chargement sont présents
    const loadingIndicators = getByTestId('test-list-loading');
    expect(loadingIndicators).toBeTruthy();
  });

  it('handles error states across components', () => {
    const renderItem = ({ item }: any) => (
      <View testID={`item-${item.id}`}>
        <OptimizedImage
          uri={item.imageUrl}
          fallbackUri="https://example.com/fallback.jpg"
          testID={`image-${item.id}`}
          style={{ width: 100, height: 100 }}
        />
        <View>{item.title}</View>
      </View>
    );

    const { getByTestId, getByText } = render(
      <PageTransition testID="test-transition">
        <AnimatedList
          data={[]}
          renderItem={renderItem}
          error="Une erreur est survenue"
          onRetry={() => {}}
          testID="test-list"
        />
      </PageTransition>
    );

    const errorMessage = getByText('Une erreur est survenue');
    expect(errorMessage).toBeTruthy();

    const retryButton = getByText('Réessayer');
    expect(retryButton).toBeTruthy();
  });
}); 