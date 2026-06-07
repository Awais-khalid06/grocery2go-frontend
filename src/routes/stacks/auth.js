import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../../utils/constants';
import { AccountType, AddBank, CompleteProfile, ForgotPassword, Onboarding, ResetPassword, SignIn, SignUp, Splash, Verification } from '../../screens/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { wp } from '../../helpers';

const Stack = createNativeStackNavigator();
const screenOptions = {
  headerShown: false,
};

const AuthStack = () => {
  const insets = useSafeAreaInsets();
  const paddedContentStyle = useMemo(() => ({
    backgroundColor: 'white',
    paddingBottom: insets.bottom > 0 ? insets.bottom : wp(5),
  }), [insets.bottom]);

  return (
    <Stack.Navigator initialRouteName={ROUTES.Splash} screenOptions={screenOptions}>
      <Stack.Screen name={ROUTES.Splash} component={Splash} />
      <Stack.Screen name={ROUTES.Onboarding} component={Onboarding} />
      <Stack.Screen name={ROUTES.AccountType} component={AccountType} options={{ contentStyle: paddedContentStyle }} />
      <Stack.Screen name={ROUTES.SignIn} component={SignIn} options={{ contentStyle: paddedContentStyle }} />
      <Stack.Screen name={ROUTES.SignUp} component={SignUp} options={{ contentStyle: paddedContentStyle }} />
      <Stack.Screen name={ROUTES.ForgotPassword} component={ForgotPassword} options={{ contentStyle: paddedContentStyle }} />
      <Stack.Screen name={ROUTES.Verification} component={Verification} options={{ contentStyle: paddedContentStyle }} />
      <Stack.Screen name={ROUTES.ResetPassword} component={ResetPassword} options={{ contentStyle: paddedContentStyle }} />
      <Stack.Screen name={ROUTES.CompleteProfile} component={CompleteProfile} options={{ contentStyle: paddedContentStyle }} />
      <Stack.Screen name={ROUTES.AddBank} component={AddBank} options={{ contentStyle: paddedContentStyle }} />
    </Stack.Navigator>
  );
};

export default AuthStack;
