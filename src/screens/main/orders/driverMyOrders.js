import {View, Text, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FlatListEmptyComponent, Header, Loader, OrderActionCard, Screen} from '../../../components';
import globalStyles from '../../../../globalStyles';
import {ROUTES} from '../../../utils/constants';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';
import {useDriverOrderActions} from '../../../hooks';

const DriverMyOrders = ({navigation}) => {
  const {handlePressNewOrder} = useDriverOrderActions();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = () => {
    const onSuccess = response => {
      if (response.success) {
        // console.log('Driver My Order: ', JSON.stringify(response));
        setOrders(response.data);
      }
    };

    callApi(API_METHODS.GET, API.getRiderMyOrders, null, onSuccess, onAPIError, setIsLoading);
  };

  return (
    <Screen>
      <Header title={'My Orders'} />
      <Loader isLoading={isLoading} />
      <FlatList
        data={orders}
        refreshing={false}
        onRefresh={getOrders}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<FlatListEmptyComponent label={isLoading ? '' : 'No Order'} isLabelHide={isLoading} />}
        renderItem={({item, index}) => (
          <OrderActionCard item={item} onPress={item => handlePressNewOrder(item, 'DRIVER_MY_ORDER')} type={'DRIVER_MY_ORDER'} isPriceShow={item?.orderType === 'simpleOrder'} />
        )}
        contentContainerStyle={[globalStyles.flexGrow1, globalStyles.screenPadding, globalStyles.inputsGap, globalStyles.screenPaddingBottom10]}
      />
    </Screen>
  );
};

export default DriverMyOrders;
