import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStore } from '../../store/useStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/types';
import Animated, {
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

const SETTINGS_SECTIONS = [
  {
    id: 'appearance',
    title: 'Apparence',
    items: [
      {
        id: 'darkMode',
        title: 'Mode sombre',
        icon: 'dark-mode',
        type: 'switch',
      },
      {
        id: 'language',
        title: 'Langue',
        icon: 'language',
        type: 'select',
        value: 'Français',
      },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    items: [
      {
        id: 'pushNotifications',
        title: 'Notifications push',
        icon: 'notifications',
        type: 'switch',
      },
      {
        id: 'emailNotifications',
        title: 'Notifications par email',
        icon: 'email',
        type: 'switch',
      },
      {
        id: 'marketingNotifications',
        title: 'Notifications marketing',
        icon: 'campaign',
        type: 'switch',
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Confidentialité',
    items: [
      {
        id: 'dataCollection',
        title: 'Collecte de données',
        icon: 'security',
        type: 'switch',
      },
      {
        id: 'locationServices',
        title: 'Services de localisation',
        icon: 'location-on',
        type: 'switch',
      },
    ],
  },
  {
    id: 'about',
    title: 'À propos',
    items: [
      {
        id: 'version',
        title: 'Version',
        icon: 'info',
        type: 'text',
        value: '1.0.0',
      },
      {
        id: 'terms',
        title: 'Conditions d\'utilisation',
        icon: 'description',
        type: 'link',
      },
      {
        id: 'privacyPolicy',
        title: 'Politique de confidentialité',
        icon: 'privacy-tip',
        type: 'link',
      },
      {
        id: 'licenses',
        title: 'Licences',
        icon: 'copyright',
        type: 'link',
      },
    ],
  },
];

export const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { isDarkMode, toggleDarkMode } = useStore();
  const theme = isDarkMode ? colors.dark : colors.light;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Erreur', 'Impossible de se déconnecter');
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: handleLogout,
        },
      ]
    );
  };

  const handleSettingPress = useCallback((settingId: string) => {
    switch (settingId) {
      case 'darkMode':
        toggleDarkMode();
        break;
      case 'terms':
        navigation.navigate('Terms');
        break;
      case 'privacyPolicy':
        navigation.navigate('PrivacyPolicy');
        break;
      case 'licenses':
        navigation.navigate('Licenses');
        break;
      default:
        break;
    }
  }, [toggleDarkMode, navigation]);

  const renderSettingItem = useCallback(({ item }: { item: any }) => {
    const handlePress = () => {
      if (item.type === 'link' || item.type === 'select') {
        handleSettingPress(item.id);
      }
    };

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.settingItem,
          { borderBottomColor: theme.border },
        ]}
      >
        <View style={styles.settingItemLeft}>
          <MaterialIcons
            name={item.icon as any}
            size={24}
            color={theme.primary}
            style={styles.settingItemIcon}
          />
          <Animated.Text
            style={[styles.settingItemTitle, { color: theme.text.primary }]}
          >
            {item.title}
          </Animated.Text>
        </View>

        {item.type === 'switch' && (
          <Switch
            value={item.id === 'darkMode' ? isDarkMode : false}
            onValueChange={() => handleSettingPress(item.id)}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={theme.white}
            ios_backgroundColor={theme.border}
          />
        )}

        {item.type === 'select' && (
          <View style={styles.settingItemRight}>
            <Animated.Text
              style={[styles.settingItemValue, { color: theme.text.secondary }]}
            >
              {item.value}
            </Animated.Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={theme.text.secondary}
            />
          </View>
        )}

        {item.type === 'text' && (
          <Animated.Text
            style={[styles.settingItemValue, { color: theme.text.secondary }]}
          >
            {item.value}
          </Animated.Text>
        )}

        {item.type === 'link' && (
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={theme.text.secondary}
          />
        )}
      </TouchableOpacity>
    );
  }, [isDarkMode, theme, handleSettingPress]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {SETTINGS_SECTIONS.map((section, sectionIndex) => (
          <Animated.View
            key={section.id}
            entering={FadeInDown.duration(300).delay(sectionIndex * 100)}
            style={styles.section}
          >
            <Animated.Text
              style={[styles.sectionTitle, { color: theme.text.secondary }]}
            >
              {section.title}
            </Animated.Text>

            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <Animated.View
                  key={item.id}
                  entering={FadeInDown.duration(300).delay(sectionIndex * 100 + itemIndex * 50)}
                >
                  {renderSettingItem({ item })}
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        ))}
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...typography.subtitle2,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionContent: {
    backgroundColor: 'inherit',
    borderRadius: 12,
    overflow: 'hidden',
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemIcon: {
    marginRight: 16,
  },
  settingItemTitle: {
    ...typography.subtitle1,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemValue: {
    ...typography.body2,
    marginRight: 8,
  },
}); 