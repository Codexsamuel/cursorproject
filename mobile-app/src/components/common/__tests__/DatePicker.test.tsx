import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { DatePicker } from '../DatePicker';
import { useStore } from '../../../store/useStore';

// Mock the store
const mockUseStore = useStore as unknown as jest.Mock;
jest.mock('../../../store/useStore', () => ({
  useStore: jest.fn(),
}));

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => ({
  __esModule: true,
  default: 'DateTimePicker',
}));

describe('DatePicker Component', () => {
  const mockOnChange = jest.fn();
  const testDate = new Date('2024-03-15T10:30:00');

  beforeEach(() => {
    mockUseStore.mockReturnValue({
      isDarkMode: false,
    });
    mockOnChange.mockClear();
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(
      <DatePicker
        value={testDate}
        onChange={mockOnChange}
        testID="test-datepicker"
      />
    );

    const container = getByTestId('test-datepicker');
    const button = getByTestId('test-datepicker-button');
    const text = getByTestId('test-datepicker-text');

    expect(container).toBeTruthy();
    expect(button).toBeTruthy();
    expect(text).toBeTruthy();
    expect(text.props.children).toBe('15 mars 2024');
  });

  it('renders with label', () => {
    const { getByTestId } = render(
      <DatePicker
        value={testDate}
        onChange={mockOnChange}
        label="Date de naissance"
        testID="test-datepicker"
      />
    );

    const label = getByTestId('test-datepicker-label');
    expect(label).toBeTruthy();
    expect(label.props.children).toBe('Date de naissance');
  });

  it('displays error message', () => {
    const errorMessage = 'Date invalide';
    const { getByTestId } = render(
      <DatePicker
        value={testDate}
        onChange={mockOnChange}
        error={errorMessage}
        testID="test-datepicker"
      />
    );

    const error = getByTestId('test-datepicker-error');
    expect(error).toBeTruthy();
    expect(error.props.children).toBe(errorMessage);
  });

  it('handles different modes', () => {
    const { getByTestId, rerender } = render(
      <DatePicker
        value={testDate}
        onChange={mockOnChange}
        mode="time"
        testID="test-datepicker"
      />
    );

    let text = getByTestId('test-datepicker-text');
    expect(text.props.children).toBe('10:30');

    rerender(
      <DatePicker
        value={testDate}
        onChange={mockOnChange}
        mode="datetime"
        testID="test-datepicker"
      />
    );

    text = getByTestId('test-datepicker-text');
    expect(text.props.children).toBe('15 mars 2024 10:30');
  });

  it('handles disabled state', () => {
    const { getByTestId } = render(
      <DatePicker
        value={testDate}
        onChange={mockOnChange}
        disabled
        testID="test-datepicker"
      />
    );

    const container = getByTestId('test-datepicker-input-container');
    expect(container.props.style).toContainEqual(
      expect.objectContaining({
        opacity: 0.5,
      })
    );
  });

  it('applies custom styles', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <DatePicker
        value={testDate}
        onChange={mockOnChange}
        containerStyle={customStyle}
        testID="test-datepicker"
      />
    );

    const container = getByTestId('test-datepicker');
    expect(container.props.style).toContainEqual(customStyle);
  });

  it('applies dark theme styles', () => {
    mockUseStore.mockReturnValue({
      isDarkMode: true,
    });

    const { getByTestId } = render(
      <DatePicker
        value={testDate}
        onChange={mockOnChange}
        testID="test-datepicker"
      />
    );

    const container = getByTestId('test-datepicker-input-container');
    expect(container.props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: expect.any(String),
      })
    );
  });

  it('shows picker on press', () => {
    const { getByTestId, queryByTestId } = render(
      <DatePicker
        value={testDate}
        onChange={mockOnChange}
        testID="test-datepicker"
      />
    );

    // Initially, picker should not be visible
    expect(queryByTestId('test-datepicker-picker')).toBeNull();

    // Press the button
    const button = getByTestId('test-datepicker-button');
    fireEvent.press(button);

    // Picker should be visible
    expect(getByTestId('test-datepicker-picker')).toBeTruthy();
  });

  it('handles minimum and maximum dates', () => {
    const minDate = new Date('2024-01-01');
    const maxDate = new Date('2024-12-31');

    const { getByTestId } = render(
      <DatePicker
        value={testDate}
        onChange={mockOnChange}
        minimumDate={minDate}
        maximumDate={maxDate}
        testID="test-datepicker"
      />
    );

    const button = getByTestId('test-datepicker-button');
    fireEvent.press(button);

    const picker = getByTestId('test-datepicker-picker');
    expect(picker.props.minimumDate).toBe(minDate);
    expect(picker.props.maximumDate).toBe(maxDate);
  });
}); 