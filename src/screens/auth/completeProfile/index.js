import {
  View,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import FruitsColorBackgroundWrapper from "../common/fruitsColorBackgroundWrapper";
import {
  AppButton,
  AppScrollView,
  AppText,
  AppTextInput,
  Header,
  Loader,
  Screen,
  ShowMessage,
} from "../../../components";
import { signUpStyles } from "../styles";
import { COLORS, FONTS } from "../../../utils/theme";
import {
  CameraPrimaryIcon,
  ChevronIcon,
  UserAvatarIcon,
} from "../../../assets/icons";
import {
  getFormattedTime,
  imagePickerFromGallery,
  onAPIError,
  uploadImageToS3,
} from "../../../helpers";
import globalStyles from "../../../../globalStyles";
import { productStyles, profileStyles } from "../../main/styles";
import DatePicker from "react-native-date-picker";
import { ROUTES, STRIPE_COUNTRIES } from "../../../utils/constants";
import { useAccountType } from "../../../hooks";
import {
  driverCompleteProfileValidations,
  ownerCompleteProfileValidations,
} from "../../../utils/validations";
import { API_METHODS, callApi } from "../../../network/NetworkManger";
import { API } from "../../../network/Environment";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../../redux/slices/auth";
import GooglePlacesInput from "../../../components/googlePlacesInput";
import { userSelector } from "../../../redux/selectors";
import DropDownPicker from "react-native-dropdown-picker";
import { STRIPE_COUNTRY_CODE_BY_NAME } from "../../../utils/constants";

const CompleteProfile = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isEditMode = route.params?.screenType === "EDIT_PROFILE";
  const { isDriver, isGroceryOwner } = useAccountType();
  const user = useSelector(userSelector) || {};
  const [image, setImage] = useState(null);
  const [isOpeningTimeModalShow, setIsOpeningTimeModalShow] = useState(false);
  const [isClosingTimeModalShow, setIsClosingTimeModalShow] = useState(false);
  const [groceryShopName, setGroceryShopName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [vehiclePermit, setVehiclePermit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocationCountry, setSelectedLocationCountry] = useState("");
  const [region, setRegion] = useState({
    name: "",
    latitude: 48.85552283403529,
    longitude: 2.37035159021616,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });
  const [countryItems, setCountryItems] = useState(STRIPE_COUNTRIES);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countryValue, setCountryValue] = useState("");

  const callApiAsync = (method, endPoint, payload) => {
    return new Promise((resolve) => {
      callApi(method, endPoint, payload, resolve, resolve);
    });
  };

  const getUserFromResponse = (response) => {
    return response?.data?.user || response?.user || null;
  };

  useEffect(() => {
    if (isEditMode && user) {
      getMyShopProfile();
    }
  }, []);

  const getMyShopProfile = () => {
    const onSuccess = (response) => {
      const data = response.data.data;

      setGroceryShopName(data.shopTitle);
      setRegion((prev) => ({
        ...prev,
        name: data.location.address,
        latitude: data.location.coordinates[1],
        longitude: data.location.coordinates[0],
      }));
      const [startTimeString, endTimeString] = data.operatingHours.split("to");
      setOpeningTime(new Date(startTimeString));
      setClosingTime(new Date(endTimeString));
      setImage({ uri: data.image });
      setAccountNumber(data?.bankAccountInfo?.bankAccountId);
      setBankName(data?.bankAccountInfo?.bankName);
      if (data?.country) setCountryValue(data.country);
      else if (data?.location?.country) setCountryValue(data.location.country);
      if (data?.country || data?.location?.country) {
        setSelectedLocationCountry(data.country || data.location.country);
      }
    };
    const shopId = user.shopId;
    callApi(
      API_METHODS.GET,
      `${API.getMyShop}${shopId}`,
      null,
      onSuccess,
      onAPIError,
      setIsLoading
    );
  };

  const handleSelectImage = async () => {
    const assets = await imagePickerFromGallery({});
    if (assets.length > 0) setImage(assets[0]);
  };

  const getCountryFromPlaceDetails = (details) => {
    const countryComponent = details?.address_components?.find((component) =>
      component?.types?.includes("country")
    );
    return countryComponent?.long_name || countryComponent?.short_name || "";
  };

  const getCountryQuery = () => {
    const countryCode = STRIPE_COUNTRY_CODE_BY_NAME[countryValue || ""];
    if (!countryCode) return {};

    return { components: `country:${countryCode.toLowerCase()}` };
  };

  const handleCountryValueChange = (valueOrUpdater) => {
    const nextValue =
      typeof valueOrUpdater === "function"
        ? valueOrUpdater(countryValue)
        : valueOrUpdater;

    if (nextValue !== countryValue) {
      setRegion((current) => ({
        ...current,
        name: "",
      }));
      setSelectedLocationCountry("");
    }

    setCountryValue(nextValue);
  };

  const countryQuery = getCountryQuery();
  const selectedCountryMismatch =
    selectedLocationCountry &&
    countryValue &&
    selectedLocationCountry !== countryValue;

  const handleConfirm = async () => {
    const trimmedAddress = region?.name?.trim?.() || "";
    const trimmedCountry = countryValue?.trim?.() || "";
    const trimmedVehiclePermit = vehiclePermit?.trim?.() || "";
    const trimmedShopName = groceryShopName?.trim?.() || "";

    if (selectedCountryMismatch) {
      ShowMessage(
        "Selected country and address country must match. Please pick an address in the selected country."
      );
      return;
    }

    let data = {};

    if (isGroceryOwner)
      data = {
        image,
        countryValue: trimmedCountry,
        openingTime,
        closingTime,
        groceryShopName: trimmedShopName,
        address: trimmedAddress,
      };
    else if (isDriver)
      data = {
        image,
        countryValue: trimmedCountry,
        vehiclePermit: trimmedVehiclePermit,
        address: trimmedAddress,
      };

    console.log("CompleteProfile validation input:", data);
    const isValidate = isGroceryOwner
      ? ownerCompleteProfileValidations(data)
      : driverCompleteProfileValidations(data);
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
        location: {
          type: "Point",
          address: trimmedAddress,
          country: trimmedCountry,
          coordinates: [Number(region.longitude), Number(region.latitude)],
        },
        country: trimmedCountry,
        countryValue: trimmedCountry,
      };
      console.log("CompleteProfile commonData:", commonData);

      let formatedData = {};

      if (isGroceryOwner) {
        formatedData = {
          ...commonData,
          shopTitle: trimmedShopName,
          operatingHours: `${openingTime.toISOString()}to${closingTime.toISOString()}`,
        };
      }

      if (isDriver) {
        formatedData = {
          ...commonData,
          vehiclePermit: trimmedVehiclePermit,
        };
      }

      console.log("CompleteProfile request body:", formatedData);
      updateProfileAPI(formatedData);
    } catch (error) {
      console.log(error);
      ShowMessage(
        error?.message || "Unable to upload image. Please try again."
      );
      setIsLoading(false);
    }
  };

  const updateProfileAPI = (data) => {
    console.log("CompleteProfile API call config:", {
      isEditMode,
      isGroceryOwner,
      isDriver,
    });

    const ownerProfileData = {
      country: data?.country,
      countryValue: data?.countryValue,
      location: data?.location,
    };

    const mergeUserData = (...parts) =>
      parts.reduce((acc, part) => ({ ...acc, ...(part || {}) }), {});

    const onError = (error) => {
      console.log("CompleteProfile error response: ", error);
      onAPIError(error);
      ShowMessage(
        error?.message || "Unable to save profile. Please try again."
      );
    };

    const executeSave = async () => {
      let ownerResponse = null;

      if (isGroceryOwner) {
        // Stripe reads the owner profile, so keep the user country/address in sync first.
        console.log("CompleteProfile owner profile sync:", ownerProfileData);
        ownerResponse = await callApiAsync(
          API_METHODS.PATCH,
          API.ownerProfileUpdate,
          ownerProfileData
        );

        if (!ownerResponse?.success) {
          return { success: false, response: ownerResponse };
        }
      }

      let endPoint = API.driverProfileUpdate;
      if (isGroceryOwner && !isEditMode) endPoint = API.createShop;
      else if (isGroceryOwner && isEditMode)
        endPoint = `${API.updateShop}${user?.shopId}`;

      let apiMethod = API_METHODS.PATCH;
      if (isGroceryOwner && !isEditMode) apiMethod = API_METHODS.POST;
      else if (isGroceryOwner && isEditMode) apiMethod = API_METHODS.PATCH;

      console.log("CompleteProfile API request:", {
        apiMethod,
        endPoint,
        data,
      });

      const response = await callApiAsync(apiMethod, endPoint, data);
      if (!response?.success) {
        return { success: false, response };
      }

      const savedUser = getUserFromResponse(response);
      const ownerUser = getUserFromResponse(ownerResponse);
      const mergedUser = mergeUserData(user, savedUser, ownerUser);

      if (Object.keys(mergedUser).length > 0) {
        dispatch(authActions.setUser(mergedUser));
      }

      return { success: true, response };
    };

    setIsLoading(true);
    executeSave()
      .then(({ success, response }) => {
        if (!success) return;

        console.log("CompleteProfile success response: ", response);
        if (isEditMode) navigation.goBack();
        else navigation.navigate(ROUTES.AddBank);
      })
      .catch((error) => {
        console.log("CompleteProfile unexpected error response: ", error);
        onError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSelectLocation = (data, details) => {
    const address = data?.description || details?.formatted_address || "";
    const latitude = details?.geometry?.location?.lat ?? region.latitude;
    const longitude = details?.geometry?.location?.lng ?? region.longitude;
    const countryFromLocation = getCountryFromPlaceDetails(details);

    console.log("CompleteProfile handleSelectLocation:", {
      data,
      details,
      address,
      latitude,
      longitude,
      countryFromLocation,
    });

    if (countryFromLocation) {
      setCountryValue(countryFromLocation);
      setSelectedLocationCountry(countryFromLocation);
    }

    setRegion((current) => ({
      ...current,
      name: address,
      latitude,
      longitude,
    }));
  };

  const getDatePickerDate = () => {
    if (isOpeningTimeModalShow && openingTime) return openingTime;
    else if (isClosingTimeModalShow && closingTime) return closingTime;
    else return new Date("2024-12-27T12:10:10.747000Z");
  };

  const formatedOpeningTime = openingTime
    ? getFormattedTime(openingTime)
    : "Opening Time";
  const formatedClosingTime = closingTime
    ? getFormattedTime(closingTime)
    : "Closing Time";

  return (
    <FruitsColorBackgroundWrapper>
      <Screen>
        <Loader isLoading={isLoading} />
        <KeyboardAvoidingView
          style={globalStyles.flex1}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Header />
          <AppScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            extraScrollHeight={40}
            contentContainerStyle={globalStyles.screenPaddingBottom10}
          >
            <View style={signUpStyles.headText}>
              <AppText fontFamily={FONTS.medium} fontSize={18}>
                {isGroceryOwner ? "Shop" : "Complete"} profile
              </AppText>
              <AppText fontSize={12}>
                Complete your profile by adding basic information
              </AppText>
            </View>
            <View
              style={[
                globalStyles.flex1,
                globalStyles.inputsGap,
                { zIndex: 1 },
              ]}
            >
              {isDriver ? (
                <View
                  style={[globalStyles.inputsGap, signUpStyles.inputsContainer]}
                >
                  <Pressable
                    onPress={handleSelectImage}
                    style={profileStyles.avatarContainer}
                  >
                    {image ? (
                      <Image
                        source={{ uri: image?.uri }}
                        style={profileStyles.image}
                      />
                    ) : (
                      <UserAvatarIcon width={120} height={120} />
                    )}
                    <CameraPrimaryIcon
                      width={25}
                      height={25}
                      style={profileStyles.cameraIcon}
                    />
                  </Pressable>

                  <GooglePlacesInput
                    onSelect={handleSelectLocation}
                    region={region}
                    containerStyle={{ zIndex: 1000 }}
                    listViewStyle={{ zIndex: 1001, elevation: 12 }}
                    query={countryQuery}
                    textInputProps={{
                      value: region.name,
                      onChangeText: (text) =>
                        setRegion((current) => ({ ...current, name: text })),
                    }}
                  />
                  <AppTextInput
                    placeholder="Vehicle Permit"
                    onChangeText={setVehiclePermit}
                  />
                </View>
              ) : (
                <View
                  style={[globalStyles.inputsGap, signUpStyles.inputsContainer]}
                >
                  <Pressable
                    onPress={handleSelectImage}
                    style={profileStyles.avatarContainer}
                  >
                    {image ? (
                      <Image
                        source={{ uri: image?.uri }}
                        style={profileStyles.image}
                      />
                    ) : (
                      <UserAvatarIcon width={120} height={120} />
                    )}
                    <CameraPrimaryIcon
                      width={25}
                      height={25}
                      style={profileStyles.cameraIcon}
                    />
                  </Pressable>

                  <AppTextInput
                    placeholder="Grocery Shop Name"
                    onChangeText={setGroceryShopName}
                    value={groceryShopName}
                  />

                  <GooglePlacesInput
                    onSelect={handleSelectLocation}
                    region={region}
                    placeholder="Address"
                    containerStyle={{ zIndex: 1000 }}
                    listViewStyle={{ zIndex: 1001, elevation: 12 }}
                    query={countryQuery}
                    textInputProps={{
                      value: region.name,
                      onChangeText: (text) =>
                        setRegion((current) => ({ ...current, name: text })),
                    }}
                  />

                  <Pressable
                    onPress={() => setIsOpeningTimeModalShow(true)}
                    style={profileStyles.timeContainer}
                  >
                    <AppText greyText>{formatedOpeningTime}</AppText>
                    <ChevronIcon height={18} width={18} />
                  </Pressable>

                  <Pressable
                    onPress={() => setIsClosingTimeModalShow(true)}
                    style={profileStyles.timeContainer}
                  >
                    <AppText greyText>{formatedClosingTime}</AppText>
                    <ChevronIcon height={18} width={18} />
                  </Pressable>
                </View>
              )}

              <DropDownPicker
                props={{ activeOpacity: 0.5 }}
                zIndex={10}
                zIndexInverse={1}
                placeholder="Country"
                searchable
                searchPlaceholder="Search country..."
                searchPlaceholderTextColor={COLORS.textGray}
                open={countryDropdownOpen}
                value={countryValue}
                items={countryItems}
                setOpen={setCountryDropdownOpen}
                setValue={handleCountryValueChange}
                setItems={setCountryItems}
                style={productStyles.dropdownStyle}
                placeholderStyle={productStyles.dropdownPlaceholder}
                dropDownContainerStyle={productStyles.dropdownContainerStyle}
                textStyle={productStyles.dropdownText}
                searchContainerStyle={productStyles.dropdownSearchContainer}
                searchTextInputStyle={productStyles.dropdownSearchInput}
                dropDownDirection="BOTTOM"
              />
              {selectedCountryMismatch ? (
                <AppText fontSize={11} style={{ color: COLORS.red }}>
                  Selected location country and dropdown country do not match.
                  Pick a matching address.
                </AppText>
              ) : null}
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

            <AppButton
              title={"Confirm"}
              containerStyle={[globalStyles.bottomButton]}
              onPress={handleConfirm}
            />
          </AppScrollView>
        </KeyboardAvoidingView>
      </Screen>

      <DatePicker
        modal
        mode="time"
        open={isOpeningTimeModalShow || isClosingTimeModalShow}
        date={getDatePickerDate()}
        onConfirm={(date) => {
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
