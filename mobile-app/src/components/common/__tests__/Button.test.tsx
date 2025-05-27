import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';
import { useStore } from '../../../store/useStore';

// Mock the store
jest.mock('../../../store/useStore', () => ({
  useStore: jest.fn(),
}));

describe('Button Component', () => {
  beforeEach(() => {
    // Default to light theme
    (useStore as jest.Mock).mockReturnValue({
      isDarkMode: false,
    });
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <Button
        onPress={() => {}}
        title="Test Button"
        testID="test-button"
      />
    );

    const button = getByTestId('test-button');
    const text = getByTestId('test-button-text');

    expect(button).toBeTruthy();
    expect(text).toHaveTextContent('Test Button');
  });

  it('handles press events', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button
        onPress={onPress}
        title="Test Button"
        testID="test-button"
      />
    );

    fireEvent.press(getByTestId('test-button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    const { getByTestId } = render(
      <Button
        onPress={() => {}}
        title="Test Button"
        loading
        testID="test-button"
      />
    );

    expect(getByTestId('test-button-loading')).toBeTruthy();
  });

  it('applies disabled styles when disabled', () => {
    const { getByTestId } = render(
      <Button
        onPress={() => {}}
        title="Test Button"
        disabled
        testID="test-button"
      />
    );

    const button = getByTestId('test-button');
    expect(button.props.style).toContainEqual(expect.objectContaining({ opacity: 0.5 }));
  });

  it('applies different variants correctly', () => {
    const { getByTestId, rerender } = render(
      <Button
        onPress={() => {}}
        title="Test Button"
        variant="secondary"
        testID="test-button"
      />
    );

    let button = getByTestId('test-button');
    expect(button.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );

    rerender(
      <Button
        onPress={() => {}}
        title="Test Button"
        variant="outline"
        testID="test-button"
      />
    );

    button = getByTestId('test-button');
    expect(button.props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: 'transparent',
        borderWidth: 1,
      })
    );
  });

  it('applies different sizes correctly', () => {
    const { getByTestId, rerender } = render(
      <Button
        onPress={() => {}}
        title="Test Button"
        size="small"
        testID="test-button"
      />
    );

    let button = getByTestId('test-button');
    expect(button.props.style).toContainEqual(
      expect.objectContaining({
        paddingVertical: 8,
        paddingHorizontal: 16,
      })
    );

    rerender(
      <Button
        onPress={() => {}}
        title="Test Button"
        size="large"
        testID="test-button"
      />
    );

    button = getByTestId('test-button');
    expect(button.props.style).toContainEqual(
      expect.objectContaining({
        paddingVertical: 16,
        paddingHorizontal: 24,
      })
    );
  });

  it('applies dark theme styles', () => {
    (useStore as jest.Mock).mockReturnValue({
      isDarkMode: true,
    });

    const { getByTestId } = render(
      <Button
        onPress={() => {}}
        title="Test Button"
        testID="test-button"
      />
    );

    const button = getByTestId('test-button');
    expect(button.props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: expect.any(String),
      })
    );
  });
}); 