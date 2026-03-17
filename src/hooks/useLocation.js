import {useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder-reborn';
import {isIOS} from '../helpers';

function useLocation() {
  const [location, setLocation] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const getMyLocation = async () => {
    let permission = await getLocationPermission();
    if (!permission) return;

    setIsLocationLoading(true);

    const onSuccess = position => {
      if (position.coords.latitude != undefined || position.coords != '') {
        reverseGeoCodeing(position.coords.latitude, position.coords.longitude)
          .then(placeName => {
            setLocation({
              name: placeName,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          })
          .catch(error => {
            console.log('Reverse Geocoding Error => ', error);
          })
          .finally(() => {
            setIsLocationLoading(false);
          });
      }
    };

    const onError = error => {
      setIsLocationLoading(false);
      if (error.PERMISSION_DENIED == 1) alert('Please turn on your location');
      console.log('Get My Location Error => ', error);
    };

    Geolocation.getCurrentPosition(onSuccess, onError);
  };

  const getLocationPermission = async () => {
    let response = false;
    if (isIOS) {
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'always',
      });
      Geolocation.requestAuthorization();
      response = true;
    } else {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: 'App',
          message: 'App wants to access your device location to track your current location updates.',
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          const grantedBackground = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION, {
            title: 'App',
            message: 'App wants to access your device location to track your live location updates, even when the app is closed or not in use,',
          });
          response = true;
        } else {
          alert('Location permission denied, you cannot use location features in the application. Please enable from settings location to view location based services.');
        }
      } catch (err) {
        console.log(err);
      }
    }
    return response;
  };

  const reverseGeoCodeing = async (latitude, longitude) => {
    try {
      const res = await Geocoder.geocodePosition({
        lat: latitude,
        lng: longitude,
      });
      // const Area = addressComponent.address_components[addressComponent.address_components.length - 4].long_name;
      // const City = addressComponent.address_components[addressComponent.address_components.length - 3].long_name;
      return res[0].formattedAddress;
    } catch (err) {
      throw err;
    }
  };

  return [location, getMyLocation, isLocationLoading];
}

export default useLocation;
