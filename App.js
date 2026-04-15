import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store from './src/redux/store';
import { persistStore } from 'redux-persist';
import Routes from './src/routes';
import { LogBox, StatusBar } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import SocketContext from './src/context/context/socketContext';
import { SOCKET_BASE_URL, STRIPE_PUBLISHABLE_KEY } from './src/network/Environment';
import io from 'socket.io-client';

const persistor = persistStore(store);

if (__DEV__) {
  LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews']);
}

const socket = io(SOCKET_BASE_URL);

const App = () => {
  return (
    <Provider store={store}>
      <StripeProvider
        publishableKey={STRIPE_PUBLISHABLE_KEY}
        urlScheme="https://dashboard.stripe.com/test/dashboard" // required for 3D Secure and bank redirects
        merchantIdentifier="merchant.com.grocery2go" // required for Apple Pay
      >
        <StatusBar translucent backgroundColor={'transparent'} barStyle={'dark-content'} />
        <PersistGate loading={null} persistor={persistor}>
          <SocketContext.Provider value={socket}>
            <Routes />
          </SocketContext.Provider>
        </PersistGate>
      </StripeProvider>
    </Provider>
  );
};

export default App;
