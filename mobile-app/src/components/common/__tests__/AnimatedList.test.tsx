import React from 'react';
import { render } from '@testing-library/react-native';
import { AnimatedList } from '../AnimatedList';
import { useStore } from '../../../store/useStore';

// Mock the store
jest.mock('../../../store/useStore', () => ({
  useStore: jest.fn(),
}));

// Mock FlashList
jest.mock('@shopify/flash-list', () => ({
  FlashList: 'FlashList',
}));

describe('AnimatedList Component', () => {
  const mockData = [
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
    { id: '3', title: 'Item 3' },
  ];

  beforeEach(() => {
    (useStore as jest.Mock).mockReturnValue({
      isDarkMode: false,
    });
  });

  it('renders correctly with data', () => {
    const renderItem = ({ item }: any) => (
      <View testID={`item-${item.id}`}>{item.title}</View>
    );

    const { getByTestId } = render(
      <AnimatedList
        data={mockData}
        renderItem={renderItem}
        testID="test-list"
      />
    );

    const list = getByTestId('test-list-list');
    expect(list).toBeTruthy();
  });

  it('applies custom container style', () => {
    const customStyle = { marginTop: 20 };
    const renderItem = ({ item }: any) => (
      <View testID={`item-${item.id}`}>{item.title}</View>
    );

    const { getByTestId } = render(
      <AnimatedList
        data={mockData}
        renderItem={renderItem}
        containerStyle={customStyle}
        testID="test-list"
      />
    );

    const container = getByTestId('test-list');
    expect(container.props.style).toContainEqual(customStyle);
  });

  it('applies dark theme styles', () => {
    (useStore as jest.Mock).mockReturnValue({
      isDarkMode: true,
    });

    const renderItem = ({ item }: any) => (
      <View testID={`item-${item.id}`}>{item.title}</View>
    );

    const { getByTestId } = render(
      <AnimatedList
        data={mockData}
        renderItem={renderItem}
        testID="test-list"
      />
    );

    const container = getByTestId('test-list');
    expect(container.props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: expect.any(String),
      })
    );
  });

  it('uses custom estimatedItemSize', () => {
    const renderItem = ({ item }: any) => (
      <View testID={`item-${item.id}`}>{item.title}</View>
    );

    const { getByTestId } = render(
      <AnimatedList
        data={mockData}
        renderItem={renderItem}
        estimatedItemSize={200}
        testID="test-list"
      />
    );

    const list = getByTestId('test-list-list');
    expect(list.props.estimatedItemSize).toBe(200);
  });

  it('handles items without id', () => {
    const dataWithoutIds = [
      { title: 'Item 1' },
      { title: 'Item 2' },
      { title: 'Item 3' },
    ];

    const renderItem = ({ item, index }: any) => (
      <View testID={`item-${index}`}>{item.title}</View>
    );

    const { getByTestId } = render(
      <AnimatedList
        data={dataWithoutIds}
        renderItem={renderItem}
        testID="test-list"
      />
    );

    const list = getByTestId('test-list-list');
    expect(list).toBeTruthy();
  });
}); 