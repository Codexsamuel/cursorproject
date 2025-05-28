import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { PaymentScreen } from '../PaymentScreen';
import { useOfflineRequest } from '../../hooks/useConnectivity';
import { useStripe } from '@stripe/stripe-react-native';
import { Alert } from 'react-native';
import { useStore } from '../../store/useStore';
import { useSupabase } from '../../hooks/useSupabase';
import { Linking } from 'react-native';

// Mock des hooks
jest.mock('../../hooks/useConnectivity');
jest.mock('@stripe/stripe-react-native');
jest.mock('../../store/useStore', () => ({
  useStore: () => ({
    theme: {
      background: '#FFFFFF',
      text: {
        primary: '#000000',
        secondary: '#666666',
        inverse: '#FFFFFF',
      },
      primary: '#007AFF',
      border: '#E5E5E5',
      status: {
        error: '#FF3B30',
        success: '#34C759',
      },
      card: '#F5F5F5',
    },
  }),
}));

jest.mock('../../store/useStore');
jest.mock('../../hooks/useSupabase');
jest.mock('react-native/Libraries/Linking/Linking');

// Mock des données de test
const mockPaymentMethods = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: '2',
    type: 'card',
    last4: '5555',
    brand: 'mastercard',
    expiryMonth: 6,
    expiryYear: 2024,
    isDefault: false,
  },
];

