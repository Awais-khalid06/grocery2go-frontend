import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';
import auth from './slices/auth';
import customerHome from './slices/customer/customerHome';
import customerCart from './slices/customer/customerCart';
import common from './slices/common';
import shopOwnerProduct from './slices/shopOwner/shopOwnerProduct';
import customerList from './slices/customer/customerList';
import shopOwnerOrders from './slices/shopOwner/shopOwnerOrders';
import driverOrders from './slices/driver/driverOrders';
import orderSummary from './slices/OrderSummarySlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'customerCart'],
};

const reducer = combineReducers({
  auth,
  customerHome,
  customerCart,
  common,
  shopOwnerProduct,
  customerList,
  shopOwnerOrders,
  driverOrders,
  orderSummary,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
