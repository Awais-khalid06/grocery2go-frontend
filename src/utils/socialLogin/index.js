import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// import {appleAuth} from '@invertase/react-native-apple-authentication';

export const GoogleSignIn = async () => {
  GoogleSignin.configure({
    scopes: ['email'],
    webClientId: '608307830800-2nnfdruk0ql60bmnjvqrc67h87hl427r.apps.googleusercontent.com',
    offlineAccess: true,
    forceCodeForRefreshToken: true,
    profileImageSize: 120,
  });
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    if (userInfo !== '') {
      return userInfo;
    }
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      alert('User cancelled the login process');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      alert('Signin in progress');
      // operation (f.e. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      alert('Google play services not available or outdated !');
      // play services not available or outdated
    } else {
      console.log(error);
    }
  }
};

// export const AppleLogin = () => {
//   return new Promise(async (resolve, reject) => {
//     if (!appleAuth.isSupported) {
//       alert('Apple Login not supported on your device!');
//       reject('Not Supported');
//       return;
//     }
//     try {
//       const appleAuthRequestResponse = await appleAuth.performRequest({
//         nonceEnabled: false,
//         requestedOperation: appleAuth.Operation.LOGIN,
//         requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
//       });

//       if (!appleAuthRequestResponse.identityToken) {
//         throw new Error('Apple Sign-In failed - no identify token returned');
//       }

//       const {fullName, authorizationCode} = appleAuthRequestResponse;

//       const userData = {
//         name: fullName?.givenName ? fullName.givenName : '',
//         email: user?.email,
//       };

//       resolve(userData);
//     } catch (error) {
//       console.log(error);
//       reject(error);
//     }
//   });
// };
