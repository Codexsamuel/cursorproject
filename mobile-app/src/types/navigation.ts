import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: {
    token: string;
  };
  HomeScreen: undefined;
  ProductDetails: {
    productId: string;
  };
  CartScreen: undefined;
  ProfileScreen: undefined;
  Orders: undefined;
  OrderDetails: {
    orderId: string;
  };
  Home: undefined;
};

export type AuthStackParamList = Pick<
  RootStackParamList,
  'Login' | 'Register' | 'ForgotPassword' | 'ResetPassword'
>;

export type HomeStackParamList = Pick<
  RootStackParamList,
  'HomeScreen' | 'ProductDetails' | 'Home'
>;

export type CartStackParamList = Pick<
  RootStackParamList,
  'CartScreen' | 'Home'
>;

export type ProfileStackParamList = Pick<
  RootStackParamList,
  'ProfileScreen' | 'Orders' | 'OrderDetails' | 'Login'
>;

export type TabParamList = {
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;
export type CartNavigationProp = NativeStackNavigationProp<CartStackParamList>;
export type ProfileNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;
export type TabNavigationProp = NativeStackNavigationProp<TabParamList>; 