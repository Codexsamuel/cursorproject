import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { OptimizedImage } from '../OptimizedImage';
import { useStore } from '../../../store/useStore';

// Mock du store avec le bon type
const mockUseStore = useStore as unknown as jest.Mock;

jest.mock('../../../store/useStore', () => ({
  useStore: jest.fn(),
}));

describe('OptimizedImage', () => {
  const mockUri = 'https://example.com/image.jpg';
  const mockFallbackUri = 'https://example.com/fallback.jpg';

  beforeEach(() => {
    // Configuration du mock du store
    mockUseStore.mockReturnValue({
      isDarkMode: false,
      theme: {
        primary: '#000000',
      },
    });

    // Mock de fetch pour les tests de connectivité
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with required props', () => {
    const { getByTestId } = render(
      <OptimizedImage
        uri={mockUri}
        testID="test-image"
        style={{ width: 100, height: 100 }}
      />
    );

    const image = getByTestId('test-image');
    expect(image).toBeTruthy();
  });

  it('shows loading indicator initially', () => {
    const { getByTestId } = render(
      <OptimizedImage
        uri={mockUri}
        testID="test-image"
        showLoadingIndicator={true}
      />
    );

    const loadingIndicator = getByTestId('test-image-loading');
    expect(loadingIndicator).toBeTruthy();
  });

  it('handles image load error and shows fallback', async () => {
    const { getByTestId } = render(
      <OptimizedImage
        uri={mockUri}
        fallbackUri={mockFallbackUri}
        testID="test-image"
      />
    );

    const image = getByTestId('test-image');
    
    // Simuler une erreur de chargement
    await act(async () => {
      fireEvent(image, 'error', { nativeEvent: { error: 'Failed to load' } });
    });

    // Vérifier que l'image de fallback est utilisée
    expect(image.props.source.uri).toBe(mockFallbackUri);
  });

  it('caches loaded images', async () => {
    const { getByTestId, rerender } = render(
      <OptimizedImage
        uri={mockUri}
        testID="test-image"
        priority="high"
      />
    );

    const image = getByTestId('test-image');

    // Simuler le chargement réussi
    await act(async () => {
      fireEvent(image, 'load');
    });

    // Re-rendre avec la même URI
    rerender(
      <OptimizedImage
        uri={mockUri}
        testID="test-image-2"
        priority="high"
      />
    );

    // Vérifier que l'image est chargée immédiatement (pas d'indicateur de chargement)
    const loadingIndicator = getByTestId('test-image-2-loading');
    expect(loadingIndicator).toBeFalsy();
  });

  it('handles different priority levels', async () => {
    const { getByTestId } = render(
      <OptimizedImage
        uri={mockUri}
        testID="test-image"
        priority="low"
      />
    );

    const image = getByTestId('test-image');
    expect(image).toBeTruthy();

    // Re-rendre avec une priorité différente
    const { getByTestId: getByTestId2 } = render(
      <OptimizedImage
        uri={mockUri}
        testID="test-image-2"
        priority="high"
      />
    );

    const image2 = getByTestId2('test-image-2');
    expect(image2).toBeTruthy();
  });

  it('applies custom styles correctly', () => {
    const customStyle = {
      width: 200,
      height: 200,
      borderRadius: 10,
    };

    const { getByTestId } = render(
      <OptimizedImage
        uri={mockUri}
        testID="test-image"
        style={customStyle}
      />
    );

    const image = getByTestId('test-image');
    expect(image.props.style).toMatchObject(customStyle);
  });

  it('handles theme changes', () => {
    // Simuler un changement de thème
    mockUseStore.mockReturnValue({
      isDarkMode: true,
      theme: {
        primary: '#FFFFFF',
      },
    });

    const { getByTestId, rerender } = render(
      <OptimizedImage
        uri={mockUri}
        testID="test-image"
      />
    );

    const image = getByTestId('test-image');
    expect(image).toBeTruthy();

    // Re-rendre avec le thème clair
    mockUseStore.mockReturnValue({
      isDarkMode: false,
      theme: {
        primary: '#000000',
      },
    });

    rerender(
      <OptimizedImage
        uri={mockUri}
        testID="test-image"
      />
    );

    const imageLight = getByTestId('test-image');
    expect(imageLight).toBeTruthy();
  });
}); 