describe('PaymentScreen', () => {
  const mockRetry = jest.fn();
  const mockCreateToken = jest.fn();
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock useOfflineRequest
    (useOfflineRequest as jest.Mock).mockImplementation(({ url, method }) => {
      if (url === '/api/payment-methods' && !method) {
        return {
          data: mockPaymentMethods,
          loading: false,
          error: null,
          retry: mockRetry,
        };
      }
      if (url === '/api/payment-methods' && method === 'POST') {
        return {
          retry: jest.fn().mockResolvedValue({}),
        };
      }
      return {};
    });

    // Mock useStripe
    (useStripe as jest.Mock).mockReturnValue({
      createToken: mockCreateToken,
    });

    // Mock fetch
    global.fetch = jest.fn();

    // Mock useStore
    (useStore as jest.Mock).mockReturnValue({
      theme: {
        primary: '#007AFF',
        background: '#FFFFFF',
        card: '#F2F2F7',
        text: {
          primary: '#000000',
          secondary: '#8E8E93',
          inverse: '#FFFFFF',
        },
        border: '#C6C6C8',
        status: {
          success: '#34C759',
          error: '#FF3B30',
          warning: '#FF9500',
          info: '#5856D6',
        },
      },
    });

    // Mock useSupabase
    (useSupabase as jest.Mock).mockReturnValue({
      session: {
        access_token: 'mock-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      },
      loading: false,
    });
  });

  it('renders loading state correctly', () => {
    (useSupabase as jest.Mock).mockReturnValue({
      session: null,
      loading: true,
    });

    const { getByTestId } = render(<PaymentScreen navigation={mockNavigation} />);
    expect(getByTestId('payment-loading')).toBeTruthy();
  });

  it('renders error state correctly', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { getByTestId, getByText } = render(
      <PaymentScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByTestId('payment-error')).toBeTruthy();
      expect(getByText('Une erreur est survenue lors du chargement des modes de paiement.')).toBeTruthy();
    });
  });

  it('renders payment methods list correctly', async () => {
    const { getByText } = render(<PaymentScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('VISA •••• 4242')).toBeTruthy();
      expect(getByText('Expire 12/25')).toBeTruthy();
      expect(getByText('Mobile Money (+237612345678)')).toBeTruthy();
      expect(getByText('Par défaut')).toBeTruthy();
    });
  });

  it('handles adding a new card', async () => {
    const { getByTestId, getByText } = render(
      <PaymentScreen navigation={mockNavigation} />
    );

    // Click add button
    fireEvent.press(getByTestId('add-card-button'));

    // Fill card form
    fireEvent.changeText(getByTestId('card-name-input'), 'John Doe');

    // Mock card field completion
    const cardField = getByTestId('card-field');
    fireEvent(cardField, 'cardChange', { complete: true });

    // Submit form
    fireEvent.press(getByTestId('submit-button'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token',
        },
        body: JSON.stringify({ token: 'tok_123' }),
      });
    });
  });

  it('handles adding mobile money', async () => {
    const { getByTestId } = render(<PaymentScreen navigation={mockNavigation} />);

    // Click add button
    fireEvent.press(getByTestId('add-card-button'));

    // Switch to mobile money
    fireEvent.press(getByText('Mobile Money'));

    // Click add mobile money button
    fireEvent.press(getByTestId('cinetpay-button'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/payments/cinetpay/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token',
        },
        body: JSON.stringify({
          transaction_id: expect.stringMatching(/^CP-\d+-[a-z0-9]+$/),
          amount: 1000,
          currency: 'XAF',
          channels: 'CM_OM,CM_MTN,CM_ORANGE',
          description: 'Ajout de moyen de paiement',
        }),
      });
    });
  });

  it('handles setting default payment method', async () => {
    const { getByTestId } = render(<PaymentScreen navigation={mockNavigation} />);

    await waitFor(() => {
      // Find the set default button for the non-default card
      const setDefaultButton = getByTestId('set-default-mobile-1');
      fireEvent.press(setDefaultButton);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/payment-methods/mobile-1/default',
        {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer mock-token',
          },
        }
      );
    });
  });

  it('handles removing payment method', async () => {
    const { getByTestId } = render(<PaymentScreen navigation={mockNavigation} />);

    await waitFor(() => {
      // Find the remove button for a card
      const removeButton = getByTestId('remove-card-1');
      fireEvent.press(removeButton);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/payment-methods/card-1',
        {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer mock-token',
          },
        }
      );
    });
  });

  it('handles CinetPay deep linking', async () => {
    const { getByTestId } = render(<PaymentScreen navigation={mockNavigation} />);

    // Mock successful payment URL
    const mockUrl = 'myapp://cinetpay?status=success&transaction_id=tx_123';
    (Linking.addEventListener as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'url') {
        callback({ url: mockUrl });
      }
      return { remove: jest.fn() };
    });

    // Mock verification response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'success' }),
      })
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/payments/cinetpay/verify/tx_123',
        {
          headers: {
            Authorization: 'Bearer mock-token',
          },
        }
      );
    });
  });

  it('validates card form correctly', async () => {
    const { getByTestId, getByText } = render(
      <PaymentScreen navigation={mockNavigation} />
    );

    // Click add button
    fireEvent.press(getByTestId('add-card-button'));

    // Try to submit without filling the form
    fireEvent.press(getByTestId('submit-button'));

    await waitFor(() => {
      expect(getByText('Le nom est requis')).toBeTruthy();
      expect(getByText('Informations de carte invalides')).toBeTruthy();
    });

    // Fill name but not card
    fireEvent.changeText(getByTestId('card-name-input'), 'John Doe');
    fireEvent.press(getByTestId('submit-button'));

    await waitFor(() => {
      expect(getByText('Informations de carte invalides')).toBeTruthy();
    });
  });

  it('affiche le bouton d\'ajout de carte', () => {
    const { getByTestId } = render(<PaymentScreen navigation={mockNavigation as any} />);
    
    expect(getByTestId('add-card-button')).toBeTruthy();
  });

  it('affiche le formulaire d\'ajout de carte', async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <PaymentScreen navigation={mockNavigation as any} />
    );

    fireEvent.press(getByTestId('add-card-button'));

    expect(getByPlaceholderText('JEAN DUPONT')).toBeTruthy();
    expect(getByTestId('card-field')).toBeTruthy();
  });

  it('valide le formulaire avant soumission', async () => {
    const { getByTestId, getByText } = render(
      <PaymentScreen navigation={mockNavigation as any} />
    );

    fireEvent.press(getByTestId('add-card-button'));
    fireEvent.press(getByTestId('submit-button'));

    expect(getByText('Le nom est requis')).toBeTruthy();
    expect(getByText('Informations de carte invalides')).toBeTruthy();
  });

  it('gère l\'ajout d\'une carte avec succès', async () => {
    const mockToken = { id: 'tok_123' };
    mockCreateToken.mockResolvedValueOnce({ token: mockToken });

    const { getByTestId, getByPlaceholderText } = render(
      <PaymentScreen navigation={mockNavigation as any} />
    );

    fireEvent.press(getByTestId('add-card-button'));

    // Remplir le formulaire
    fireEvent.changeText(getByPlaceholderText('JEAN DUPONT'), 'JEAN DUPONT');
    
    // Simuler une carte valide
    act(() => {
      const cardField = getByTestId('card-field');
      fireEvent(cardField, 'onCardChange', { complete: true });
    });

    // Soumettre le formulaire
    await act(async () => {
      fireEvent.press(getByTestId('submit-button'));
    });

    expect(mockCreateToken).toHaveBeenCalledWith({
      type: 'Card',
      name: 'JEAN DUPONT',
    });
    expect(mockRetry).toHaveBeenCalled();
  });

  it('gère la suppression d\'une carte', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const { getByTestId } = render(<PaymentScreen navigation={mockNavigation as any} />);

    await act(async () => {
      fireEvent.press(getByTestId('remove-2'));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/payment-methods/2',
      expect.objectContaining({
        method: 'DELETE',
      })
    );
    expect(mockRetry).toHaveBeenCalled();
  });

  it('gère la définition d\'une carte par défaut', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const { getByTestId } = render(<PaymentScreen navigation={mockNavigation as any} />);

    await act(async () => {
      fireEvent.press(getByTestId('set-default-2'));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/payment-methods/2/default',
      expect.objectContaining({
        method: 'PUT',
      })
    );
    expect(mockRetry).toHaveBeenCalled();
  });

  it('gère les erreurs de l\'API', async () => {
    const mockAlert = jest.spyOn(Alert, 'alert');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Erreur serveur' }),
    });

    const { getByTestId } = render(<PaymentScreen navigation={mockNavigation as any} />);

    await act(async () => {
      fireEvent.press(getByTestId('remove-2'));
    });

    expect(mockAlert).toHaveBeenCalledWith(
      'Erreur',
      'Erreur serveur'
    );
  });

  it('affiche l\'état de chargement', () => {
    (useOfflineRequest as jest.Mock).mockImplementation(() => ({
      loading: true,
      error: null,
    }));

    const { getByText } = render(<PaymentScreen navigation={mockNavigation as any} />);
    
    expect(getByText('Chargement...')).toBeTruthy();
  });

  it('affiche l\'état d\'erreur avec bouton de réessai', () => {
    (useOfflineRequest as jest.Mock).mockImplementation(() => ({
      loading: false,
      error: new Error('Erreur réseau'),
      retry: mockRetry,
    }));

    const { getByText, getByTestId } = render(
      <PaymentScreen navigation={mockNavigation as any} />
    );
    
    expect(getByText('Une erreur est survenue lors du chargement des modes de paiement.')).toBeTruthy();
    
    fireEvent.press(getByTestId('retry-button'));
    expect(mockRetry).toHaveBeenCalled();
  });
}); 