import {ActivityIndicator, Image, Pressable, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {AppButton, AppScrollView, AppTextInput, Header, Loader, Screen, ShowMessage} from '../../../components';
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
import {COLORS} from '../../../utils/theme';
import {useFocusEffect} from '@react-navigation/native';

const DEFAULT_PHONE_COUNTRY_CODE = 'PK';
const PHONE_PREFIX_TO_COUNTRY_CODE = {
  '+92': 'PK',
  '+1': 'US',
  '+44': 'GB',
  '+61': 'AU',
  '+971': 'AE',
};
const COUNTRY_CODE_TO_PHONE_PREFIX = {
  PK: '+92',
  US: '+1',
  GB: '+44',
  AU: '+61',
  AE: '+971',
};

const getPhoneInputState = contact => {
  const cleanContact = `${contact || ''}`.trim().replace(/\s+/g, '').replace(/-/g, '');
  if (!cleanContact) {
    return {countryCode: DEFAULT_PHONE_COUNTRY_CODE, localNumber: ''};
  }

  if (cleanContact.startsWith('+')) {
    const matchedPrefix = Object.keys(PHONE_PREFIX_TO_COUNTRY_CODE)
      .sort((a, b) => b.length - a.length)
      .find(prefix => cleanContact.startsWith(prefix));

    if (matchedPrefix) {
      return {
        countryCode: PHONE_PREFIX_TO_COUNTRY_CODE[matchedPrefix],
        localNumber: cleanContact.slice(matchedPrefix.length),
      };
    }

    const numberWithoutPlus = cleanContact.slice(1);
    if (numberWithoutPlus.startsWith('92') && numberWithoutPlus.length > 2) {
      return {countryCode: 'PK', localNumber: numberWithoutPlus.slice(2)};
    }
    return {countryCode: DEFAULT_PHONE_COUNTRY_CODE, localNumber: numberWithoutPlus};
  }

  if (cleanContact.startsWith('92') && cleanContact.length > 10) {
    return {countryCode: 'PK', localNumber: cleanContact.slice(2)};
  }

  return {countryCode: DEFAULT_PHONE_COUNTRY_CODE, localNumber: cleanContact};
};

const getFormattedContactForApi = ({countryCode, localNumber, fallbackContact}) => {
  const normalizedLocalNumber = `${localNumber || ''}`.replace(/\D/g, '');
  const prefix = COUNTRY_CODE_TO_PHONE_PREFIX[countryCode];

  if (normalizedLocalNumber && prefix) {
    const localWithoutLeadingZero = normalizedLocalNumber.replace(/^0+/, '');
    return `${prefix}${localWithoutLeadingZero}`;
  }

  return `${fallbackContact || ''}`.trim();
};

const EditProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const {isCustomer, isGroceryOwner} = useAccountType();
  const userData = useSelector(userSelector) || {};
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(userData);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [phoneInputValue, setPhoneInputValue] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState(DEFAULT_PHONE_COUNTRY_CODE);
  const [phoneInputRenderKey, setPhoneInputRenderKey] = useState(0);
  const [locationText, setLocationText] = useState('');

  const syncFormData = useCallback(user => {
    const latestUser = user || {};
    setData(latestUser);
    setLocationText(latestUser?.location?.address || '');

    const phoneInputState = getPhoneInputState(latestUser?.contact);
    setPhoneCountryCode(phoneInputState.countryCode || DEFAULT_PHONE_COUNTRY_CODE);
    setPhoneInputValue(phoneInputState.localNumber || '');
    setPhoneInputRenderKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    syncFormData(userData);
  }, [userData, syncFormData]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const getMyProfile = async () => {
        const response = await commonAPI.getMyProfile();
        const freshUser = response?.data?.user || response?.data;

        if (!isMounted || !response?.success || !freshUser) return;

        dispatch(authActions.setUser(freshUser));
        syncFormData(freshUser);
      };

      getMyProfile();

      return () => {
        isMounted = false;
      };
    }, [dispatch, syncFormData]),
  );

  const firstName = data.firstName;
  const lastName = data.lastName;
  const email = data.email;
  const profilePicURI = typeof data.image === 'object' ? data.image.uri : data.image;

  const handleSelectImage = async () => {
    const assets = await imagePickerFromGallery();
    if (assets.length > 0) {
      setData(prev => ({...prev, image: assets[0]}));
      setIsImageLoading(false);
    }
  };

  const handleChangeText = (value, type) => {
    setData(prev => ({...prev, [type]: value}));
  };

  const handleSelectLocation = (selectedData, details) => {
    const address = selectedData.description;
    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;

    setLocationText(address);
    setData(prev => ({...prev, location: {address, coordinates: [lng, lat], type: 'Point'}}));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    const formData = {...data};
    const trimmedLocation = locationText?.trim();
    formData.contact = getFormattedContactForApi({
      countryCode: phoneCountryCode,
      localNumber: phoneInputValue,
      fallbackContact: formData.contact,
    });

    try {
      if (typeof formData.image === 'object' && formData.image?.uri) {
        const file = {
          uri: formData.image.uri,
          name: `file${Math.floor(Math.random() * 1034343438347)}`,
          type: formData.image.type,
        };
        formData.image = await uploadImageToS3(file);
      }

      if (isCustomer && trimmedLocation) {
        formData.location = {
          ...(formData.location || {}),
          type: formData?.location?.type || 'Point',
          address: trimmedLocation,
        };
      }

      if (isGroceryOwner) {
        const response = await commonAPI.updateOwnerProfile(formData, dispatch);
        if (response?.success) navigation.goBack();

        return;
      }

      const response = await commonAPI.updateUserProfile(formData, dispatch);

      if (response.success) {
        navigation.goBack();
      }
    } catch (error) {
      ShowMessage(error?.message || 'Unable to upload image. Please try again.');
      console.log('Edit profile save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <Header title={'Edit Profile'} />
      <Loader isLoading={isLoading} />
      <AppScrollView>
        <Pressable onPress={handleSelectImage} style={profileStyles.avatarContainer}>
          {profilePicURI ? (
            <Image
              source={{uri: profilePicURI}}
              style={profileStyles.image}
              onLoadStart={() => setIsImageLoading(true)}
              onLoadEnd={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
          ) : (
            <UserAvatarIcon width={120} height={120} />
          )}
          {profilePicURI && isImageLoading ? (
            <View style={profileStyles.avatarLoaderOverlay}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : null}
          <CameraPrimaryIcon width={25} height={25} style={profileStyles.cameraIcon} />
        </Pressable>

        <View style={[globalStyles.inputsGap, {marginTop: 20}]}>
          <AppTextInput placeholder="Jack" value={firstName} onChangeText={text => handleChangeText(text, 'firstName')} />
          <AppTextInput placeholder="Martin" value={lastName} onChangeText={text => handleChangeText(text, 'lastName')} />
          <AppTextInput placeholder="jackmartin@gmail.com" disabled editable={false} value={email} textInputStyle={{opacity: 0.5}} />
          <RNPhoneInput
            key={`phone-input-${phoneInputRenderKey}`}
            placeholder="(604) 925-7595"
            containerStyle={signUpStyles.phoneInput}
            textInputStyle={signUpStyles.phoneInputTextInput}
            textContainerStyle={signUpStyles.phoneInputTextContainer}
            textInputProps={{placeholderTextColor: '#919191'}}
            codeTextStyle={signUpStyles.phoneInputCodeText}
            defaultCode={phoneCountryCode}
            defaultValue={phoneInputValue}
            layout="second"
            onChangeCountry={country =>
              setPhoneCountryCode(country?.cca2 || DEFAULT_PHONE_COUNTRY_CODE)
            }
            onChangeText={text => setPhoneInputValue(text)}
            onChangeFormattedText={text => handleChangeText(text, 'contact')}
          />
          {/* <AppTextInput placeholder="p-123,london" RightIcon={LocationGrayIcon} /> */}
          {isCustomer && (
            <GooglePlacesInput
              onSelect={handleSelectLocation}
              placeholder="Address"
              textInputProps={{
                value: locationText,
                onChangeText: text => setLocationText(text),
              }}
            />
          )}
        </View>

        <AppButton title={'Save Changes'} containerStyle={{marginTop: 50}} onPress={handleSaveChanges} />
      </AppScrollView>
    </Screen>
  );
};

export default EditProfile;
