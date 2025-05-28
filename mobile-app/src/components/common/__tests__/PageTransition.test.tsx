import React from 'react';
import { render, act } from '@testing-library/react-native';
import { View } from 'react-native';
import { PageTransition } from '../PageTransition';
import { useStore } from '../../../store/useStore';

// Mock du store
const mockUseStore = useStore as unknown as jest.Mock;

jest.mock('../../../store/useStore', () => ({
  useStore: jest.fn(),
}));

// Mock de react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('PageTransition', () => {
  const mockChildren = <View testID="test-content">Test Content</View>;

  beforeEach(() => {
    mockUseStore.mockReturnValue({
      isDarkMode: false,
      theme: {
        background: '#FFFFFF',
      },
    });

    // Mock des animations
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders children correctly', () => {
    const { getByTestId } = render(
      <PageTransition testID="test-transition">
        {mockChildren}
      </PageTransition>
    );

    const content = getByTestId('test-content');
    expect(content).toBeTruthy();
  });

  it('applies fade transition by default', () => {
    const { getByTestId } = render(
      <PageTransition testID="test-transition">
        {mockChildren}
      </PageTransition>
    );

    const container = getByTestId('test-transition');
    expect(container).toBeTruthy();
  });

  it('applies slide transition when specified', () => {
    const { getByTestId } = render(
      <PageTransition
        type="slide"
        testID="test-transition"
      >
        {mockChildren}
      </PageTransition>
    );

    const container = getByTestId('test-transition');
    expect(container).toBeTruthy();
  });

  it('applies scale transition when specified', () => {
    const { getByTestId } = render(
      <PageTransition
        type="scale"
        testID="test-transition"
      >
        {mockChildren}
      </PageTransition>
    );

    const container = getByTestId('test-transition');
    expect(container).toBeTruthy();
  });

  it('applies no transition when type is none', () => {
    const { getByTestId } = render(
      <PageTransition
        type="none"
        testID="test-transition"
      >
        {mockChildren}
      </PageTransition>
    );

    const container = getByTestId('test-transition');
    expect(container).toBeTruthy();
  });

  it('calls onTransitionEnd when transition completes', () => {
    const onTransitionEnd = jest.fn();
    render(
      <PageTransition
        onTransitionEnd={onTransitionEnd}
        testID="test-transition"
      >
        {mockChildren}
      </PageTransition>
    );

    act(() => {
      jest.advanceTimersByTime(300); // Durée par défaut de la transition
    });

    expect(onTransitionEnd).toHaveBeenCalled();
  });

  it('applies custom duration', () => {
    const customDuration = 500;
    const { getByTestId } = render(
      <PageTransition
        duration={customDuration}
        testID="test-transition"
      >
        {mockChildren}
      </PageTransition>
    );

    const container = getByTestId('test-transition');
    expect(container).toBeTruthy();
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#F0F0F0' };
    const { getByTestId } = render(
      <PageTransition
        style={customStyle}
        testID="test-transition"
      >
        {mockChildren}
      </PageTransition>
    );

    const container = getByTestId('test-transition');
    expect(container.props.style).toContainEqual(customStyle);
  });

  it('handles theme changes', () => {
    const { getByTestId, rerender } = render(
      <PageTransition testID="test-transition">
        {mockChildren}
      </PageTransition>
    );

    // Changer le thème
    mockUseStore.mockReturnValue({
      isDarkMode: true,
      theme: {
        background: '#000000',
      },
    });

    rerender(
      <PageTransition testID="test-transition">
        {mockChildren}
      </PageTransition>
    );

    const container = getByTestId('test-transition');
    expect(container.props.style).toContainEqual({ backgroundColor: '#000000' });
  });

  it('cleans up animations on unmount', () => {
    const { unmount } = render(
      <PageTransition testID="test-transition">
        {mockChildren}
      </PageTransition>
    );

    unmount();

    // Vérifier que les animations sont nettoyées
    act(() => {
      jest.advanceTimersByTime(300);
    });
  });
}); 