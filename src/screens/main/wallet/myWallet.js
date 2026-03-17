import React, {useEffect, useState} from 'react';
import {View, StatusBar} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import WebView from 'react-native-webview';

import {Header, Loader, Screen, ShowMessage} from '../../../components';
import {API} from '../../../network/Environment';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {walletStyles} from '../styles';

const MyWallet = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stripeLink, setStripeLink] = useState('');

  useEffect(() => {
    getWalletLink();
  }, []);

  const getWalletLink = async () => {
    try {
      setIsLoading(true);
      const endPoint = API.getStripeAccountBalance;
      await callApi(
        API_METHODS.GET,
        endPoint,
        null,
        res => {
          if (res?.statusCode === 200) {
            setStripeLink(res?.data?.loginLink?.url);
          } else {
            setIsLoading(false);
            ShowMessage(res?.message);
          }
        },
        err => {
          setIsLoading(false);
          ShowMessage(err?.message);
        },
      );
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <Loader isLoading={isLoading} />
      <Header title={'My Wallet'} />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always" bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={walletStyles.fg1}>
        <View style={walletStyles.wrapper}>{stripeLink?.length > 0 && <WebView onLoadEnd={() => setIsLoading(false)} source={{uri: stripeLink}} style={walletStyles.webviewStyle} />}</View>
      </KeyboardAwareScrollView>
    </Screen>
  );
};

export default MyWallet;
