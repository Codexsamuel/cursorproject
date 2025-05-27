import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Category: { categoryId?: string };
  Cart: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  ProductDetails: { productId: string };
  EditProfile: undefined;
  Orders: undefined;
  Favorites: undefined;
  Addresses: undefined;
  Payment: undefined;
  Notifications: undefined;
  Help: undefined;
  Terms: undefined;
  PrivacyPolicy: undefined;
  Licenses: undefined;
  Checkout: undefined;
  OrderDetails: { orderId: string };
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 