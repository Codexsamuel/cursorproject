import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AnimatedCard } from '../AnimatedCard';
import { useStore } from '../../../store/useStore';

// Mock the store
jest.mock('../../../store/useStore', () => ({
  useStore: jest.fn(),
}));

// Mock useWindowDimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  useWindowDimensions: () => ({
    width: 400,
    height: 800,
  }),
}));

describe('AnimatedCard Component', () => {
  beforeEach(() => {
    // Default to light theme
    (useStore as jest.Mock).mockReturnValue({
      isDarkMode: false,
    });
  });

  it('renders correctly with children', () => {
    const { getByTestId } = render(
      <AnimatedCard testID="test-card">
        <TestChild />
      </AnimatedCard>
    );

    const card = getByTestId('test-card');
    const child = getByTestId('test-child');

    expect(card).toBeTruthy();
    expect(child).toBeTruthy();
  });

  it('handles press events when onPress is provided', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AnimatedCard onPress={onPress} testID="test-card">
        <TestChild />
      </AnimatedCard>
    );

    fireEvent.press(getByTestId('test-card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('applies dark theme styles', () => {
    (useStore as jest.Mock).mockReturnValue({
      isDarkMode: true,
    });

    const { getByTestId } = render(
      <AnimatedCard testID="test-card">
        <TestChild />
      </AnimatedCard>
    );

    const card = getByTestId('test-card');
    expect(card.props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: expect.any(String),
        borderColor: expect.any(String),
      })
    );
  });

  it('applies custom styles', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <AnimatedCard style={customStyle} testID="test-card">
        <TestChild />
      </AnimatedCard>
    );

    const card = getByTestId('test-card');
    expect(card.props.style).toContainEqual(customStyle);
  });

  it('renders without press handler when onPress is not provided', () => {
    const { getByTestId } = render(
      <AnimatedCard testID="test-card">
        <TestChild />
      </AnimatedCard>
    );

    const card = getByTestId('test-card');
    expect(card.props.onPress).toBeUndefined();
  });
});

// Test child component
const TestChild = () => (
  <View testID="test-child">
    <Text>Test Content</Text>
  </View>
); 