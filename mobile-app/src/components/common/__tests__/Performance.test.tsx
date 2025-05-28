import React from 'react';
import { render, act } from '@testing-library/react-native';
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

describe('Performance Tests', () => {
  const generateLargeDataSet = (count: number) => {
    return Array.from({ length: count }, (_, index) => ({
      id: index.toString(),
      imageUrl: `https://example.com/image${index}.jpg`,
      title: `Item ${index}`,
    }));
  };

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

  it('renders large list efficiently', () => {
    const largeDataSet = generateLargeDataSet(1000);
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

    const startTime = performance.now();

    const { getByTestId } = render(
      <AnimatedList
        data={largeDataSet}
        renderItem={renderItem}
        testID="test-list"
      />
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Vérifier que le temps de rendu est acceptable (moins de 1000ms)
    expect(renderTime).toBeLessThan(1000);

    const list = getByTestId('test-list');
    expect(list).toBeTruthy();
  });

  it('handles rapid theme changes efficiently', () => {
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
          data={generateLargeDataSet(100)}
          renderItem={renderItem}
          testID="test-list"
        />
      </PageTransition>
    );

    const themeChangeTimes: number[] = [];

    // Simuler 10 changements de thème rapides
    for (let i = 0; i < 10; i++) {
      const startTime = performance.now();

      mockUseStore.mockReturnValue({
        isDarkMode: i % 2 === 0,
        theme: {
          primary: i % 2 === 0 ? '#FFFFFF' : '#000000',
          background: i % 2 === 0 ? '#000000' : '#FFFFFF',
          text: { primary: i % 2 === 0 ? '#FFFFFF' : '#000000' },
          danger: '#FF0000',
        },
      });

      rerender(
        <PageTransition testID="test-transition">
          <AnimatedList
            data={generateLargeDataSet(100)}
            renderItem={renderItem}
            testID="test-list"
          />
        </PageTransition>
      );

      const endTime = performance.now();
      themeChangeTimes.push(endTime - startTime);
    }

    // Vérifier que le temps moyen de changement de thème est acceptable (moins de 100ms)
    const averageThemeChangeTime = themeChangeTimes.reduce((a, b) => a + b) / themeChangeTimes.length;
    expect(averageThemeChangeTime).toBeLessThan(100);
  });

  it('handles image loading efficiently', () => {
    const imageLoadTimes: number[] = [];
    const imageCount = 50;

    const renderItem = ({ item }: any) => (
      <View testID={`item-${item.id}`}>
        <OptimizedImage
          uri={item.imageUrl}
          testID={`image-${item.id}`}
          style={{ width: 100, height: 100 }}
          onLoadStart={() => {
            imageLoadTimes.push(performance.now());
          }}
          onLoadEnd={() => {
            const endTime = performance.now();
            const loadTime = endTime - imageLoadTimes[imageLoadTimes.length - 1];
            imageLoadTimes[imageLoadTimes.length - 1] = loadTime;
          }}
        />
        <View>{item.title}</View>
      </View>
    );

    render(
      <AnimatedList
        data={generateLargeDataSet(imageCount)}
        renderItem={renderItem}
        testID="test-list"
      />
    );

    // Simuler le chargement des images
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Vérifier que le temps moyen de chargement des images est acceptable (moins de 200ms)
    const averageLoadTime = imageLoadTimes.reduce((a, b) => a + b) / imageLoadTimes.length;
    expect(averageLoadTime).toBeLessThan(200);
  });

  it('handles rapid list updates efficiently', () => {
    const updateTimes: number[] = [];
    const initialData = generateLargeDataSet(100);
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

    const { rerender } = render(
      <AnimatedList
        data={initialData}
        renderItem={renderItem}
        testID="test-list"
      />
    );

    // Simuler 10 mises à jour rapides de la liste
    for (let i = 0; i < 10; i++) {
      const startTime = performance.now();

      const newData = generateLargeDataSet(100).map(item => ({
        ...item,
        title: `Updated ${item.title}`,
      }));

      rerender(
        <AnimatedList
          data={newData}
          renderItem={renderItem}
          testID="test-list"
        />
      );

      const endTime = performance.now();
      updateTimes.push(endTime - startTime);
    }

    // Vérifier que le temps moyen de mise à jour est acceptable (moins de 100ms)
    const averageUpdateTime = updateTimes.reduce((a, b) => a + b) / updateTimes.length;
    expect(averageUpdateTime).toBeLessThan(100);
  });

  it('handles memory usage efficiently', () => {
    const initialMemory = process.memoryUsage().heapUsed;
    const largeDataSet = generateLargeDataSet(1000);

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

    const { unmount } = render(
      <AnimatedList
        data={largeDataSet}
        renderItem={renderItem}
        testID="test-list"
      />
    );

    // Simuler l'utilisation de la liste
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Démonter le composant
    unmount();

    // Vérifier que la mémoire a été libérée
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryDiff = finalMemory - initialMemory;

    // Vérifier que la différence de mémoire est acceptable (moins de 50MB)
    expect(memoryDiff).toBeLessThan(50 * 1024 * 1024);
  });
}); 