import React from 'react';
import { render } from '@testing-library/react-native';
import { PageTransition } from '../PageTransition';
import { useStore } from '../../../store/useStore';

// Mock the store
const mockUseStore = useStore as unknown as jest.Mock;
jest.mock('../../../store/useStore', () => ({
  useStore: jest.fn(),
}));

// Mock setTimeout
jest.useFakeTimers();

describe('PageTransition Component', () => {
  beforeEach(() => {
    mockUseStore.mockReturnValue({
      isDarkMode: false,
    });
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <PageTransition testID="test-transition">
        <TestChild />
      </PageTransition>
    );

    const container = getByTestId('test-transition');
    expect(container).toBeTruthy();
    expect(getByTestId('test-child')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <PageTransition
        style={customStyle}
        testID="test-transition"
      >
        <TestChild />
      </PageTransition>
    );

    const container = getByTestId('test-transition');
    expect(container.props.style).toContainEqual(customStyle);
  });

  it('applies dark theme styles', () => {
    mockUseStore.mockReturnValue({
      isDarkMode: true,
    });

    const { getByTestId } = render(
      <PageTransition testID="test-transition">
        <TestChild />
      </PageTransition>
    );

    const container = getByTestId('test-transition');
    expect(container.props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: expect.any(String),
      })
    );
  });

  it('handles different transition types', () => {
    const { rerender, getByTestId } = render(
      <PageTransition
        type="fade"
        testID="test-transition"
      >
        <TestChild />
      </PageTransition>
    );

    let container = getByTestId('test-transition');
    expect(container.props.entering).toBeTruthy();
    expect(container.props.exiting).toBeTruthy();

    rerender(
      <PageTransition
        type="scale"
        testID="test-transition"
      >
        <TestChild />
      </PageTransition>
    );

    container = getByTestId('test-transition');
    expect(container.props.entering).toBeTruthy();
    expect(container.props.exiting).toBeTruthy();
  });

  it('handles custom duration and delay', () => {
    const duration = 500;
    const delay = 200;

    render(
      <PageTransition
        duration={duration}
        delay={delay}
        testID="test-transition"
      >
        <TestChild />
      </PageTransition>
    );

    // Fast-forward timers
    jest.advanceTimersByTime(delay);

    // Animation should start after delay
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), delay);
  });

  it('cleans up timeout on unmount', () => {
    const { unmount } = render(
      <PageTransition
        delay={200}
        testID="test-transition"
      >
        <TestChild />
      </PageTransition>
    );

    unmount();

    // Should clear timeout
    expect(clearTimeout).toHaveBeenCalled();
  });
});

// Test child component
const TestChild = () => (
  <div data-testid="test-child">
    Test Content
  </div>
); 