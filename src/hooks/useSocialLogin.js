import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import useAccountType from './useAccountType';
import {getDeviceIdAndFCM, onAPIError} from '../helpers';
import {API_METHODS, callApi} from '../network/NetworkManger';
import {API} from '../network/Environment';
import {GoogleSignIn} from '../utils/socialLogin';
import {authActions} from '../redux/slices/auth';
import {ROUTES, STACKS} from '../utils/constants';

const useSocialLogin = () => {
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {isDriver, isGroceryOwner} = useAccountType();

  const socialSignIn = async socialResponse => {
    // console.log('social res: ', socialResponse);

    const onSuccess = response => {
      console.log('social api response: ', response);

      if (response.success) {
        const {token, refreshToken, user} = response.data || {};

        if (token) dispatch(authActions.setAccessToken(token));
        if (refreshToken) dispatch(authActions.setRefreshToken(refreshToken));
        if (user) dispatch(authActions.setUser(user));

        if (response.act === 'login-granted' || response.act === 'Customer-profile-setup-pending') {
          return navigation.replace(STACKS.Main);
        }

        if (response.act === 'Owner-profile-setup-pending' || response.act === 'Rider-profile-setup-pending') {
          return navigation.navigate(ROUTES.CompleteProfile);
        }

        if (response.act === 'Owner-bankAccount-setup-pending') {
          return navigation.replace(ROUTES.AddBank);
        }
      }
    };

    let userType = 'Customer';
    if (isDriver) userType = 'Rider';
    else if (isGroceryOwner) userType = 'Owner';

    const {email, name, photo} = socialResponse?.data?.user;
    const data = {email: email, device: await getDeviceIdAndFCM(), firstName: name, lastName: '', image: photo, userType};
    callApi(API_METHODS.POST, API.socialLogin, data, onSuccess, onAPIError, setIsSocialLoading);
  };

  const googleLogin = async () => {
    setIsSocialLoading(true);
    const response = await GoogleSignIn();
    setIsSocialLoading(false);

    if (response) socialSignIn(response);
  };

  return {isSocialLoading, googleLogin};
};

export default useSocialLogin;
