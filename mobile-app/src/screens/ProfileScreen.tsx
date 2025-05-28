import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useStore } from '../store/useStore';
import { PageTransition } from '../components/common/PageTransition';
import { colors } from '../theme/colors';
import { ProfileNavigationProp } from '../types/navigation';

interface ProfileScreenProps {
  navigation: ProfileNavigationProp;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { isDarkMode, toggleTheme, user, logout } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  // TODO: Remplacer par les données réelles de l'utilisateur
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue Example, 75000 Paris',
  };

  const handleLogout = useCallback(() => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }, [logout, navigation]);

  const handleEditProfile = useCallback(() => {
    // TODO: Implémenter l'édition du profil
    console.log('Éditer le profil');
  }, []);

  const handleViewOrders = useCallback(() => {
    navigation.navigate('Orders');
  }, [navigation]);

  const handleViewAddresses = useCallback(() => {
    // TODO: Implémenter la gestion des adresses
    console.log('Gérer les adresses');
  }, []);

  const handleViewPaymentMethods = useCallback(() => {
    // TODO: Implémenter la gestion des moyens de paiement
    console.log('Gérer les moyens de paiement');
  }, []);

  return (
    <PageTransition testID="profile-screen">
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <View style={styles.avatarContainer}>
            <Text style={[styles.avatarText, { color: theme.text.inverse }]}>
              {userData.name.charAt(0)}
            </Text>
          </View>
          <Text style={[styles.userName, { color: theme.text.primary }]}>
            {userData.name}
          </Text>
          <Text style={[styles.userEmail, { color: theme.text.secondary }]}>
            {userData.email}
          </Text>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: theme.primary }]}
            onPress={handleEditProfile}
            testID="edit-profile-button"
          >
            <Text style={[styles.editButtonText, { color: theme.text.inverse }]}>
              Modifier le profil
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Paramètres
          </Text>
          <View style={[styles.settingItem, { backgroundColor: theme.card }]}>
            <Text style={[styles.settingLabel, { color: theme.text.primary }]}>
              Mode sombre
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              testID="theme-switch"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Compte
          </Text>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card }]}
            onPress={handleViewOrders}
            testID="orders-button"
          >
            <Text style={[styles.menuItemText, { color: theme.text.primary }]}>
              Mes commandes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card }]}
            onPress={handleViewAddresses}
            testID="addresses-button"
          >
            <Text style={[styles.menuItemText, { color: theme.text.primary }]}>
              Mes adresses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card }]}
            onPress={handleViewPaymentMethods}
            testID="payment-methods-button"
          >
            <Text style={[styles.menuItemText, { color: theme.text.primary }]}>
              Moyens de paiement
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: theme.danger }]}
          onPress={handleLogout}
          testID="logout-button"
        >
          <Text style={[styles.logoutButtonText, { color: theme.text.inverse }]}>
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </PageTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 15,
  },
  editButton: {
    padding: 10,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
  },
  settingLabel: {
    fontSize: 16,
  },
  menuItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  menuItemText: {
    fontSize: 16,
  },
  logoutButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 