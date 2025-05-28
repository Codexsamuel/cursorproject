import React, { useCallback, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import { useStore } from '../store/useStore';
import { PageTransition } from '../components/common/PageTransition';
import { useOfflineRequest } from '../hooks/useConnectivity';
import { ProfileNavigationProp } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { CardField, useStripe, useConfirmPayment } from '@stripe/stripe-react-native';
import { Animated } from 'react-native';
import { useSupabase } from '../hooks/useSupabase';
import { PaymentMethod } from '../types/payment';

// Types
interface PaymentScreenProps {
  navigation: ProfileNavigationProp;
}

type PaymentProvider = 'stripe' | 'cinetpay';

interface CardFormData {
  name: string;
  complete: boolean;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation }) => {
  const { theme } = useStore(state => ({
    theme: state.theme,
  }));
  const { createToken } = useStripe();
  const { confirmPayment } = useConfirmPayment();
  const { supabase, session } = useSupabase();

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('stripe');
  const [cardForm, setCardForm] = useState<CardFormData>({
    name: '',
    complete: false,
  });
  const [formErrors, setFormErrors] = useState<Partial<CardFormData>>({});
  const [fadeAnim] = useState(new Animated.Value(1));

  // Récupérer les moyens de paiement
  const { data: paymentMethods, loading, error, retry } = useOfflineRequest<PaymentMethod[]>({
    url: '/api/payment-methods',
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  // Gérer l'ajout d'une carte Stripe
  const handleAddStripeCard = useCallback(async () => {
    if (!validateCardForm()) return;

    try {
      setIsProcessing(true);

      // Créer un token Stripe
      const { token, error: stripeError } = await createToken({
        type: 'Card',
        name: cardForm.name,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (!token) {
        throw new Error('Impossible de créer le token de carte');
      }

      // Envoyer le token au backend
      const response = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ token: token.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Réinitialiser le formulaire
      setIsAddingCard(false);
      setCardForm({ name: '', complete: false });
      setFormErrors({});
      
      // Rafraîchir la liste
      retry();

      // Animation de succès
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

    } catch (error) {
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'ajout de la carte.'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [cardForm, createToken, session, retry, fadeAnim]);

  // Gérer l'ajout d'un moyen de paiement CinetPay
  const handleAddCinetPay = useCallback(async () => {
    try {
      setIsProcessing(true);

      // Générer un ID de transaction unique
      const transactionId = `CP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Appeler l'API CinetPay
      const response = await fetch('/api/payments/cinetpay/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          transaction_id: transactionId,
          amount: 1000, // Montant en FCFA
          currency: 'XAF',
          channels: 'CM_OM,CM_MTN,CM_ORANGE', // Mobile Money Cameroun
          description: 'Ajout de moyen de paiement',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const { payment_url } = await response.json();

      // Ouvrir l'URL de paiement
      const canOpen = await Linking.canOpenURL(payment_url);
      if (canOpen) {
        await Linking.openURL(payment_url);
      } else {
        throw new Error('Impossible d\'ouvrir l\'application de paiement');
      }

    } catch (error) {
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'initialisation du paiement.'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [session]);

  // Gérer la suppression d'une carte
  const handleRemoveCard = useCallback(async (id: string) => {
    try {
      setIsProcessing(true);

      const response = await fetch(`/api/payment-methods/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Animation de suppression
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      retry();
    } catch (error) {
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : 'Une erreur est survenue lors de la suppression de la carte.'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [session, retry, fadeAnim]);

  // Gérer la définition d'une carte par défaut
  const handleSetDefaultCard = useCallback(async (id: string) => {
    try {
      setIsProcessing(true);

      const response = await fetch(`/api/payment-methods/${id}/default`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      retry();
    } catch (error) {
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : 'Une erreur est survenue lors du changement de carte par défaut.'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [session, retry]);

  // Valider le formulaire
  const validateCardForm = useCallback((): boolean => {
    const errors: Partial<CardFormData> = {};
    
    if (!cardForm.name.trim()) {
      errors.name = 'Le nom est requis';
    }
    
    if (!cardForm.complete) {
      errors.complete = 'Informations de carte invalides';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [cardForm]);

  // Écouter les événements de paiement CinetPay
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      if (event.url.includes('cinetpay')) {
        const params = new URLSearchParams(event.url.split('?')[1]);
        const status = params.get('status');
        const transactionId = params.get('transaction_id');

        if (status === 'success' && transactionId) {
          // Vérifier le statut du paiement
          const response = await fetch(`/api/payments/cinetpay/verify/${transactionId}`, {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          });

          if (response.ok) {
            Alert.alert('Succès', 'Moyen de paiement ajouté avec succès');
            retry();
          } else {
            Alert.alert('Erreur', 'Le paiement n\'a pas pu être vérifié');
          }
        } else {
          Alert.alert('Erreur', 'Le paiement a échoué');
        }
      }
    };

    // S'abonner aux événements de deep linking
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [session, retry]);

  if (loading) {
    return (
      <PageTransition testID="payment-loading">
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text.primary }]}>
            Chargement...
          </Text>
        </View>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition testID="payment-error">
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={[styles.errorText, { color: theme.status.error }]}>
            Une erreur est survenue lors du chargement des modes de paiement.
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.primary }]}
            onPress={retry}
            testID="retry-button"
          >
            <Text style={[styles.retryButtonText, { color: theme.text.inverse }]}>
              Réessayer
            </Text>
          </TouchableOpacity>
        </View>
      </PageTransition>
    );
  }

  return (
    <PageTransition testID="payment-screen">
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text.primary }]}>
            Modes de paiement
          </Text>
          {!isAddingCard && (
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={() => setIsAddingCard(true)}
              disabled={isProcessing}
              testID="add-card-button"
            >
              <Ionicons name="add" size={24} color={theme.text.inverse} />
              <Text style={[styles.addButtonText, { color: theme.text.inverse }]}>
                Ajouter
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {isAddingCard ? (
          <View style={[styles.cardForm, { backgroundColor: theme.card }]}>
            <Text style={[styles.formTitle, { color: theme.text.primary }]}>
              Ajouter un moyen de paiement
            </Text>

            {/* Sélecteur de fournisseur */}
            <View style={styles.providerSelector}>
              <TouchableOpacity
                style={[
                  styles.providerButton,
                  selectedProvider === 'stripe' && { backgroundColor: theme.primary },
                ]}
                onPress={() => setSelectedProvider('stripe')}
              >
                <Ionicons
                  name="card-outline"
                  size={24}
                  color={selectedProvider === 'stripe' ? theme.text.inverse : theme.text.primary}
                />
                <Text
                  style={[
                    styles.providerButtonText,
                    { color: selectedProvider === 'stripe' ? theme.text.inverse : theme.text.primary },
                  ]}
                >
                  Carte bancaire
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.providerButton,
                  selectedProvider === 'cinetpay' && { backgroundColor: theme.primary },
                ]}
                onPress={() => setSelectedProvider('cinetpay')}
              >
                <Ionicons
                  name="phone-portrait-outline"
                  size={24}
                  color={selectedProvider === 'cinetpay' ? theme.text.inverse : theme.text.primary}
                />
                <Text
                  style={[
                    styles.providerButtonText,
                    { color: selectedProvider === 'cinetpay' ? theme.text.inverse : theme.text.primary },
                  ]}
                >
                  Mobile Money
                </Text>
              </TouchableOpacity>
            </View>

            {selectedProvider === 'stripe' ? (
              <>
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: theme.text.primary }]}>
                    Nom sur la carte
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.background,
                        color: theme.text.primary,
                        borderColor: formErrors.name ? theme.status.error : theme.border,
                      },
                    ]}
                    placeholder="JEAN DUPONT"
                    placeholderTextColor={theme.text.secondary}
                    autoCapitalize="characters"
                    value={cardForm.name}
                    onChangeText={name => {
                      setCardForm(prev => ({ ...prev, name }));
                      if (formErrors.name) {
                        setFormErrors(prev => ({ ...prev, name: undefined }));
                      }
                    }}
                    testID="card-name-input"
                  />
                  {formErrors.name && (
                    <Text style={[styles.errorText, { color: theme.status.error }]}>
                      {formErrors.name}
                    </Text>
                  )}
                </View>

                <View style={styles.cardFieldContainer}>
                  <CardField
                    postalCodeEnabled={false}
                    placeholder={{
                      number: '4242 4242 4242 4242',
                    }}
                    cardStyle={{
                      backgroundColor: theme.background,
                      textColor: theme.text.primary,
                      borderColor: formErrors.complete ? theme.status.error : theme.border,
                    }}
                    style={styles.cardField}
                    onCardChange={details => {
                      setCardForm(prev => ({ ...prev, complete: details.complete }));
                      if (formErrors.complete) {
                        setFormErrors(prev => ({ ...prev, complete: undefined }));
                      }
                    }}
                    testID="card-field"
                  />
                  {formErrors.complete && (
                    <Text style={[styles.errorText, { color: theme.status.error }]}>
                      {formErrors.complete}
                    </Text>
                  )}
                </View>

                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={[styles.cancelButton, { borderColor: theme.border }]}
                    onPress={() => {
                      setIsAddingCard(false);
                      setCardForm({ name: '', complete: false });
                      setFormErrors({});
                    }}
                    disabled={isProcessing}
                    testID="cancel-button"
                  >
                    <Text style={[styles.cancelButtonText, { color: theme.text.primary }]}>
                      Annuler
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      { backgroundColor: theme.primary },
                      isProcessing && styles.submitButtonDisabled,
                    ]}
                    onPress={handleAddStripeCard}
                    disabled={isProcessing}
                    testID="submit-button"
                  >
                    {isProcessing ? (
                      <ActivityIndicator color={theme.text.inverse} />
                    ) : (
                      <Text style={[styles.submitButtonText, { color: theme.text.inverse }]}>
                        Ajouter
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.cinetpayContainer}>
                <Text style={[styles.cinetpayText, { color: theme.text.primary }]}>
                  Ajoutez Mobile Money (MTN, Orange) comme moyen de paiement
                </Text>
                <TouchableOpacity
                  style={[styles.cinetpayButton, { backgroundColor: theme.primary }]}
                  onPress={handleAddCinetPay}
                  disabled={isProcessing}
                  testID="cinetpay-button"
                >
                  {isProcessing ? (
                    <ActivityIndicator color={theme.text.inverse} />
                  ) : (
                    <>
                      <Ionicons name="phone-portrait" size={24} color={theme.text.inverse} />
                      <Text style={[styles.cinetpayButtonText, { color: theme.text.inverse }]}>
                        Ajouter Mobile Money
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.paymentMethods}>
              {paymentMethods?.map(method => (
                <View
                  key={method.id}
                  style={[styles.paymentMethod, { backgroundColor: theme.card }]}
                >
                  <View style={styles.paymentMethodInfo}>
                    {method.type === 'card' ? (
                      <>
                        <Ionicons
                          name="card-outline"
                          size={24}
                          color={theme.text.primary}
                        />
                        <View>
                          <Text style={[styles.paymentMethodText, { color: theme.text.primary }]}>
                            {method.brand?.toUpperCase()} •••• {method.last4}
                          </Text>
                          <Text style={[styles.paymentMethodExpiry, { color: theme.text.secondary }]}>
                            Expire {method.expiry}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <Ionicons
                          name="phone-portrait-outline"
                          size={24}
                          color={theme.text.primary}
                        />
                        <Text style={[styles.paymentMethodText, { color: theme.text.primary }]}>
                          Mobile Money ({method.phone})
                        </Text>
                      </>
                    )}
                    {method.is_default && (
                      <View
                        style={[
                          styles.defaultBadge,
                          { backgroundColor: theme.status.success },
                        ]}
                      >
                        <Text style={[styles.defaultBadgeText, { color: theme.text.inverse }]}>
                          Par défaut
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.paymentMethodActions}>
                    {!method.is_default && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleSetDefaultCard(method.id)}
                        disabled={isProcessing}
                        testID={`set-default-${method.id}`}
                      >
                        <Ionicons
                          name="star-outline"
                          size={20}
                          color={theme.text.secondary}
                        />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleRemoveCard(method.id)}
                      disabled={isProcessing}
                      testID={`remove-${method.id}`}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={theme.status.error}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </PageTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  cardForm: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  providerSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  providerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  providerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  cardFieldContainer: {
    marginBottom: 16,
  },
  cardField: {
    height: 50,
    width: '100%',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  cinetpayContainer: {
    alignItems: 'center',
    padding: 20,
  },
  cinetpayText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  cinetpayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cinetpayButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    fontSize: 16,
    marginLeft: 12,
  },
  paymentMethodExpiry: {
    fontSize: 12,
    marginTop: 2,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paymentMethodActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  retryButton: {
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 20,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 