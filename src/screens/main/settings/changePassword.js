import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {AppButton, AppScrollView, AppText, AppTextInput, Header, Loader, Screen, ShowMessage} from '../../../components';
import {EyeClosedIcon} from '../../../assets/icons';
import globalStyles from '../../../../globalStyles';
import {FONTS} from '../../../utils/theme';
import {changePasswordValidations} from '../../../utils/validations';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {authStateUpdateInRedux, getDeviceIdAndFCM, onAPIError} from '../../../helpers';
import {useDispatch} from 'react-redux';
import {STACKS} from '../../../utils/constants';

const ChangePassword = ({navigation}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveChanges = async () => {
    const data = {newPassword, confirmPassword, currentPassword};
    const isValidate = changePasswordValidations(data);
    if (!isValidate) return;

    const onSuccess = response => {
      if (response.success) {
        authStateUpdateInRedux({token: null, refreshToken: null, user: null, dispatch});

        setTimeout(() => {
          ShowMessage('You need to login again');
          navigation.replace(STACKS.Auth);
        }, 200);
      }
    };

    const formatedData = {currentPassword, password: newPassword, confirmPassword, device: await getDeviceIdAndFCM()};
    callApi(API_METHODS.PATCH, API.updatePassword, formatedData, onSuccess, onAPIError, setIsLoading);
  };

  return (
    <Screen>
      <Header title={'Change Password'} />
      <Loader isLoading={isLoading} />
      <AppScrollView>
        <View style={{gap: 5}}>
          <AppText fontFamily={FONTS.medium}>Change Password</AppText>
          <AppText greyText fontSize={12}>
            Your password must be different from previous password.
          </AppText>
        </View>

        <View style={[globalStyles.inputsGap, {marginTop: 30}]}>
          <AppTextInput placeholder="Current Password" isPasswordEye={true} onChangeText={setCurrentPassword} />
          <AppTextInput placeholder="New Password" isPasswordEye={true} onChangeText={setNewPassword} />
          <AppTextInput placeholder="Confirm Password" isPasswordEye={true} onChangeText={setConfirmPassword} />
        </View>

        <AppButton title={'Save Changes'} containerStyle={{marginTop: 50}} onPress={handleSaveChanges} />
      </AppScrollView>
    </Screen>
  );
};

export default ChangePassword;
