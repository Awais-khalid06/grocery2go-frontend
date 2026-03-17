import {View} from 'react-native';
import React, {useState} from 'react';
import FruitsColorBackgroundWrapper from '../common/fruitsColorBackgroundWrapper';
import {AppButton, AppScrollView, AppText, Header, Loader, Screen} from '../../../components';
import {otpVerifyStyles, signUpStyles} from '../styles';
import {COLORS, FONTS} from '../../../utils/theme';
import globalStyles from '../../../../globalStyles';
import OTPTextInput from 'react-native-otp-textinput';
import {ROUTES, STACKS} from '../../../utils/constants';
import {authStateUpdateInRedux, hp, onAPIError} from '../../../helpers';
import commonAPI from '../../../network/commonAPI';
import {useDispatch} from 'react-redux';
import {otpValidations} from '../../../utils/validations';
import {API} from '../../../network/Environment';
import {useAccountType} from '../../../hooks';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {authActions} from '../../../redux/slices/auth';
import {CommonActions} from '@react-navigation/native';

const Verification = ({navigation, route}) => {
  const {isCustomer, isDriver, isGroceryOwner} = useAccountType();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isPrevScreenDeleteAccount = route.params?.prevScreen === 'DELETE_ACCOUNT';
  const isPrevScreenSignUp = route.params?.prevScreen === 'SIGNUP';
  const isPrevScreenSignIn = route.params?.prevScreen === 'SIGNIN';
  const isPrevScreenForgotPassword = route.params?.prevScreen === 'FORGOT_PASSWORD';
  const paramEmail = route.params?.email;

  const handleContinue = async () => {
    if (isPrevScreenDeleteAccount) {
      deleteAccountVerifyAndLogout();
      return;
    }

    if (isPrevScreenSignUp || isPrevScreenForgotPassword || isPrevScreenSignIn) {
      const data = {email: paramEmail, otp};
      const isValidate = otpValidations(data);
      if (!isValidate) return;

      let apiEndPoint = API.verifyOTP;
      if (isPrevScreenForgotPassword) apiEndPoint = API.verifyOTPResetPassword;

      setIsLoading(true);
      const response = await commonAPI.verifyOTP(data, apiEndPoint);
      setIsLoading(false);

      if (response.success) {
        console.log('OTP VERIFIED: ', response);

        authStateUpdateInRedux({dispatch, token: response?.data?.token, refreshToken: response?.data?.refreshToken, user: response?.data?.user});

        if (isPrevScreenSignIn) {
          if (response.act === 'login-granted') return navigation.replace(STACKS.Main);
          if (response.act === 'Owner-profile-setup-pending' || response.act === 'Rider-profile-setup-pending') return navigation.navigate(ROUTES.CompleteProfile);
        }

        if (isPrevScreenSignUp) {
          if (isCustomer) return navigation.replace(STACKS.Main);
          if (isDriver || isGroceryOwner) return navigation.navigate(ROUTES.CompleteProfile);
        }

        if (isPrevScreenForgotPassword) {
          return navigation.navigate(ROUTES.ResetPassword, {email: paramEmail, otp});
        }
      }
    }
  };

  const deleteAccountVerifyAndLogout = () => {
    const onSuccess = response => {
      // console.log('Delete Res:', response);
      dispatch(authActions.setUser(null));
      dispatch(authActions.setRefreshToken(null));
      dispatch(authActions.setAccessToken(null));
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: STACKS.Auth, state: {routes: [{name: ROUTES.AccountType}]}}],
          }),
        );
      }, 500);
    };

    callApi(API_METHODS.POST, API.deleteAccountOtpVerify, {otp: Number(otp)}, onSuccess, onAPIError, setIsLoading);
  };

  const handleResendCode = () => {
    commonAPI.sendOTP({email: paramEmail});
  };

  const Wrapper = isPrevScreenDeleteAccount ? View : FruitsColorBackgroundWrapper;

  return (
    <Wrapper style={globalStyles.flex1}>
      <Loader isLoading={isLoading} />
      <Screen>
        <Header />
        <AppScrollView>
          <View style={[signUpStyles.headText, {marginTop: isPrevScreenDeleteAccount ? hp(8) : hp(24)}]}>
            <AppText fontFamily={FONTS.medium} fontSize={18}>
              Please Verify Your Email
            </AppText>
            <AppText greyText fontSize={12}>
              For your account security we have just sent an email to {paramEmail} with a 4-digit code. Please copy that code and paste in the below field.
            </AppText>
          </View>
          <View style={[globalStyles.inputsGap]}>
            <OTPTextInput autoFocus tintColor={COLORS.primary} textInputStyle={otpVerifyStyles.otpInput} handleTextChange={setOtp} />
          </View>

          <View style={[otpVerifyStyles.buttonContainer, {marginTop: isPrevScreenDeleteAccount ? 200 : 35}]}>
            <AppText greyText fontSize={12}>
              Didn’t get code? -
              <AppText primary fontSize={12} onPress={handleResendCode}>
                {' '}
                Resend code
              </AppText>
            </AppText>
            <AppButton title={isPrevScreenDeleteAccount ? 'Verify' : 'Continue'} onPress={handleContinue} />
          </View>
        </AppScrollView>
      </Screen>
    </Wrapper>
  );
};

export default Verification;
