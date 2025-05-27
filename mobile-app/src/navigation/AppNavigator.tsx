import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ContactsScreen } from '../screens/crm/ContactsScreen';
import { ContactDetailsScreen } from '../screens/crm/ContactDetailsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/crm';

// TODO: Import other screens as they are created
// import { ContactsScreen } from '../screens/crm/ContactsScreen';
// import { ContactDetailsScreen } from '../screens/crm/ContactDetailsScreen';
// import { SettingsScreen } from '../screens/settings/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Contacts':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          title: 'Contacts',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Paramètres',
        }}
      />
    </Tab.Navigator>
  );
};

// Temporary placeholder screen
const PlaceholderScreen = () => null;

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // TODO: Add a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="ContactDetails" component={ContactDetailsScreen} />
            {/* TODO: Add other stack screens as they are created */}
            {/* <Stack.Screen name="ContactDetails" component={ContactDetailsScreen} /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 