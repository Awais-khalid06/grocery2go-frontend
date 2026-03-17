import {Pressable, View} from 'react-native';
import React, {useState} from 'react';
import FruitsColorBackgroundWrapper from '../common/fruitsColorBackgroundWrapper';
import {AppButton, AppScrollView, AppText, AppTextInput, Header, Loader, Screen} from '../../../components';
import {signUpStyles} from '../styles';
import {FONTS} from '../../../utils/theme';
import globalStyles from '../../../../globalStyles';
import RNPhoneInput from 'react-native-phone-number-input';
import {AppleCircleIcon, GoogleCircleIcon} from '../../../assets/icons';
import {ROUTES} from '../../../utils/constants';
import {useAccountType} from '../../../hooks';
import {signupValidations} from '../../../utils/validations';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';
import GooglePlacesInput from '../../../components/googlePlacesInput';
import useSocialLogin from '../../../hooks/useSocialLogin';

const SignUp = ({navigation}) => {
  const {isGroceryOwner, isDriver, isCustomer} = useAccountType();
  const {isSocialLoading, googleLogin} = useSocialLogin();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [region, setRegion] = useState({
    name: '',
    latitude: 48.85552283403529,
    longitude: 2.37035159021616,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });
  const formatedEmail = email.toLowerCase().trim();

  const handleSelectLocation = (data, details) => {
    setRegion(current => ({
      ...current,
      name: data.description,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    }));
  };

  const handleSignUp = () => {
    const data = {firstName, lastName, phoneNumber, email: formatedEmail, password, address: region.name, confirmPassword};
    const isValidate = signupValidations(data, isCustomer);
    if (!isValidate) return;

    let userType = 'Customer';
    if (isDriver) userType = 'Rider';
    else if (isGroceryOwner) userType = 'Owner';

    const formatedData = {...data, contact: data?.phoneNumber, userType, location: {type: 'Point', address: region.name, coordinates: [region.longitude, region.latitude]}};

    delete formatedData.phoneNumber;
    delete formatedData.address;

    if (!isCustomer) {
      delete formatedData.location;
      delete formatedData.address;
    }

    signUpAPI(formatedData);
  };

  const signUpAPI = data => {
    const onSuccess = response => {
      if (response.success) {
        navigation.navigate(ROUTES.Verification, {prevScreen: 'SIGNUP', email: data.email});
      }
    };

    callApi(API_METHODS.POST, API.signUp, data, onSuccess, onAPIError, setIsLoading);
  };

  return (
    <FruitsColorBackgroundWrapper>
      <Loader isLoading={isLoading || isSocialLoading} />
      <Screen>
        <Header />
        <AppScrollView>
          <View style={signUpStyles.headText}>
            <AppText fontFamily={FONTS.medium} fontSize={18}>
              Sign Up
            </AppText>
            <AppText fontSize={12}>Sign Up new account</AppText>
          </View>

          <View style={[globalStyles.inputsGap, signUpStyles.inputsContainer]}>
            <AppTextInput placeholder="First Name" onChangeText={setFirstName} />
            <AppTextInput placeholder="Last Name" onChangeText={setLastName} />
            <AppTextInput placeholder="Email Address" onChangeText={setEmail} />

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
              onChangeFormattedText={setPhoneNumber}
            />
            <AppTextInput placeholder="Password" onChangeText={setPassword} isPasswordEye={true} />
            <AppTextInput placeholder="Retype Password" isPasswordEye={true} onChangeText={setConfirmPassword} />
            {/* <AppTextInput placeholder="Address" RightIcon={LocationGrayIcon} onChangeText={text => setRegion({...region, name: text})} /> */}
            {isCustomer && <GooglePlacesInput onSelect={handleSelectLocation} />}
          </View>

          <AppButton title={'Sign Up'} containerStyle={{marginTop: 30}} onPress={handleSignUp} />
          <View style={globalStyles.flex1} />
          <View style={signUpStyles.buttonContainer}>
            <AppText greyText>
              Already have an account?{' '}
              <AppText primary fontFamily={FONTS.semiBold} onPress={() => navigation.navigate(ROUTES.SignIn)}>
                Sign In
              </AppText>
            </AppText>
          </View>

          <View style={signUpStyles.bottomContent}>
            <AppText fontSize={12} greyText>
              Or sign in with
            </AppText>

            <View style={signUpStyles.socialIcons}>
              <Pressable onPress={googleLogin}>
                <GoogleCircleIcon />
              </Pressable>
              <AppleCircleIcon />
            </View>
          </View>
        </AppScrollView>
      </Screen>
    </FruitsColorBackgroundWrapper>
  );
};

export default SignUp;
