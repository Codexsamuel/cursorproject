import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useStore } from '../store/useStore';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { CartScreen } from '../screens/CartScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';
import { OrderDetailsScreen } from '../screens/OrderDetailsScreen';
import { Ionicons } from '@expo/vector-icons';
import {
  RootStackParamList,
  AuthStackParamList,
  HomeStackParamList,
  CartStackParamList,
  ProfileStackParamList,
  TabParamList,
} from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const CartStack = createNativeStackNavigator<CartStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </AuthStack.Navigator>
);

const HomeNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        title: 'Accueil',
      }}
    />
    <HomeStack.Screen
      name="ProductDetails"
      component={ProductDetailsScreen}
      options={{
        title: 'Détails du produit',
      }}
    />
  </HomeStack.Navigator>
);

const CartNavigator = () => (
  <CartStack.Navigator>
    <CartStack.Screen
      name="CartScreen"
      component={CartScreen}
      options={{
        title: 'Panier',
      }}
    />
  </CartStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{
        title: 'Profil',
      }}
    />
    <ProfileStack.Screen
      name="Orders"
      component={OrdersScreen}
      options={{
        title: 'Mes commandes',
      }}
    />
    <ProfileStack.Screen
      name="OrderDetails"
      component={OrderDetailsScreen}
      options={{
        title: 'Détails de la commande',
      }}
    />
  </ProfileStack.Navigator>
);

const TabNavigator = () => {
  const { theme } = useStore(state => ({
    theme: state.theme,
  }));

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          title: 'Accueil',
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartNavigator}
        options={{
          title: 'Panier',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          title: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { user } = useStore(state => ({
    user: state.user,
  }));

  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}; 