import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useStore } from '../store/useStore';
import { PageTransition } from '../components/common/PageTransition';
import { useOfflineRequest } from '../hooks/useConnectivity';
import { AuthNavigationProp } from '../types/navigation';

interface ResetPasswordScreenProps {
  navigation: AuthNavigationProp;
  route: {
    params: {
      token: string;
    };
  };
}

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ navigation, route }) => {
  const { theme } = useStore(state => ({
    theme: state.theme,
  }));

  const [form, setForm] = useState<ResetPasswordForm>({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<ResetPasswordForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: Partial<ResetPasswordForm> = {};

    if (!form.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (form.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const { retry } = useOfflineRequest({
    url: '/api/auth/reset-password',
    method: 'POST',
    body: {
      token: route.params.token,
      password: form.password,
    },
  });

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await retry();
      Alert.alert(
        'Mot de passe réinitialisé',
        'Votre mot de passe a été réinitialisé avec succès.',
        [
          {
            text: 'OK',
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            }),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la réinitialisation du mot de passe. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [form, validateForm, navigation, retry, route.params.token]);

  return (
    <PageTransition testID="reset-password-screen">
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text.primary }]}>
              Réinitialiser le mot de passe
            </Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              Entrez votre nouveau mot de passe
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text.primary }]}>
                Nouveau mot de passe
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    color: theme.text.primary,
                    borderColor: errors.password ? theme.status.error : theme.border,
                  },
                ]}
                placeholder="Votre nouveau mot de passe"
                placeholderTextColor={theme.text.secondary}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                value={form.password}
                onChangeText={password => {
                  setForm(prev => ({ ...prev, password }));
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
                testID="password-input"
              />
              {errors.password && (
                <Text style={[styles.errorText, { color: theme.status.error }]}>
                  {errors.password}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text.primary }]}>
                Confirmer le mot de passe
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    color: theme.text.primary,
                    borderColor: errors.confirmPassword ? theme.status.error : theme.border,
                  },
                ]}
                placeholder="Confirmez votre nouveau mot de passe"
                placeholderTextColor={theme.text.secondary}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                value={form.confirmPassword}
                onChangeText={confirmPassword => {
                  setForm(prev => ({ ...prev, confirmPassword }));
                  if (errors.confirmPassword) {
                    setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                  }
                }}
                testID="confirm-password-input"
              />
              {errors.confirmPassword && (
                <Text style={[styles.errorText, { color: theme.status.error }]}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: theme.primary },
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              testID="submit-button"
            >
              <Text style={[styles.submitButtonText, { color: theme.text.inverse }]}>
                {isSubmitting ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </PageTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 