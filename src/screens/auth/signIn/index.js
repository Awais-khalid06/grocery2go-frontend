import {KeyboardAvoidingView, Platform, Pressable, View} from 'react-native';
import React, {useState} from 'react';
import FruitsColorBackgroundWrapper from '../common/fruitsColorBackgroundWrapper';
import {AppButton, AppScrollView, AppText, AppTextInput, Header, Loader, Screen} from '../../../components';
import {signUpStyles} from '../styles';
import {FONTS} from '../../../utils/theme';
import globalStyles from '../../../../globalStyles';
import {AppleCircleIcon, UnCheckSquareIcon, GoogleCircleIcon, CheckSquareIcon} from '../../../assets/icons';
import {ROUTES, STACKS} from '../../../utils/constants';
import {authStateUpdateInRedux, getDeviceIdAndFCM, hp, onAPIError} from '../../../helpers';
import {useDispatch, useSelector} from 'react-redux';
import {siginValidations} from '../../../utils/validations';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {isRememberMeSelector, rememberedCredentialsSelector} from '../../../redux/selectors';
import {authActions} from '../../../redux/slices/auth';
import {useAccountType} from '../../../hooks';
import useSocialLogin from '../../../hooks/useSocialLogin';

const SignIn = ({navigation}) => {
  const {isDriver, isGroceryOwner} = useAccountType();
  const {isSocialLoading, googleLogin} = useSocialLogin();
  const dispatch = useDispatch();
  const isRememberMe = useSelector(isRememberMeSelector);
  const rememberedCredentials = useSelector(rememberedCredentialsSelector);
  const rememberedEmail = rememberedCredentials?.email || '';
  const rememberedPassword = rememberedCredentials?.password || '';

  const [email, setEmail] = useState(rememberedEmail);
  const [password, setPassword] = useState(rememberedPassword);
  const [isLoading, setIsLoading] = useState(false);
  const formatedEmail = email.toLowerCase().trim();

  const handleSignIn = () => {
    const data = {email: formatedEmail, password};
    const isValidate = siginValidations(data);
    if (!isValidate) return;

    let userType = 'Customer';
    if (isDriver) userType = 'Rider';
    else if (isGroceryOwner) userType = 'Owner';
    data.userType = userType;

    signInApi(data);
  };

  const signInApi = async data => {
    const formatedData = {...data, device: await getDeviceIdAndFCM()};

    const onSuccess = response => {
      console.log('Login Response: ', response);
      if (response.success) {
        if (isRememberMe) dispatch(authActions.setRememberedCredentials({email: data.email, password: data.password}));

        authStateUpdateInRedux({dispatch, token: response.data.token, refreshToken: response.data.refreshToken, user: response.data.user});

        if (response.act === 'login-granted' || response.act === 'Customer-profile-setup-pending') {
          return navigation.replace(STACKS.Main);
        }

        if (response.act === 'Owner-profile-setup-pending' || response.act === 'Rider-profile-setup-pending') {
          return navigation.navigate(ROUTES.CompleteProfile);
        }

        if (response.act === 'Owner-bankAccount-setup-pending' || response.act == 'Rider-bankAccount-setup-pending') {
          return navigation.replace(ROUTES.AddBank);
        }
      }
    };

    const onError = error => {
      if (error.errorType === 'email-not-verified') {
        navigation.navigate(ROUTES.Verification, {email: data.email, prevScreen: 'SIGNIN'});
      }
    };

    callApi(API_METHODS.POST, API.signIn, formatedData, onSuccess, onError, setIsLoading);
  };

  const handleRememberMe = () => {
    dispatch(authActions.setIsRememberMe(!isRememberMe));
  };

  return (
    <FruitsColorBackgroundWrapper>
      <Loader isLoading={isLoading || isSocialLoading} />
      <Screen>
        <KeyboardAvoidingView style={globalStyles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Header />
          <AppScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            extraScrollHeight={40}
            contentContainerStyle={globalStyles.screenPaddingBottom10}>
            <View style={[signUpStyles.headText, {marginTop: hp(24)}]}>
              <AppText fontFamily={FONTS.medium} fontSize={18}>
                Sign In
              </AppText>
              <AppText fontSize={12}>Sign In your account</AppText>
            </View>
            <View style={[globalStyles.inputsGap, signUpStyles.inputsContainer]}>
              <AppTextInput placeholder="Email Address" onChangeText={setEmail} value={email} />
              <AppTextInput placeholder="Password" onChangeText={setPassword} value={password} isPasswordEye={true} />
              <View style={signUpStyles.rememberContainer}>
                <Pressable onPress={handleRememberMe} style={signUpStyles.checkContainer}>
                  {isRememberMe ? <CheckSquareIcon width={20} height={20} /> : <UnCheckSquareIcon width={20} height={20} />}

                  <AppText greyText>Remember Me</AppText>
                </Pressable>
                <AppText greyText onPress={() => navigation.navigate(ROUTES.ForgotPassword)}>
                  Forgot Password?
                </AppText>
              </View>
            </View>

            <AppButton title={'Sign In'} containerStyle={{marginTop: 30}} onPress={handleSignIn} />
            <View style={globalStyles.flex1} />
            <View style={signUpStyles.buttonContainer}>
              <AppText greyText>
                Don’t have an account?{' '}
                <AppText primary fontFamily={FONTS.semiBold} onPress={() => navigation.navigate(ROUTES.SignUp)}>
                  Sign Up
                </AppText>
              </AppText>
            </View>

            <View style={signUpStyles.bottomContent}>
              <AppText fontSize={12} greyText>
                Or sign in with
              </AppText>

              <View style={signUpStyles.socialIcons}>
                <Pressable onPress={googleLogin}>
                  <GoogleCircleIcon />
                </Pressable>
                {Platform.OS === 'ios' && <AppleCircleIcon />}
              </View>
            </View>
          </AppScrollView>
        </KeyboardAvoidingView>
      </Screen>
    </FruitsColorBackgroundWrapper>
  );
};

export default SignIn;
