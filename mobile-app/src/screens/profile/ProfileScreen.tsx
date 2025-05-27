import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

// TODO: Remplacer par des données réelles
const MOCK_USER = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://picsum.photos/200',
  phone: '+33 6 12 34 56 78',
  address: '123 rue de la Paix, 75001 Paris',
};

const MENU_ITEMS = [
  {
    id: 'orders',
    title: 'Mes commandes',
    icon: 'shopping-bag',
    route: 'Orders',
  },
  {
    id: 'favorites',
    title: 'Mes favoris',
    icon: 'favorite',
    route: 'Favorites',
  },
  {
    id: 'addresses',
    title: 'Mes adresses',
    icon: 'location-on',
    route: 'Addresses',
  },
  {
    id: 'payment',
    title: 'Moyens de paiement',
    icon: 'credit-card',
    route: 'Payment',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'notifications',
    route: 'Notifications',
  },
  {
    id: 'settings',
    title: 'Paramètres',
    icon: 'settings',
    route: 'Settings',
  },
  {
    id: 'help',
    title: 'Aide',
    icon: 'help',
    route: 'Help',
  },
];

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { isDarkMode, favorites, logout } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  const handleMenuItemPress = useCallback((route: keyof RootStackParamList) => {
    navigation.navigate(route);
  }, [navigation]);

  const handleEditProfile = useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [logout]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.header}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: MOCK_USER.avatar }}
              style={styles.avatar}
            />
            <TouchableOpacity
              onPress={handleEditProfile}
              style={[
                styles.editButton,
                { backgroundColor: theme.primary },
              ]}
            >
              <MaterialIcons
                name="edit"
                size={20}
                color={theme.white}
              />
            </TouchableOpacity>
          </View>

          <Animated.Text
            style={[styles.name, { color: theme.text.primary }]}
          >
            {MOCK_USER.name}
          </Animated.Text>

          <Animated.Text
            style={[styles.email, { color: theme.text.secondary }]}
          >
            {MOCK_USER.email}
          </Animated.Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Animated.Text
                style={[styles.statValue, { color: theme.text.primary }]}
              >
                0
              </Animated.Text>
              <Animated.Text
                style={[styles.statLabel, { color: theme.text.secondary }]}
              >
                Commandes
              </Animated.Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Animated.Text
                style={[styles.statValue, { color: theme.text.primary }]}
              >
                {favorites.length}
              </Animated.Text>
              <Animated.Text
                style={[styles.statLabel, { color: theme.text.secondary }]}
              >
                Favoris
              </Animated.Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(300).delay(200)}
          style={styles.menuContainer}
        >
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleMenuItemPress(item.route as keyof RootStackParamList)}
              style={[
                styles.menuItem,
                { borderBottomColor: theme.border },
                index === MENU_ITEMS.length - 1 && styles.lastMenuItem,
              ]}
            >
              <View style={styles.menuItemLeft}>
                <MaterialIcons
                  name={item.icon as any}
                  size={24}
                  color={theme.primary}
                  style={styles.menuItemIcon}
                />
                <Animated.Text
                  style={[styles.menuItemTitle, { color: theme.text.primary }]}
                >
                  {item.title}
                </Animated.Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={theme.text.secondary}
              />
            </TouchableOpacity>
          ))}
        </Animated.View>

        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.logoutButton, { backgroundColor: theme.danger }]}
        >
          <MaterialIcons
            name="logout"
            size={24}
            color={theme.white}
            style={styles.logoutIcon}
          />
          <Animated.Text
            style={[styles.logoutText, { color: theme.white }]}
          >
            Se déconnecter
          </Animated.Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  name: {
    ...typography.h4,
    marginBottom: 4,
  },
  email: {
    ...typography.body1,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'inherit',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h4,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
  },
  statDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  menuContainer: {
    backgroundColor: 'inherit',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: 16,
  },
  menuItemTitle: {
    ...typography.subtitle1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    ...typography.button,
    fontWeight: 'bold',
  },
}); 