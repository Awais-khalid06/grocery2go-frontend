import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {NavigationTheme} from '../utils/theme';
import {ROUTES, STACKS} from '../utils/constants';
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

const Stack = createNativeStackNavigator();
const screenOptions = {
  headerShown: false,
};

const Routes = () => {
  return (
    <NavigationContainer theme={NavigationTheme}>
      <Stack.Navigator initialRouteName={STACKS.Auth} screenOptions={screenOptions}>
        {/* WITHOUT BOTTOM TAB SCREENS */}
        <Stack.Screen name={STACKS.Auth} component={AuthStack} />
        <Stack.Screen name={ROUTES.ShopDetails} component={ShopDetails} />
        <Stack.Screen name={ROUTES.ProductDetail} component={ProductDetail} />
        <Stack.Screen name={ROUTES.Shops} component={Shops} />
        <Stack.Screen name={ROUTES.Favorite} component={Favorite} />
        <Stack.Screen name={ROUTES.Groceries} component={Groceries} />
        <Stack.Screen name={ROUTES.MyCart} component={MyCart} />
        <Stack.Screen name={ROUTES.EditAddress} component={EditAddress} />
        <Stack.Screen name={ROUTES.SetLocationOnMap} component={SetLocationOnMap} />
        <Stack.Screen name={ROUTES.Checkout} component={Checkout} />
        <Stack.Screen name={ROUTES.OrderAccepted} component={OrderAccepted} />
        <Stack.Screen name={ROUTES.Riders} component={Riders} />
        <Stack.Screen name={ROUTES.RiderDetails} component={RiderDetails} />
        <Stack.Screen name={ROUTES.OrderDetails} component={OrderDetails} />
        <Stack.Screen name={ROUTES.OrderTrack} component={OrderTrack} />
        <Stack.Screen name={ROUTES.AddFeedback} component={AddFeedback} />
        <Stack.Screen name={ROUTES.AddTip} component={AddTip} />
        <Stack.Screen name={ROUTES.Notification} component={Notification} />
        <Stack.Screen name={ROUTES.EditProfile} component={EditProfile} />
        <Stack.Screen name={ROUTES.NotificationSetting} component={NotificationSetting} />
        <Stack.Screen name={ROUTES.ChangePassword} component={ChangePassword} />
        <Stack.Screen name={ROUTES.DeleteAccount} component={DeleteAccount} />
        <Stack.Screen name={ROUTES.PrivacyPolicy} component={PrivacyPolicy} />
        <Stack.Screen name={ROUTES.TermsOfService} component={TermsOfService} />
        <Stack.Screen name={ROUTES.HelpCenter} component={HelpCenter} />
        <Stack.Screen name={ROUTES.ShopNewOrders} component={ShopNewOrders} />
        <Stack.Screen name={ROUTES.DriverNewOrders} component={DriverNewOrders} />
        <Stack.Screen name={ROUTES.CompletedOrders} component={CompletedOrders} />
        <Stack.Screen name={ROUTES.TotalEarnings} component={TotalEarnings} />
        <Stack.Screen name={ROUTES.AddProduct} component={AddProduct} />
        <Stack.Screen name={ROUTES.ManageStock} component={ManageStock} />
        <Stack.Screen name={ROUTES.BankDetail} component={BankDetail} />
        <Stack.Screen name={ROUTES.DriverListOrderDetail} component={DriverListOrderDetail} />
        <Stack.Screen name={ROUTES.UserListOrderDetail} component={UserListOrderDetail} />
        <Stack.Screen name={ROUTES.MyWallet} component={MyWallet} />
        <Stack.Screen name={ROUTES.ChatInbox} component={ChatInbox} />
        <Stack.Screen name={ROUTES.MapNavigete} component={MapNavigete} />
        <Stack.Screen name={ROUTES.ChatRoom} component={ChatRoom} />
        {/* WITH BOTTOM TAB SCREENS PLEASE ADD IT IN BOTTOMTAB STACK */}
        <Stack.Screen name={STACKS.Main} component={BottomTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
