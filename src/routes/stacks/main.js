import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES, STACKS} from '../../utils/constants';
import {AddList, DriverMyOrders, Home, List, OrderTracking, ShopMyOrders, ShopOwnerProducts, Settings} from '../../screens/main';
import Lists from '../../screens/main/lists';

const Stack = createNativeStackNavigator();
const screenOptions = {
  headerShown: false,
};

// EACH TAB HAS INDIVIDUAL STACK

export const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName={ROUTES.Home} screenOptions={screenOptions}>
      <Stack.Screen name={ROUTES.Home} component={Home} />
    </Stack.Navigator>
  );
};

export const BuyStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={ROUTES.Home} component={Home} />
    </Stack.Navigator>
  );
};

export const ClipboardStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={ROUTES.Lists} component={Lists} />
      <Stack.Screen name={ROUTES.AddList} component={AddList} />
      <Stack.Screen name={ROUTES.List} component={List} />
    </Stack.Navigator>
  );
};

export const OrdersStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={ROUTES.OrderTracking} component={OrderTracking} />
    </Stack.Navigator>
  );
};
export const GroceryOwnerOrdersStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={ROUTES.ShopMyOrders} component={ShopMyOrders} />
    </Stack.Navigator>
  );
};

export const DriverOrdersStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={ROUTES.DriverMyOrders} component={DriverMyOrders} />
    </Stack.Navigator>
  );
};
export const ProductsStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={ROUTES.ShopOwnerProducts} component={ShopOwnerProducts} />
    </Stack.Navigator>
  );
};

export const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={ROUTES.Settings} component={Settings} />
    </Stack.Navigator>
  );
};
