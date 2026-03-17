import {View, Text, Image} from 'react-native';
import React, {useState} from 'react';
import {AppButton, AppModal, AppScrollView, AppText, Header, LabelWithRightChevron, Loader, Screen} from '../../../components';
import {orderDetailStyles, settingsStyles} from '../styles';
import {AvatarImage} from '../../../assets/images';
import {EditPencilIcon, LogoutIcon} from '../../../assets/icons';
import {FONTS} from '../../../utils/theme';
import {ROUTES, STACKS} from '../../../utils/constants';
import globalStyles from '../../../../globalStyles';
import {useDispatch, useSelector} from 'react-redux';
import {useAccountType} from '../../../hooks';
import {userSelector} from '../../../redux/selectors';
import {getUserFullName} from '../../../helpers';
import commonAPI from '../../../network/commonAPI';

const Settings = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector) || {};
  const {isGroceryOwner, isDriver} = useAccountType();
  const [isLogoutModalShow, setIsLogoutModalShow] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalShow(false);
    commonAPI.logout(dispatch, navigation);
  };

  const myEmail = user?.email;
  const myImageURI = user?.image;
  const myName = getUserFullName(user?.firstName, user?.lastName);

  return (
    <Screen>
      <Header title={'Settings'} />

      <AppScrollView>
        <View style={settingsStyles.profileContainer}>
          {myImageURI && <Image source={{uri: myImageURI}} style={settingsStyles.profilePic} />}
          <AppText style={settingsStyles.personnameText}>{myName}</AppText>
          <AppText style={settingsStyles.usernameText}>{myEmail}</AppText>
          {/* <View style={[orderDetailStyles.rowElement, {gap: 5, marginTop: 10}]}>
            <EditPencilIcon width={15} height={15} />
            <AppText fontSize={12} fontFamily={FONTS.medium}>
              Edit Profile
            </AppText>
          </View> */}
        </View>

        <View style={{marginTop: 20}}>
          <LabelWithRightChevron title={'Edit Profile'} onPress={() => navigation.navigate(ROUTES.EditProfile)} />
          {isGroceryOwner && <LabelWithRightChevron title={'My Shop'} onPress={() => navigation.navigate(STACKS.Auth, {screen: ROUTES.CompleteProfile, params: {screenType: 'EDIT_PROFILE'}})} />}
          <LabelWithRightChevron title={'Notification'} onPress={() => navigation.navigate(ROUTES.NotificationSetting)} />
          {isDriver && <LabelWithRightChevron title={'Bank Detail'} onPress={() => navigation.navigate(ROUTES.BankDetail)} />}
          <LabelWithRightChevron title={'Change Password'} onPress={() => navigation.navigate(ROUTES.ChangePassword)} />
          <LabelWithRightChevron title={'Privacy Policy'} onPress={() => navigation.navigate(ROUTES.PrivacyPolicy)} />
          <LabelWithRightChevron title={'Terms of Service'} onPress={() => navigation.navigate(ROUTES.TermsOfService)} />
          <LabelWithRightChevron title={'Help Center'} onPress={() => navigation.navigate(ROUTES.HelpCenter)} />
          <LabelWithRightChevron title={'Delete Account'} onPress={() => navigation.navigate(ROUTES.DeleteAccount)} />
          <LabelWithRightChevron isTextPrimary title={'Logout'} renderRightComponent={LogoutIcon} onPress={() => setIsLogoutModalShow(true)} isSeperator={false} />
        </View>
      </AppScrollView>

      {isLogoutModalShow && (
        <AppModal isVisible={isLogoutModalShow} setIsVisible={setIsLogoutModalShow}>
          <View style={globalStyles.modalContainer}>
            <AppText fontFamily={FONTS.medium}>Log out?</AppText>
            <AppText fontSize={12} greyText style={{marginTop: 12, marginBottom: 25}}>
              Are you sure you want to log out?
            </AppText>
            <View style={settingsStyles.logoutButtonContainer}>
              <AppButton title={'Logout'} containerStyle={{width: '40%', height: 35}} onPress={handleLogout} transparentButton={true} />
              <AppButton title={'Cancel'} containerStyle={{width: '40%', height: 35}} onPress={() => setIsLogoutModalShow(false)} />
            </View>
          </View>
        </AppModal>
      )}
    </Screen>
  );
};

export default Settings;
