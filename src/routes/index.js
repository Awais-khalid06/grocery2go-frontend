import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationTheme } from '../utils/theme';
import { ROUTES, STACKS } from '../utils/constants';
import AuthStack from './stacks/auth';
import BottomTab from './bottomTab';
import {
  AddFeedback,
  AddProduct,
  AddTip,
  BankDetail,
  ChangePassword,
  Checkout,
  CompletedOrders,
  DeleteAccount,
  EditAddress,
  Favorite,
  Groceries,
  HelpCenter,
  DriverListOrderDetail,
  ManageStock,
  MyCart,
  Notification,
  NotificationSetting,
  OrderHistory,
  OrderAccepted,
  OrderDetails,
  OrderTrack,
  PrivacyPolicy,
  ProductDetail,
  RiderDetails,
  Riders,
  SetLocationOnMap,
  ShopDetails,
  Shops,
  TermsOfService,
  TotalEarnings,
  ShopNewOrders,
  DriverNewOrders,
  MyWallet,
  ChatInbox,
  ChatRoom,
  UserListOrderDetail,
  MapNavigete,
} from '../screens/main';

import EditProfile from '../screens/main/settings/editProfile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { wp } from '../helpers';

const Stack = createNativeStackNavigator();
const screenOptions = {
  headerShown: false,
};

const Routes = () => {
  const insets = useSafeAreaInsets();

  const paddedContentStyle = useMemo(() => ({
    backgroundColor: 'white',
    paddingBottom: insets.bottom > 0 ? insets.bottom : wp(5),
  }), [insets.bottom]);

  return (
    <NavigationContainer theme={NavigationTheme}>
      <Stack.Navigator initialRouteName={STACKS.Auth} screenOptions={screenOptions}>
        {/* WITHOUT BOTTOM TAB SCREENS */}
        <Stack.Screen name={STACKS.Auth} component={AuthStack} />
        <Stack.Screen name={ROUTES.ShopDetails} component={ShopDetails} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.ProductDetail} component={ProductDetail} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.Shops} component={Shops} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.Favorite} component={Favorite} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.Groceries} component={Groceries} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.MyCart} component={MyCart} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.EditAddress} component={EditAddress} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.SetLocationOnMap} component={SetLocationOnMap} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.Checkout} component={Checkout} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.OrderAccepted} component={OrderAccepted} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.Riders} component={Riders} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.RiderDetails} component={RiderDetails} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.OrderDetails} component={OrderDetails} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.OrderTrack} component={OrderTrack} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.AddFeedback} component={AddFeedback} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.AddTip} component={AddTip} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.Notification} component={Notification} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.EditProfile} component={EditProfile} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.NotificationSetting} component={NotificationSetting} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.ChangePassword} component={ChangePassword} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.DeleteAccount} component={DeleteAccount} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.PrivacyPolicy} component={PrivacyPolicy} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.TermsOfService} component={TermsOfService} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.HelpCenter} component={HelpCenter} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.OrderHistory} component={OrderHistory} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.ShopNewOrders} component={ShopNewOrders} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.DriverNewOrders} component={DriverNewOrders} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.CompletedOrders} component={CompletedOrders} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.TotalEarnings} component={TotalEarnings} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.AddProduct} component={AddProduct} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.ManageStock} component={ManageStock} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.BankDetail} component={BankDetail} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.DriverListOrderDetail} component={DriverListOrderDetail} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.UserListOrderDetail} component={UserListOrderDetail} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.MyWallet} component={MyWallet} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.ChatInbox} component={ChatInbox} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.MapNavigete} component={MapNavigete} options={{ contentStyle: paddedContentStyle }} />
        <Stack.Screen name={ROUTES.ChatRoom} component={ChatRoom} options={{ contentStyle: paddedContentStyle }} />
        {/* WITH BOTTOM TAB SCREENS PLEASE ADD IT IN BOTTOMTAB STACK */}
        <Stack.Screen name={STACKS.Main} component={BottomTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
