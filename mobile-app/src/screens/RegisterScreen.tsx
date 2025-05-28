import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useStore } from '../store/useStore';
import { PageTransition } from '../components/common/PageTransition';
import { colors } from '../theme/colors';
import { useOfflineRequest } from '../hooks/useConnectivity';
import { AuthNavigationProp } from '../types/navigation';

interface RegisterScreenProps {
  navigation: AuthNavigationProp;
}

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  user: {
    id: string;
    name: string;
    email: string;
    token: string;
  };
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { theme, login } = useStore(state => ({
    theme: state.theme,
    login: state.login,
  }));

  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<RegisterForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: Partial<RegisterForm> = {};

    if (!form.name) {
      newErrors.name = 'Le nom est requis';
    }

    if (!form.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

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

  const { retry } = useOfflineRequest<RegisterResponse>({
    url: '/api/auth/register',
    method: 'POST',
    body: {
      name: form.name,
      email: form.email,
      password: form.password,
    },
  });

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await retry();
      if (response?.user) {
        login(response.user);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    } catch (error) {
      Alert.alert(
        'Erreur d\'inscription',
        'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [form, validateForm, login, navigation, retry]);

  const handleLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  return (
    <PageTransition testID="register-screen">
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text.primary }]}>
              Inscription
            </Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              Créez votre compte
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text.primary }]}>
                Nom complet
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    color: theme.text.primary,
                    borderColor: errors.name ? theme.status.error : theme.border,
                  },
                ]}
                placeholder="Votre nom"
                placeholderTextColor={theme.text.secondary}
                autoCapitalize="words"
                value={form.name}
                onChangeText={name => {
                  setForm(prev => ({ ...prev, name }));
                  if (errors.name) {
                    setErrors(prev => ({ ...prev, name: undefined }));
                  }
                }}
                testID="name-input"
              />
              {errors.name && (
                <Text style={[styles.errorText, { color: theme.status.error }]}>
                  {errors.name}
                </Text>
              )}
            </View>

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
                    borderColor: errors.email ? theme.status.error : theme.border,
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
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }
                }}
                testID="email-input"
              />
              {errors.email && (
                <Text style={[styles.errorText, { color: theme.status.error }]}>
                  {errors.email}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text.primary }]}>
                Mot de passe
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
                placeholder="Votre mot de passe"
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
                placeholder="Confirmez votre mot de passe"
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
              testID="register-button"
            >
              <Text style={[styles.submitButtonText, { color: theme.text.inverse }]}>
                {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: theme.text.secondary }]}>
                Déjà un compte ?
              </Text>
              <TouchableOpacity
                onPress={handleLogin}
                testID="login-button"
              >
                <Text style={[styles.loginLink, { color: theme.primary }]}>
                  Se connecter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PageTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 