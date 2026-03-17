import {FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FlatListEmptyComponent, Header, Loader, OrderActionCard, Screen} from '../../../components';
import globalStyles from '../../../../globalStyles';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';
import {useSelector} from 'react-redux';
import {userSelector} from '../../../redux/selectors';
import {useAccountType} from '../../../hooks';

const CompletedOrders = () => {
  const user = useSelector(userSelector);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {isDriver} = useAccountType();

  useEffect(() => {
    getCompletedOrders();
  }, []);

  const getCompletedOrders = () => {
    const userId = user?._id;
    const myShopId = user?.shopId;

    const onSuccess = response => {
      if (response.success) {
        setOrders(response?.orders);
      }
    };

    let endpoint = isDriver ? `${API.riderCompletedOrders}/${userId}` : `${API.shopCompletedOrders}/${myShopId}`;
    callApi(API_METHODS.GET, endpoint, null, onSuccess, onAPIError, setIsLoading);
  };

  return (
    <Screen>
      <Header title={'Completed Orders'} />
      <Loader isLoading={isLoading} />
      <FlatList
        data={orders}
        keyExtractor={(item, index) => item?._id}
        renderItem={({item, index}) => <OrderActionCard item={item} type={'COMPLETED_ORDER'} />}
        contentContainerStyle={[globalStyles.flexGrow1, globalStyles.screenPadding, globalStyles.inputsGap, globalStyles.screenPaddingBottom10]}
        ListEmptyComponent={<FlatListEmptyComponent label={isLoading ? '' : 'No Order'} />}
      />
    </Screen>
  );
};

export default CompletedOrders;
