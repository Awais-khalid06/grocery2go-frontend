import {View, Image, Pressable} from 'react-native';
import React, {useState} from 'react';
import {AppButton, AppScrollView, AppTextInput, Header, Loader, Screen} from '../../../components';
import {CameraPrimaryIcon, UserAvatarIcon} from '../../../assets/icons';
import {profileStyles} from '../styles';
import globalStyles from '../../../../globalStyles';
import {signUpStyles} from '../../auth/styles';
import RNPhoneInput from 'react-native-phone-number-input';
import {imagePickerFromGallery, uploadImageToS3} from '../../../helpers';
import commonAPI from '../../../network/commonAPI';
import {useDispatch, useSelector} from 'react-redux';
import {userSelector} from '../../../redux/selectors';
import {authActions} from '../../../redux/slices/auth';
import GooglePlacesInput from '../../../components/googlePlacesInput';
import {useAccountType} from '../../../hooks';

const EditProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const {isCustomer, isDriver, isGroceryOwner} = useAccountType();
  const userData = useSelector(userSelector) || {};
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(userData);

  const firstName = data.firstName;
  const lastName = data.lastName;
  const email = data.email;
  const location = data.location;
  const phoneNumber = data.contact;
  const profilePicURI = typeof data.image === 'object' ? data.image.uri : data.image;

  const handleSelectImage = async () => {
    const assets = await imagePickerFromGallery();
    if (assets.length > 0) setData(prev => ({...prev, image: assets[0]}));
  };

  const handleChangeText = (value, type) => {
    setData(prev => ({...prev, [type]: value}));
  };

  const handleSelectLocation = (data, details) => {
    const address = data.description;
    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;

    setData(prev => ({...prev, location: {address, coordinates: [lng, lat], type: 'Point'}}));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);

    if (typeof data.image === 'object' && data.image?.uri) {
      const file = {
        uri: data.image.uri,
        name: `file${Math.floor(Math.random() * 1034343438347)}`,
        type: data.image.type,
      };
      data.image = await uploadImageToS3(file);
    }

    if (isGroceryOwner) {
      await commonAPI.updateOwnerProfile(data, dispatch);
      setIsLoading(false);
      navigation.goBack();

      return;
    }

    const response = await commonAPI.updateUserProfile(data);
    setIsLoading(false);

    if (response.success) {
      const user = response.data.user;
      if (user) dispatch(authActions.setUser(user));
      navigation.goBack();
    }
  };

  return (
    <Screen>
      <Header title={'Edit Profile'} />
      <Loader isLoading={isLoading} />
      <AppScrollView>
        <Pressable onPress={handleSelectImage} style={profileStyles.avatarContainer}>
          {profilePicURI ? <Image source={{uri: profilePicURI}} style={profileStyles.image} /> : <UserAvatarIcon width={120} height={120} />}
          <CameraPrimaryIcon width={25} height={25} style={profileStyles.cameraIcon} />
        </Pressable>

        <View style={[globalStyles.inputsGap, {marginTop: 20}]}>
          <AppTextInput placeholder="Jack" value={firstName} onChangeText={text => handleChangeText(text, 'firstName')} />
          <AppTextInput placeholder="Martin" value={lastName} onChangeText={text => handleChangeText(text, 'lastName')} />
          <AppTextInput placeholder="jackmartin@gmail.com" disabled editable={false} value={email} textInputStyle={{opacity: 0.5}} />
          <RNPhoneInput
            placeholder="(604) 925-7595"
            containerStyle={signUpStyles.phoneInput}
            textInputStyle={signUpStyles.phoneInputTextInput}
            textContainerStyle={signUpStyles.phoneInputTextContainer}
            textInputProps={{placeholderTextColor: '#919191'}}
            codeTextStyle={signUpStyles.phoneInputCodeText}
            defaultCode="US"
            layout="second"
            onChangeText={text => {}}
            onChangeFormattedText={text => handleChangeText(text, 'contact')}
            value={phoneNumber}
          />
          {/* <AppTextInput placeholder="p-123,london" RightIcon={LocationGrayIcon} /> */}
          {isCustomer && <GooglePlacesInput onSelect={handleSelectLocation} placeholder={location?.address} />}
        </View>

        <AppButton title={'Save Changes'} containerStyle={{marginTop: 50}} onPress={handleSaveChanges} />
      </AppScrollView>
    </Screen>
  );
};

export default EditProfile;
