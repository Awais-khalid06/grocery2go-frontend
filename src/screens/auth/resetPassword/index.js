import {View} from 'react-native';
import React, {useState} from 'react';
import FruitsColorBackgroundWrapper from '../common/fruitsColorBackgroundWrapper';
import {AppButton, AppScrollView, AppText, AppTextInput, Header, Loader, Screen} from '../../../components';
import {signUpStyles} from '../styles';
import {FONTS} from '../../../utils/theme';
import globalStyles from '../../../../globalStyles';
import {ROUTES} from '../../../utils/constants';
import {getDeviceIdAndFCM, hp, onAPIError} from '../../../helpers';
import {EyeClosedIcon} from '../../../assets/icons';
import {resetPasswordValidations} from '../../../utils/validations';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';

const ResetPassword = ({navigation, route}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const paramEmail = route.params?.email;
  const paramOTP = route.params?.otp;

  const handleContinue = async () => {
    const data = {password, confirmPassword, email: paramEmail, otp: paramOTP, device: await getDeviceIdAndFCM()};
    const isValidate = resetPasswordValidations(data);
    if (!isValidate) return;

    resetPasswordAPI(data);
  };

  const resetPasswordAPI = data => {
    const onSuccess = response => {
      if (response.success) {
        navigation.popToTop();
      }
    };
    callApi(API_METHODS.PATCH, API.resetPassword, data, onSuccess, onAPIError, setIsLoading);
  };

  return (
    <FruitsColorBackgroundWrapper>
      <Screen>
        <Header />
        <Loader isLoading={isLoading} />
        <AppScrollView>
          <View style={[signUpStyles.headText, {marginTop: hp(24)}]}>
            <AppText fontFamily={FONTS.medium} fontSize={18}>
              Reset Password
            </AppText>
            <AppText greyText fontSize={12}>
              Your password must be different from previous password.
            </AppText>
          </View>

          <View style={[globalStyles.inputsGap, signUpStyles.inputsContainer]}>
            <AppTextInput placeholder="Password" isPasswordEye={true} onChangeText={setPassword} />
            <AppTextInput placeholder="Retype Password" isPasswordEye={true} onChangeText={setConfirmPassword} />
          </View>

          <AppButton title={'Continue'} onPress={handleContinue} containerStyle={{marginTop: 65}} />
        </AppScrollView>
      </Screen>
    </FruitsColorBackgroundWrapper>
  );
};

export default ResetPassword;
