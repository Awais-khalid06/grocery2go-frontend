import {View, Pressable, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import FruitsColorBackgroundWrapper from '../common/fruitsColorBackgroundWrapper';
import {AppButton, AppScrollView, AppText, AppTextInput, Header, Loader, Screen} from '../../../components';
import {signUpStyles} from '../styles';
import {FONTS} from '../../../utils/theme';
import {CameraPrimaryIcon, ChevronIcon, UserAvatarIcon} from '../../../assets/icons';
import {getFormattedTime, imagePickerFromGallery, onAPIError, uploadImageToS3} from '../../../helpers';
import globalStyles from '../../../../globalStyles';
import {productStyles, profileStyles} from '../../main/styles';
import DatePicker from 'react-native-date-picker';
import {ROUTES, STACKS, STRIPE_COUNTRIES} from '../../../utils/constants';
import {useAccountType} from '../../../hooks';
import {driverCompleteProfileValidations, ownerCompleteProfileValidations} from '../../../utils/validations';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {useDispatch, useSelector} from 'react-redux';
import {authActions} from '../../../redux/slices/auth';
import GooglePlacesInput from '../../../components/googlePlacesInput';
import {userSelector} from '../../../redux/selectors';
import DropDownPicker from 'react-native-dropdown-picker';

const CompleteProfile = ({navigation, route}) => {
  const dispatch = useDispatch();
  const isEditMode = route.params?.screenType === 'EDIT_PROFILE';
  const {isDriver, isGroceryOwner} = useAccountType();
  const user = useSelector(userSelector) || {};
  const [image, setImage] = useState(null);
  const [isOpeningTimeModalShow, setIsOpeningTimeModalShow] = useState(false);
  const [isClosingTimeModalShow, setIsClosingTimeModalShow] = useState(false);
  const [groceryShopName, setGroceryShopName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [vehiclePermit, setVehiclePermit] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [region, setRegion] = useState({
    name: '',
    latitude: 48.85552283403529,
    longitude: 2.37035159021616,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });
  const [countryItems, setCountryItems] = useState(STRIPE_COUNTRIES);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countryValue, setCountryValue] = useState('United States');
  const [salesTax, setSalesTax] = useState('');

  useEffect(() => {
    if (isEditMode && user) {
      getMyShopProfile();
    }
  }, []);

  const getMyShopProfile = () => {
    const onSuccess = response => {
      const data = response.data.data;

      setGroceryShopName(data.shopTitle);
      setRegion(prev => ({...prev, name: data.location.address, latitude: data.location.coordinates[1], longitude: data.location.coordinates[0]}));
      const [startTimeString, endTimeString] = data.operatingHours.split('to');
      setOpeningTime(new Date(startTimeString));
      setClosingTime(new Date(endTimeString));
      setImage({uri: data.image});
      setAccountNumber(data?.bankAccountInfo?.bankAccountId);
      setBankName(data?.bankAccountInfo?.bankName);
      setSalesTax(data?.salesTax.toString());
    };
    const shopId = user.shopId;
    callApi(API_METHODS.GET, `${API.getMyShop}${shopId}`, null, onSuccess, onAPIError, setIsLoading);
  };

  const handleSelectImage = async () => {
    const assets = await imagePickerFromGallery({});
    if (assets.length > 0) setImage(assets[0]);
  };

  const handleConfirm = async () => {
    let data = {};

    if (isGroceryOwner) data = {image, countryValue, openingTime, closingTime, groceryShopName, address: region.name, salesTax};
    else if (isDriver) data = {image, countryValue, vehiclePermit, address: region.name};

    const isValidate = isGroceryOwner ? ownerCompleteProfileValidations(data) : driverCompleteProfileValidations(data);
    if (!isValidate) return;

    setIsLoading(true);
    try {
      const file = {
        uri: image.uri,
        name: `file${Math.floor(Math.random() * 1034343438347)}`,
        type: image.type,
      };

      const commonData = {
        image: image.fileName ? await uploadImageToS3(file) : image.uri,
        location: {type: 'Point', address: region.name, coordinates: [region.longitude, region.latitude]},
        country: countryValue,
      };

      let formatedData = {};

      if (isGroceryOwner) {
        formatedData = {
          ...commonData,
          shopTitle: groceryShopName,
          operatingHours: `${openingTime.toISOString()}to${closingTime.toISOString()}`,
          salesTax,
        };
      }

      if (isDriver) {
        formatedData = {
          ...commonData,
          vehiclePermit,
        };
      }

      console.log('Body: ', formatedData);
      updateProfileAPI(formatedData);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProfileAPI = data => {
    const onSuccess = response => {
      if (response.success) {
        const user = response.data.user;
        if (user) dispatch(authActions.setUser(user)); // NEED TO REMOVE ADD PLACE IN AFTER BANK ADD VERIFY

        if (isEditMode) navigation.goBack();
        else navigation.navigate(ROUTES.AddBank);
      }
    };

    let endPoint = API.driverProfileUpdate;
    if (isGroceryOwner && !isEditMode) endPoint = API.createShop;
    else if (isGroceryOwner && isEditMode) endPoint = `${API.updateShop}${user?.shopId}`;

    let apiMethod = API_METHODS.PATCH;
    if (isGroceryOwner && !isEditMode) apiMethod = API_METHODS.POST;
    else if (isGroceryOwner && isEditMode) apiMethod = API_METHODS.PATCH;

    callApi(apiMethod, endPoint, data, onSuccess, onAPIError, setIsLoading);
  };

  const handleSelectLocation = (data, details) => {
    setRegion(current => ({
      ...current,
      name: data.description,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    }));
  };

  const getDatePickerDate = () => {
    if (isOpeningTimeModalShow && openingTime) return openingTime;
    else if (isClosingTimeModalShow && closingTime) return closingTime;
    else return new Date('2024-12-27T12:10:10.747000Z');
  };

  const formatedOpeningTime = openingTime ? getFormattedTime(openingTime) : 'Opening Time';
  const formatedClosingTime = closingTime ? getFormattedTime(closingTime) : 'Closing Time';

  return (
    <FruitsColorBackgroundWrapper>
      <Screen>
        <Header />
        <Loader isLoading={isLoading} />
        <AppScrollView>
          <View style={signUpStyles.headText}>
            <AppText fontFamily={FONTS.medium} fontSize={18}>
              {isGroceryOwner ? 'Shop' : 'Complete'} profile
            </AppText>
            <AppText fontSize={12}>Complete your profile by adding basic information</AppText>
          </View>
          <View style={[globalStyles.flex1, globalStyles.inputsGap, {zIndex: 1}]}>
            {isDriver ? (
              <View style={[globalStyles.inputsGap, signUpStyles.inputsContainer]}>
                <Pressable onPress={handleSelectImage} style={profileStyles.avatarContainer}>
                  {image ? <Image source={{uri: image?.uri}} style={profileStyles.image} /> : <UserAvatarIcon width={120} height={120} />}
                  <CameraPrimaryIcon width={25} height={25} style={profileStyles.cameraIcon} />
                </Pressable>

                <GooglePlacesInput onSelect={handleSelectLocation} />
                <AppTextInput placeholder="Vehicle Permit" onChangeText={setVehiclePermit} />
              </View>
            ) : (
              <View style={[globalStyles.inputsGap, signUpStyles.inputsContainer]}>
                <Pressable onPress={handleSelectImage} style={profileStyles.avatarContainer}>
                  {image ? <Image source={{uri: image?.uri}} style={profileStyles.image} /> : <UserAvatarIcon width={120} height={120} />}
                  <CameraPrimaryIcon width={25} height={25} style={profileStyles.cameraIcon} />
                </Pressable>

                <AppTextInput placeholder="Grocery Shop Name" onChangeText={setGroceryShopName} value={groceryShopName} />

                <GooglePlacesInput onSelect={handleSelectLocation} placeholder={region.name ? region.name : 'Address'} />

                <AppTextInput placeholder="Sales Tax %" onChangeText={setSalesTax} value={salesTax} keyboardType={'number-pad'} />
                <Pressable onPress={() => setIsOpeningTimeModalShow(true)} style={profileStyles.timeContainer}>
                  <AppText greyText>{formatedOpeningTime}</AppText>
                  <ChevronIcon height={18} width={18} />
                </Pressable>

                <Pressable onPress={() => setIsClosingTimeModalShow(true)} style={profileStyles.timeContainer}>
                  <AppText greyText>{formatedClosingTime}</AppText>
                  <ChevronIcon height={18} width={18} />
                </Pressable>
              </View>
            )}

            <DropDownPicker
              props={{activeOpacity: 0.5}}
              zIndex={10}
              zIndexInverse={1}
              placeholder="Country"
              open={countryDropdownOpen}
              value={countryValue}
              items={countryItems}
              setOpen={setCountryDropdownOpen}
              setValue={setCountryValue}
              setItems={setCountryItems}
              style={productStyles.dropdownStyle}
              placeholderStyle={productStyles.dropdownPlaceholder}
              dropDownContainerStyle={productStyles.dropdownContainerStyle}
              textStyle={productStyles.dropdownText}
              dropDownDirection="BOTTOM"
            />
          </View>
          {/* <View style={{marginTop: 30}}>
            <View style={{gap: 10}}>
              <AppText fontFamily={FONTS.medium} fontSize={18}>
                Add Bank Info
              </AppText>
              <AppText fontSize={12}>Add bank info to make transaction easy</AppText>
            </View>

            <View style={[globalStyles.inputsGap, signUpStyles.inputsContainer]}>
              <AppTextInput placeholder="Bank Name" onChangeText={setBankName} value={bankName} />
              <AppTextInput placeholder="Account Number" onChangeText={setAccountNumber} value={accountNumber} />
            </View>
          </View> */}

          <AppButton title={'Confirm'} containerStyle={[globalStyles.bottomButton]} onPress={handleConfirm} />
        </AppScrollView>
      </Screen>

      <DatePicker
        modal
        mode="time"
        open={isOpeningTimeModalShow || isClosingTimeModalShow}
        date={getDatePickerDate()}
        onConfirm={date => {
          if (isOpeningTimeModalShow) {
            setIsOpeningTimeModalShow(false);
            setOpeningTime(date);
          } else {
            setIsClosingTimeModalShow(false);
            setClosingTime(date);
          }
        }}
        onCancel={() => {
          setIsClosingTimeModalShow(false);
          setIsOpeningTimeModalShow(false);
        }}
      />
    </FruitsColorBackgroundWrapper>
  );
};

export default CompleteProfile;
