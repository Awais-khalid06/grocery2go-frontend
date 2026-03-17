import React from 'react';
import {useAccountType} from '../../../../hooks';
import UserOrderDetail from './userOrderDetail';
import ShopOwnerOrderDetail from './shopOwnerOrderDetail';
import DriverOrderDetail from './driverOrderDetail';

const OrderDetails = ({}) => {
  const {isGroceryOwner, isCustomer, isDriver} = useAccountType();

  if (isCustomer) return <UserOrderDetail />;
  else if (isGroceryOwner) return <ShopOwnerOrderDetail />;
  else if (isDriver) return <DriverOrderDetail />;
};

export default OrderDetails;
