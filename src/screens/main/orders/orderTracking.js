import {FlatList} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {AppText, FlatListEmptyComponent, Header, Loader, OrderCard, Screen} from '../../../components';
import globalStyles from '../../../../globalStyles';
import {FONTS} from '../../../utils/theme';
import {ROUTES} from '../../../utils/constants';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';

const getOrderTimestamp = order => {
  const parsedTime = new Date(order?.createdAt || order?.updatedAt || '').getTime();
  return Number.isFinite(parsedTime) ? parsedTime : 0;
};

const sortOrdersLatestFirst = list => {
  const safeList = Array.isArray(list) ? [...list] : [];
  return safeList.sort((a, b) => getOrderTimestamp(b) - getOrderTimestamp(a));
};

const isCompletedOrder = item => {
  const status = String(item?.orderStatus || '').trim().toLowerCase();
  return status === 'completed' || status.includes('completed');
};

const OrderTracking = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const getNewOrders = useCallback(() => {
    const onSuccess = response => {
      // console.log('ORDER TRACKINGS:', JSON.stringify(response));
      const safeOrders = Array.isArray(response?.data) ? response.data : [];
      const activeOrders = safeOrders.filter(item => !isCompletedOrder(item));
      setOrders(sortOrdersLatestFirst(activeOrders));
    };
    callApi(API_METHODS.GET, API.userNewOrders, null, onSuccess, onAPIError, setIsLoading);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getNewOrders();
    }, [getNewOrders]),
  );

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
