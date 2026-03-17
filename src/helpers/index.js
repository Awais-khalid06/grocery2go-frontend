import {Alert, Dimensions, Linking, PermissionsAndroid, Platform} from 'react-native';
import {getDeviceId} from 'react-native-device-info';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {authActions} from '../redux/slices/auth';
import {decode} from 'base64-arraybuffer';
import {S3} from 'aws-sdk';
import dayjs from 'dayjs';
import Geocoder from 'react-native-geocoder-reborn';
import {ROUTES} from '../utils/constants';
import messaging, {firebase} from '@react-native-firebase/messaging';
var fs = require('react-native-fs');
const {width, height} = Dimensions.get('window');
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

export const wp = p => width * (p / 100);
export const hp = p => height * (p / 100);

export const isIOS = Platform.OS === 'ios';

export const imagePickerFromGallery = async ({selectionLimit = 1, mediaType = 'photo', isCamera} = {}) => {
  try {
    let response = {};

    if (isCamera) response = await launchCamera({selectionLimit});
    else response = await launchImageLibrary({selectionLimit, mediaType});

    let assets = [];

    if (response?.assets?.length > 0) {
      assets = response.assets;
    } else if (response.errorCode === 'camera_unavailable') {
      ShowMessage('Camera is not available');
    } else if (response.errorCode === 'permission') {
      ShowMessage('Storage and camera permission is required');
    }

    return assets;
  } catch (error) {
    console.log(error);
  }
};

export const onAPIError = error => console.log('ERROR > ', error);

export const FCM = async () => {
  const enabled = await firebase.messaging().hasPermission();
  if (!enabled) {
    try {
      await firebase.messaging().requestPermission();
    } catch (error) {
      console.log(error);
    }
  }

  const fcmToken = await firebase.messaging().getToken();
  console.log('FCM ---->>>> ', fcmToken);
  if (fcmToken) {
    return fcmToken;
  } else {
    console.warn('no token');
    return 'No FCM Found!';
  }
};

export const getDeviceIdAndFCM = async () => {
  return {id: getDeviceId(), deviceToken: await FCM()};
};

export const authStateUpdateInRedux = (data = {}) => {
  const {token, refreshToken, user, dispatch} = data;

  if (token) dispatch(authActions.setAccessToken(token));
  if (refreshToken) dispatch(authActions.setRefreshToken(refreshToken));
  if (user) dispatch(authActions.setUser(user));
};

export const uploadImageToS3 = async file => {
  const s3bucket = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    Bucket: process.env.AWS_S3_BUCKET || 'grocery2gobucket',
    signatureVersion: 'v4',
  });

  let contentType = file.type;
  let contentDeposition = 'inline;filename="' + file.name + '"';
  const base64 = await fs.readFile(file.uri, 'base64');
  const arrayBuffer = decode(base64);

  return new Promise((resolve, reject) => {
    s3bucket.createBucket(() => {
      const params = {
        Bucket: 'grocery2gobucket',
        Key: file.name,
        Body: arrayBuffer,
        ContentDisposition: contentDeposition,
        ContentType: contentType,
      };

      s3bucket.upload(params, (err, resData) => {
        if (err) {
          reject(err);
          console.log('error in callback');
        } else {
          resolve(resData.Location);
          console.log('URL generate:', resData.Location);
        }
      });
    });
  });
};

export const getUserFullName = (first, last) => {
  if (!first && !last) return '--- ---';
  return `${first} ${last}`;
};

export const confirmationAlert = (message, cancelBtnText, okayBtnText) => {
  return new Promise((resolve, reject) => {
    Alert.alert('Confirm', message, [
      {text: cancelBtnText || 'Cancel', onPress: () => resolve(false)},
      {text: okayBtnText || 'Ok', onPress: () => resolve(true)},
    ]);
  });
};

export const commonAlert = (title, message) => {
  return new Promise((resolve, reject) => {
    Alert.alert(title, message, [{text: 'Ok', onPress: () => resolve(true)}]);
  });
};

export const getFormattedTime = date => {
  // date -> like new Date()
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;

  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
};

export const getDistanceFromLatLon = (lat1 = 37.4226711, lon1 = -122.0849872, lat2 = 37.421998333333335, lon2 = -122.084) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInKm = R * c; // Distance in kilometers
  const distanceInMiles = distanceInKm * 0.621371; // Distance in miles

  return `${distanceInMiles.toFixed(1)} ML`;
};

export const getFromNowTime = date => {
  if (!date) return '';
  return dayjs(date).fromNow();
};

export const getLocationNameFromLatLng = async (lat, lng) => {
  try {
    const res = await Geocoder.geocodePosition({lat, lng});
    return res[0].formattedAddress;
  } catch (error) {
    console.log('Reverse gecode error: ', error);
  }
};

export const navigateToChatRoom = ({navigation, inboxId}) => {
  navigation.navigate(ROUTES.ChatRoom, {inboxId});
};

export const requestNotificationPermission = async () => {
  if (isIOS) {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  } else {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }
};

export const moveToExternalMap = ({lat, lng, label}) => {
  if (!lat || !lng) return;

  const scheme = Platform.select({ios: 'maps://0,0?q=', android: 'geo:0,0?q='});
  const latLng = `${lat},${lng}`;
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });

  Linking.openURL(url);
};
