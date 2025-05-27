import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AnimatedModal } from '../AnimatedModal';
import { useStore } from '../../../store/useStore';

// Mock the store
jest.mock('../../../store/useStore', () => ({
  useStore: jest.fn(),
}));

// Mock StatusBar
jest.mock('react-native/Libraries/Components/StatusBar/StatusBar', () => ({
  setBarStyle: jest.fn(),
}));

describe('AnimatedModal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    (useStore as jest.Mock).mockReturnValue({
      isDarkMode: false,
    });
    mockOnClose.mockClear();
  });

  it('renders correctly when visible', () => {
    const { getByTestId } = render(
      <AnimatedModal
        visible={true}
        onClose={mockOnClose}
        testID="test-modal"
      >
        <View testID="modal-content">Content</View>
      </AnimatedModal>
    );

    const modal = getByTestId('test-modal');
    const content = getByTestId('modal-content');

    expect(modal).toBeTruthy();
    expect(content).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByTestId } = render(
      <AnimatedModal
        visible={false}
        onClose={mockOnClose}
        testID="test-modal"
      >
        <View testID="modal-content">Content</View>
      </AnimatedModal>
    );

    const modal = queryByTestId('test-modal');
    expect(modal).toBeNull();
  });

  it('calls onClose when backdrop is pressed', () => {
    const { getByTestId } = render(
      <AnimatedModal
        visible={true}
        onClose={mockOnClose}
        testID="test-modal"
      >
        <View testID="modal-content">Content</View>
      </AnimatedModal>
    );

    const backdrop = getByTestId('test-modal-backdrop');
    fireEvent.press(backdrop);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when backdrop press is disabled', () => {
    const { getByTestId } = render(
      <AnimatedModal
        visible={true}
        onClose={mockOnClose}
        closeOnBackdropPress={false}
        testID="test-modal"
      >
        <View testID="modal-content">Content</View>
      </AnimatedModal>
    );

    const backdrop = getByTestId('test-modal-backdrop');
    fireEvent.press(backdrop);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('applies custom container style', () => {
    const customStyle = { padding: 20 };
    const { getByTestId } = render(
      <AnimatedModal
        visible={true}
        onClose={mockOnClose}
        containerStyle={customStyle}
        testID="test-modal"
      >
        <View testID="modal-content">Content</View>
      </AnimatedModal>
    );

    const content = getByTestId('test-modal-content');
    expect(content.props.style).toContainEqual(customStyle);
  });

  it('applies dark theme styles', () => {
    (useStore as jest.Mock).mockReturnValue({
      isDarkMode: true,
    });

    const { getByTestId } = render(
      <AnimatedModal
        visible={true}
        onClose={mockOnClose}
        testID="test-modal"
      >
        <View testID="modal-content">Content</View>
      </AnimatedModal>
    );

    const content = getByTestId('test-modal-content');
    expect(content.props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: expect.any(String),
      })
    );
  });

  it('handles different animation types', () => {
    const { rerender } = render(
      <AnimatedModal
        visible={true}
        onClose={mockOnClose}
        animationType="slide"
        testID="test-modal"
      >
        <View testID="modal-content">Content</View>
      </AnimatedModal>
    );

    rerender(
      <AnimatedModal
        visible={true}
        onClose={mockOnClose}
        animationType="fade"
        testID="test-modal"
      >
        <View testID="modal-content">Content</View>
      </AnimatedModal>
    );

    // The modal should still be visible with the new animation type
    expect(mockOnClose).not.toHaveBeenCalled();
  });
}); 