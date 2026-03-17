import {View} from 'react-native';
import React, {useState} from 'react';
import {AppText, Header, Screen} from '../../../components';
import ToggleSwitch from 'toggle-switch-react-native';
import {settingsStyles} from '../styles';
import globalStyles from '../../../../globalStyles';
import {COLORS, FONTS} from '../../../utils/theme';
import commonAPI from '../../../network/commonAPI';
import {useDispatch, useSelector} from 'react-redux';
import {userSelector} from '../../../redux/selectors';
import {authActions} from '../../../redux/slices/auth';

const NotificationSetting = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const [notifications, setNotifications] = useState({
    push: user?.isNotification,
    chat: user?.isChatNotification,
    email: user?.isEmailNotification,
  });

  const handleUpdateToggler = async (value, type) => {
    setNotifications({...notifications, [type]: value});

    const data = {};
    if (type == 'push') data.isNotification = value;
    else if (type === 'chat') data.isChatNotification = value;
    else if (type === 'email') data.isEmailNotification = value;

    const response = await commonAPI.updateUserProfile(data);
    if (response.success && response?.data.user) dispatch(authActions.setUser(response?.data.user));
  };

  return (
    <Screen>
      <Header title={'Notification Setting'} />
      <View style={[globalStyles.screenPadding, globalStyles.inputsGap]}>
        <View style={settingsStyles.notificationItemContainer}>
          <View style={{gap: 5}}>
            <AppText fontFamily={FONTS.medium}>Push Notification</AppText>
            <AppText fontSize={12} greyText>
              Receive weekly push notifications
            </AppText>
          </View>
          <ToggleSwitch offColor={COLORS.grey1} isOn={notifications.push} size="small" onToggle={isOn => handleUpdateToggler(isOn, 'push')} />
        </View>
        <View style={settingsStyles.notificationItemContainer}>
          <View style={{gap: 5}}>
            <AppText fontFamily={FONTS.medium}>Chat Notification</AppText>
            <AppText fontSize={12} greyText>
              Receive chat notifications
            </AppText>
          </View>
          <ToggleSwitch offColor={COLORS.grey1} isOn={notifications.chat} size="small" onToggle={isOn => handleUpdateToggler(isOn, 'chat')} />
        </View>
        <View style={settingsStyles.notificationItemContainer}>
          <View style={{gap: 5}}>
            <AppText fontFamily={FONTS.medium}>Email Notification</AppText>
            <AppText fontSize={12} greyText>
              Receive email notifications
            </AppText>
          </View>
          <ToggleSwitch offColor={COLORS.grey1} isOn={notifications.email} size="small" onToggle={isOn => handleUpdateToggler(isOn, 'email')} />
        </View>
      </View>
    </Screen>
  );
};

export default NotificationSetting;
