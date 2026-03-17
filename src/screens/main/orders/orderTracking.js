import {FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppText, FlatListEmptyComponent, Header, Loader, OrderCard, Screen} from '../../../components';
import globalStyles from '../../../../globalStyles';
import {FONTS} from '../../../utils/theme';
import {ROUTES} from '../../../utils/constants';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';

const OrderTracking = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getNewOrders();
  }, []);

  const getNewOrders = () => {
    const onSuccess = response => {
      // console.log('ORDER TRACKINGS:', JSON.stringify(response));
      setOrders(response.data);
    };
    callApi(API_METHODS.GET, API.userNewOrders, null, onSuccess, onAPIError, setIsLoading);
  };

  const handlePressItem = item => {
    if (item?.orderType === 'listOrder') return navigation.navigate(ROUTES.UserListOrderDetail, {orderId: item?._id});

    navigation.navigate(ROUTES.OrderDetails, {orderId: item?._id});
  };

  return (
    <Screen>
      <Header title={'Orders Tracking'} />
      <Loader isLoading={isLoading} />

      <AppText style={[globalStyles.screenPadding]} fontFamily={FONTS.medium}>
        Total Item ({orders?.length})
      </AppText>
      <FlatList
        data={orders}
        refreshing={false}
        onRefresh={getNewOrders}
        ListEmptyComponent={<FlatListEmptyComponent isLabelHide={isLoading} label={'No Order'} />}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => <OrderCard onPressChatIcon={() => navigation.navigate(ROUTES.ChatRoom)} item={item} onPress={handlePressItem} />}
        contentContainerStyle={[globalStyles.screenPadding, globalStyles.flexGrow1, globalStyles.inputsGap, globalStyles.screenPaddingTop10, globalStyles.screenPaddingBottom10]}
      />
    </Screen>
  );
};

export default OrderTracking;
