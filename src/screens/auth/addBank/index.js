import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import WebView from 'react-native-webview';
import {Header, Loader, Screen, ShowMessage} from '../../../components';
import {API, BASE_URL} from '../../../network/Environment';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {addBankStyles} from '../styles';
import {STACKS} from '../../../utils/constants';
import {onAPIError} from '../../../helpers';

const AddBank = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stripeLink, setStripeLink] = useState('');
  const [urlLink, setUrlLink] = useState('');
  const desiredURL = `${BASE_URL}user/stripe/verify-onboarding`;

  useEffect(() => {
    getConnectData();
  }, []);

  useEffect(() => {
    if (urlLink.includes(desiredURL)) {
      verifyAccount();
    }
  }, [urlLink, desiredURL]);

  const verifyAccount = async () => {
    const onSuccess = response => {
      if (response?.status === 200) {
        if (response?.message === 'Could not verify your details. Please refer to the link and submit your information again!') {
          ShowMessage('Having issue with verification');
          setStripeLink(response?.data.accountUrl?.url);
        } else {
          ShowMessage('Account added successfull');
          navigation.replace(STACKS.Main);
        }
      }
    };

    callApi(API_METHODS.GET, API.verfyStripeOnboarding, null, onSuccess, onAPIError, setIsLoading);
  };

  const getConnectData = () => {
    const onSuccess = response => {
      console.log('getConnectData response: ', response);
      if (response?.status === 200 || response?.status == 'success') {
        setStripeLink(response?.data?.accountUrl?.url);
      } else {
        ShowMessage(response?.message);
        console.log('getConnectData response: ', response);
      }
    };

    callApi(API_METHODS.GET, API.createStripeAccount, null, onSuccess, onAPIError, setIsLoading);
  };

  return (
    <Screen>
      {stripeLink?.length > 0 ? null : <Header title={'Add Bank'} />}
      <Loader isLoading={isLoading} />

      <KeyboardAwareScrollView keyboardShouldPersistTaps="always" bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={addBankStyles.fg1}>
        <View style={addBankStyles.wrapper}>
          {stripeLink?.length > 0 && (
            <WebView
              onLoadEnd={() => setIsLoading(false)}
              source={{uri: stripeLink}}
              onNavigationStateChange={data => {
                console.log('onNavigationStateChange data:', data);
                setUrlLink(data?.url);
              }}
              style={addBankStyles.webviewStyle}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
};

export default AddBank;
