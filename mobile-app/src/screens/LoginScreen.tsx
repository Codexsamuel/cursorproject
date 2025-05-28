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

interface LoginScreenProps {
  navigation: AuthNavigationProp;
}

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    token: string;
  };
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { theme, login } = useStore(state => ({
    theme: state.theme,
    login: state.login,
  }));

  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: Partial<LoginForm> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const { retry } = useOfflineRequest<LoginResponse>({
    url: '/api/auth/login',
    method: 'POST',
    body: form,
  });

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await retry();
      if (response) {
        login(response.user);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    } catch (error) {
      Alert.alert(
        'Erreur de connexion',
        'Vérifiez vos identifiants et réessayez.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [form, validateForm, login, navigation, retry]);

  const handleRegister = useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  const handleForgotPassword = useCallback(() => {
    navigation.navigate('ForgotPassword');
  }, [navigation]);

  return (
    <PageTransition testID="login-screen">
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
              Connexion
            </Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              Connectez-vous à votre compte
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
                autoComplete="password"
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

            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPassword}
              testID="forgot-password-button"
            >
              <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: theme.primary },
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              testID="login-button"
            >
              <Text style={[styles.submitButtonText, { color: theme.text.inverse }]}>
                {isSubmitting ? 'Connexion...' : 'Se connecter'}
              </Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: theme.text.secondary }]}>
                Pas encore de compte ?
              </Text>
              <TouchableOpacity
                onPress={handleRegister}
                testID="register-button"
              >
                <Text style={[styles.registerLink, { color: theme.primary }]}>
                  S'inscrire
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
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 