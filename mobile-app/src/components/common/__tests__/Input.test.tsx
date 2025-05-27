import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';
import { useStore } from '../../../store/useStore';

// Mock the store
jest.mock('../../../store/useStore', () => ({
  useStore: jest.fn(),
}));

describe('Input Component', () => {
  beforeEach(() => {
    // Default to light theme
    (useStore as jest.Mock).mockReturnValue({
      isDarkMode: false,
    });
  });

  it('renders correctly with label', () => {
    const { getByTestId } = render(
      <Input
        label="Test Label"
        testID="test-input"
      />
    );

    const input = getByTestId('test-input-input');
    const label = getByTestId('test-input-label');

    expect(input).toBeTruthy();
    expect(label).toHaveTextContent('Test Label');
  });

  it('handles focus and blur events', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { getByTestId } = render(
      <Input
        label="Test Label"
        onFocus={onFocus}
        onBlur={onBlur}
        testID="test-input"
      />
    );

    const input = getByTestId('test-input-input');
    fireEvent(input, 'focus');
    expect(onFocus).toHaveBeenCalledTimes(1);

    fireEvent(input, 'blur');
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('displays error message', () => {
    const errorMessage = 'This field is required';
    const { getByTestId } = render(
      <Input
        label="Test Label"
        error={errorMessage}
        testID="test-input"
      />
    );

    const error = getByTestId('test-input-error');
    expect(error).toHaveTextContent(errorMessage);
  });

  it('renders with left and right icons', () => {
    const LeftIcon = () => <View testID="left-icon" />;
    const RightIcon = () => <View testID="right-icon" />;

    const { getByTestId } = render(
      <Input
        label="Test Label"
        leftIcon={<LeftIcon />}
        rightIcon={<RightIcon />}
        testID="test-input"
      />
    );

    expect(getByTestId('left-icon')).toBeTruthy();
    expect(getByTestId('right-icon')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const customContainerStyle = { marginTop: 20 };
    const customInputStyle = { fontSize: 20 };
    const customLabelStyle = { color: 'red' };
    const customErrorStyle = { fontSize: 14 };

    const { getByTestId } = render(
      <Input
        label="Test Label"
        error="Test Error"
        containerStyle={customContainerStyle}
        inputStyle={customInputStyle}
        labelStyle={customLabelStyle}
        errorStyle={customErrorStyle}
        testID="test-input"
      />
    );

    const container = getByTestId('test-input');
    const input = getByTestId('test-input-input');
    const label = getByTestId('test-input-label');
    const error = getByTestId('test-input-error');

    expect(container.props.style).toContainEqual(customContainerStyle);
    expect(input.props.style).toContainEqual(customInputStyle);
    expect(label.props.style).toContainEqual(customLabelStyle);
    expect(error.props.style).toContainEqual(customErrorStyle);
  });

  it('applies dark theme styles', () => {
    (useStore as jest.Mock).mockReturnValue({
      isDarkMode: true,
    });

    const { getByTestId } = render(
      <Input
        label="Test Label"
        testID="test-input"
      />
    );

    const input = getByTestId('test-input-input');
    expect(input.props.style).toContainEqual(
      expect.objectContaining({
        color: expect.any(String),
      })
    );
  });

  it('handles value changes', () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <Input
        label="Test Label"
        onChangeText={onChangeText}
        testID="test-input"
      />
    );

    const input = getByTestId('test-input-input');
    fireEvent.changeText(input, 'new value');
    expect(onChangeText).toHaveBeenCalledWith('new value');
  });
}); 