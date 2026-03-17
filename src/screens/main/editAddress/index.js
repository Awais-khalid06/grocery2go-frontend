import {View, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppText, Header, Screen, SeperatorLine, SuccessModal} from '../../../components';
import globalStyles from '../../../../globalStyles';
import {homeStyles, locationStyles} from '../styles';
import GooglePlacesInput from '../../../components/googlePlacesInput';
import {LocationBlackIcon, LocationRedGreenCircleIcon} from '../../../assets/icons';
import {FONTS} from '../../../utils/theme';
import {ROUTES} from '../../../utils/constants';
import {useLocation} from '../../../hooks';

const EditAddress = ({navigation, route}) => {
  const {prevScreen} = route.params || {};
  const [location, getMyLocation] = useLocation();
  const [isSubmittedModaShow, setIsSubmittedModalShow] = useState(false);
  const isPrevScreenRiderDetail = prevScreen === 'RIDER_DETAIL';
  const isPrevScreenMyCart = prevScreen === 'MY_CART';

  useEffect(() => {
    getMyLocation();
  }, []);

  const handlePressCurrentLocation = () => {
    if (isPrevScreenMyCart) navigation.navigate(ROUTES.Checkout, {location});
  };

  const handleSelectLocationFromSearch = (data, details) => {
    const address = data.description;
    const latitude = details.geometry.location.lat;
    const longitude = details.geometry.location.lng;

    const location = {name: address, latitude, longitude};
    navigation.navigate(ROUTES.Checkout, {location});
  };

  return (
    <Screen>
      <Header title={'Edit Address'} />
      <View style={[globalStyles.flex1, globalStyles.screenPadding]}>
        <View style={locationStyles.topSearchContainer}>
          <GooglePlacesInput listViewStyle={homeStyles.searchListView} onSelect={handleSelectLocationFromSearch} />
        </View>

        {location && (
          <Pressable onPress={handlePressCurrentLocation} style={locationStyles.currentLocationContainer}>
            <View style={locationStyles.greyCircle}>
              <LocationBlackIcon width={20} height={20} />
            </View>

            <View>
              <AppText style={{fontFamily: FONTS.medium}}>Current Location</AppText>
              <AppText greyText style={{fontSize: 12}}>
                {location?.name}
              </AppText>
            </View>
          </Pressable>
        )}
        <SeperatorLine style={{marginVertical: 10}} />
        <View style={[locationStyles.currentLocationContainer, {marginTop: location ? 0 : 40}]}>
          <View style={locationStyles.greyCircle}>
            <LocationRedGreenCircleIcon />
          </View>
          <AppText
            onPress={() => {
              if (isPrevScreenRiderDetail) {
              } else {
                navigation.navigate(ROUTES.SetLocationOnMap, {prevScreen});
              }
            }}
            style={locationStyles.selectionLocationMapText}>
            {'Set Location on map'}
          </AppText>
        </View>
      </View>

      <SuccessModal
        heading={'Submitted!'}
        description={'Wait for acceptance'}
        isVisible={isSubmittedModaShow}
        setIsVisible={setIsSubmittedModalShow}
        onPressButton={() => {
          setIsSubmittedModalShow(false);
          navigation.goBack();
        }}
        buttonTitle={'Ok'}
      />
    </Screen>
  );
};

export default EditAddress;
