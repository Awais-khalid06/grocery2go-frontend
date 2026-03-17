import React, {useEffect} from 'react';
import {useAccountType} from '../../../hooks';
import UserHome from './userHome';
import ShopOwnerHome from './shopOwnerHome';
import DriverHome from './driverHome';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';
import {useDispatch} from 'react-redux';
import {orderSummaryActions} from '../../../redux/slices/OrderSummarySlice';

const Home = ({navigation}) => {
  // const dispatch = useDispatch();
  const {isCustomer, isGroceryOwner, isDriver} = useAccountType();

  // useEffect(() => {
  //   getTaxes()
  // }, [])

  // const getTaxes = () => {
  //   const onSuccess = (response) => {
  //     console.log('res:', response)
  //     // dispatch(orderSummaryActions.setTaxes(response?.data))

  //   }

  //   callApi(API_METHODS.GET, API.getTaxes, null, onSuccess, onAPIError)
  // }

  if (isCustomer) return <UserHome />;
  else if (isGroceryOwner) return <ShopOwnerHome />;
  else if (isDriver) return <DriverHome />;
};

export default Home;
