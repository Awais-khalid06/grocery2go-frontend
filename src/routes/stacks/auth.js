import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from '../../utils/constants';
import {AccountType, AddBank, CompleteProfile, ForgotPassword, Onboarding, ResetPassword, SignIn, SignUp, Splash, Verification} from '../../screens/auth';

const Stack = createNativeStackNavigator();
const screenOptions = {
  headerShown: false,
};

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName={ROUTES.Splash} screenOptions={screenOptions}>
      <Stack.Screen name={ROUTES.Splash} component={Splash} />
      <Stack.Screen name={ROUTES.Onboarding} component={Onboarding} />
      <Stack.Screen name={ROUTES.AccountType} component={AccountType} />
      <Stack.Screen name={ROUTES.SignIn} component={SignIn} />
      <Stack.Screen name={ROUTES.SignUp} component={SignUp} />
      <Stack.Screen name={ROUTES.ForgotPassword} component={ForgotPassword} />
      <Stack.Screen name={ROUTES.Verification} component={Verification} />
      <Stack.Screen name={ROUTES.ResetPassword} component={ResetPassword} />
      <Stack.Screen name={ROUTES.CompleteProfile} component={CompleteProfile} />
      <Stack.Screen name={ROUTES.AddBank} component={AddBank} />
    </Stack.Navigator>
  );
};

export default AuthStack;
