import {ScrollView, View} from 'react-native';
import React, {useState} from 'react';
import {AppButton, AppText, AppTextInput, Header, Loader, Screen} from '../../../components';
import {EyeClosedIcon} from '../../../assets/icons';
import {ROUTES, STACKS} from '../../../utils/constants';
import {deleteAccountStyles, mainCommonStyles} from '../styles';
import globalStyles from '../../../../globalStyles';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';

const DeleteAccount = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = () => {
    const onSuccess = response => {
      // console.log('RES:', response);
      navigation.navigate(STACKS.Auth, {screen: ROUTES.Verification, params: {prevScreen: 'DELETE_ACCOUNT'}});
    };

    callApi(API_METHODS.POST, API.deleteAccountSendOtp, {password}, onSuccess, onAPIError, setIsLoading);
  };

  return (
    <Screen>
      <Header title={'Delete Account'} />
      <Loader isLoading={isLoading} />
      <ScrollView contentContainerStyle={[globalStyles.screenPadding, globalStyles.flexGrow1, globalStyles.screenPaddingBottom10]} showsVerticalScrollIndicator={false}>
        <View style={[globalStyles.flexRowItemCenter]}>
          <AppText style={deleteAccountStyles.deleteAccountText}>{'Delete your account will'}:</AppText>
        </View>

        <View style={{marginTop: 20, ...globalStyles.flexGrow1}}>
          <AppText style={mainCommonStyles.paragraphText}>
            We're sorry to see you go. If you're sure you want to delete your GROCERY2GO App account, please be aware that this action is permanent and cannot be undone. All of your personal
            information, including your information and settings, will be permanently deleted.
          </AppText>

          <AppText style={[mainCommonStyles.paragraphText, {marginTop: 10}]}>
            If you're having trouble with your account or have concerns, please reach out to us at [contact email or support page] before proceeding with the account deletion. We'd love to help you
            resolve any issues and keep you as a valued GROCERY2GO App user.
          </AppText>

          <AppText style={deleteAccountStyles.inputLabel}>{'Password'}</AppText>
          <AppTextInput placeholder="*******" isPasswordEye={true} onChangeText={setPassword} />

          <AppText style={[mainCommonStyles.paragraphText, {marginTop: 20}]} isGreyText>
            {'To delete your account, please enter your password in the field below and confirm your decision by clicking the "Delete My Account" button'}
          </AppText>
        </View>

        <View style={globalStyles.screenPaddingBottom10}>
          <AppButton title={'Delete Account'} onPress={handleDeleteAccount} disabled={!password} />
        </View>
      </ScrollView>
    </Screen>
  );
};

export default DeleteAccount;
