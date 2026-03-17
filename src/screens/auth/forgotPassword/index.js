import {View} from 'react-native';
import React, {useState} from 'react';
import FruitsColorBackgroundWrapper from '../common/fruitsColorBackgroundWrapper';
import {AppButton, AppScrollView, AppText, AppTextInput, Header, Loader, Screen} from '../../../components';
import {signUpStyles} from '../styles';
import {FONTS} from '../../../utils/theme';
import globalStyles from '../../../../globalStyles';
import {ROUTES} from '../../../utils/constants';
import {hp} from '../../../helpers';
import {forgotPasswordValidations} from '../../../utils/validations';
import commonAPI from '../../../network/commonAPI';

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const formatedEmail = email.toLowerCase().trim();

  const handleContinue = () => {
    const data = {email: formatedEmail};
    const isValidate = forgotPasswordValidations(data);
    if (!isValidate) return;

    forgotPasswordApi(data);
  };

  const forgotPasswordApi = async data => {
    setIsLoading(true);
    const response = await commonAPI.forgotPassword(data.email);
    setIsLoading(false);

    if (response.success) {
      navigation.navigate(ROUTES.Verification, {prevScreen: 'FORGOT_PASSWORD', email: data.email});
    }
  };

  return (
    <FruitsColorBackgroundWrapper>
      <Screen>
        <Loader isLoading={isLoading} />
        <Header />
        <AppScrollView>
          <View style={[signUpStyles.headText, {marginTop: hp(24)}]}>
            <AppText fontFamily={FONTS.medium} fontSize={18}>
              Forgot Password
            </AppText>
            <AppText greyText fontSize={12}>
              Please enter your email address to request a password reset.
            </AppText>
          </View>

          <View style={[globalStyles.inputsGap, signUpStyles.inputsContainer]}>
            <AppTextInput placeholder="Email Address" onChangeText={setEmail} />
          </View>

          <AppButton title={'Continue'} onPress={handleContinue} containerStyle={{marginTop: 125}} />
        </AppScrollView>
      </Screen>
    </FruitsColorBackgroundWrapper>
  );
};

export default ForgotPassword;
