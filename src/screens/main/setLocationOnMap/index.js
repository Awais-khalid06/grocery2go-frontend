import {View} from 'react-native';
import React, {useState} from 'react';
import {AppButton, Header, Screen} from '../../../components';
import {ArrowIcon, LocationPrimaryIcon, MapPinIcon} from '../../../assets/icons';
import GooglePlacesInput from '../../../components/googlePlacesInput';
import {homeStyles, locationStyles} from '../styles';
import GoogleMap from '../../../components/googleMap';
import globalStyles from '../../../../globalStyles';
import {Marker} from 'react-native-maps';
import {ROUTES} from '../../../utils/constants';
import {getLocationNameFromLatLng} from '../../../helpers';

const SetLocationOnMap = ({navigation, route}) => {
  const params = route.params;
  const isPrevScreenMyCart = params?.prevScreen === 'MY_CART';

  const [region, setRegion] = useState({
    name: '',
    latitude: 48.85552283403529,
    longitude: 2.37035159021616,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });

  const handleSelectLocation = (data, details) => {
    setRegion(current => ({
      ...current,
      name: data.description,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    }));
  };

  const handleMapPinDragEnd = async e => {
    const {longitude, latitude} = e?.nativeEvent?.coordinate || {};
    const name = await getLocationNameFromLatLng(latitude, longitude);
    setRegion({...region, name, latitude, longitude});
  };

  const handleContinue = () => {
    if (isPrevScreenMyCart) navigation.navigate(ROUTES.Checkout, {location: region});
  };

  const renderHeader = () => {
    return (
      <View style={locationStyles.mapLocationHeaderContainer}>
        <ArrowIcon />
        <GooglePlacesInput listViewStyle={[homeStyles.searchListView]} onSelect={handleSelectLocation} />
      </View>
    );
  };

  return (
    <Screen>
      <Header LeftIcon={renderHeader} />

      <View style={[globalStyles.flex1, {zIndex: -1}]}>
        <GoogleMap region={region}>
          <Marker draggable={true} tracksViewChanges={false} coordinate={region} onDragEnd={handleMapPinDragEnd}>
            <MapPinIcon width={80} height={80} />
          </Marker>
        </GoogleMap>
        {/* <LocationPrimaryIcon style={locationStyles.currentLocation} /> */}
        <AppButton title={'Continue'} containerStyle={locationStyles.doneBtn} onPress={handleContinue} />
      </View>
    </Screen>
  );
};

export default SetLocationOnMap;
