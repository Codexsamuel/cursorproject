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

interface ForgotPasswordScreenProps {
  navigation: AuthNavigationProp;
}

interface ForgotPasswordForm {
  email: string;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const { theme } = useStore(state => ({
    theme: state.theme,
  }));

  const [form, setForm] = useState<ForgotPasswordForm>({
    email: '',
  });

  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = useCallback(() => {
    if (!form.email) {
      setError('L\'email est requis');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Format d\'email invalide');
      return false;
    }
    setError(undefined);
    return true;
  }, [form.email]);

  const { retry } = useOfflineRequest({
    url: '/api/auth/forgot-password',
    method: 'POST',
    body: {
      email: form.email,
    },
  });

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await retry();
      setIsSuccess(true);
      Alert.alert(
        'Email envoyé',
        'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation de mot de passe.'
      );
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de l\'envoi de l\'email. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [form, validateForm, retry]);

  const handleBackToLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  if (isSuccess) {
    return (
      <PageTransition testID="forgot-password-success-screen">
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.text.primary }]}>
              Email envoyé
            </Text>
            <Text style={[styles.message, { color: theme.text.secondary }]}>
              Si un compte existe avec cet email, vous recevrez un lien de réinitialisation de mot de passe.
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleBackToLogin}
              testID="back-to-login-button"
            >
              <Text style={[styles.buttonText, { color: theme.text.inverse }]}>
                Retour à la connexion
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </PageTransition>
    );
  }

  return (
    <PageTransition testID="forgot-password-screen">
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text.primary }]}>
              Mot de passe oublié
            </Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              Entrez votre email pour recevoir un lien de réinitialisation
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text.primary }]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    color: theme.text.primary,
                    borderColor: error ? theme.status.error : theme.border,
                  },
                ]}
                placeholder="votre@email.com"
                placeholderTextColor={theme.text.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={form.email}
                onChangeText={email => {
                  setForm(prev => ({ ...prev, email }));
                  if (error) {
                    setError(undefined);
                  }
                }}
                testID="email-input"
              />
              {error && (
                <Text style={[styles.errorText, { color: theme.status.error }]}>
                  {error}
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
                {isSubmitting ? 'Envoi...' : 'Envoyer le lien'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBackToLogin}
              testID="back-to-login-link"
            >
              <Text style={[styles.backLink, { color: theme.primary }]}>
                Retour à la connexion
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
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
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
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backLink: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
}); 