import {View, FlatList, Image, Pressable} from 'react-native';
import React, {useCallback, useState} from 'react';
import {AppText, FlatListEmptyComponent, Header, Loader, Screen} from '../../../components';
import {orderDetailStyles} from '../styles';
import {FONTS} from '../../../utils/theme';
import {ChatIcon, LocationGrayIcon} from '../../../assets/icons';
import CartItem from '../../../components/UI/cartItem';
import globalStyles from '../../../../globalStyles';
import {ROUTES} from '../../../utils/constants';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {formatOrderPlacedDate, getUserFullName, onAPIError} from '../../../helpers';
import {useSelector} from 'react-redux';
import {userSelector} from '../../../redux/selectors';
import {useFocusEffect} from '@react-navigation/native';

const isCompletedOrder = item => {
  const status = String(item?.orderStatus || '').trim().toLowerCase();
  return status === 'completed' || status.includes('completed');
};

const ShopMyOrders = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(userSelector);

  const getOrders = useCallback(() => {
    const onSuccess = response => {
      // console.log('RES::', JSON.stringify(response));
      const safeOrders = Array.isArray(response?.data) ? response.data : [];
      const activeOrders = safeOrders.filter(item => !isCompletedOrder(item)).reverse();
      setOrders(activeOrders);
    };

    callApi(API_METHODS.GET, `${API.getShopAcceptedOrders}`, null, onSuccess, onAPIError, setIsLoading);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getOrders();
    }, [getOrders]),
  );

  const handlePressOrder = item => {
    navigation.navigate(ROUTES.OrderDetails, {orderId: item._id});
  };

  const handlePressChatIcon = item => {
    const customerId = item?.customer?._id;
    if (customerId) navigation.navigate(ROUTES.ChatRoom, {inboxId: customerId});
  };

  return (
    <Screen>
      <Header title={'My Orders'} />
      <Loader isLoading={isLoading} />
      <FlatList
        data={orders}
        refreshing={false}
        onRefresh={getOrders}
        ListEmptyComponent={<FlatListEmptyComponent label={isLoading ? '' : 'No Order'} />}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => <OrderInProcess item={item} onPress={handlePressOrder} onPressChatIcon={handlePressChatIcon} />}
        contentContainerStyle={[globalStyles.flexGrow1, globalStyles.screenPadding, globalStyles.inputsGap, globalStyles.screenPaddingBottom10]}
      />
    </Screen>
  );
};

const OrderInProcess = ({item, onPress, onPressChatIcon}) => {
  const deliveryLocationText = item?.orderSummary?.endLocation?.address;
  const customerName = getUserFullName(item?.customer?.firstName, item?.customer?.lastName);
  const orderNumber = item?.orderNumber;
  const orderStatus = item?.orderStatus;
  const placedOn = formatOrderPlacedDate(item);
  const customerImageUri = item?.customer?.image;
  const products = item?.shopDetails?.[0]?.products || [];

  return (
    <Pressable onPress={() => onPress?.(item)} style={orderDetailStyles.headContainer}>
      <View style={orderDetailStyles.headerContainer}>
        {customerImageUri && <Image source={{uri: customerImageUri}} style={orderDetailStyles.image} />}
        <View style={orderDetailStyles.contentText}>
          <AppText fontFamily={FONTS.medium}>{customerName}</AppText>
          <View style={orderDetailStyles.locationContainer}>
            <LocationGrayIcon width={12} height={12} />
            <AppText fontSize={12} greyText>
              {deliveryLocationText}
            </AppText>
          </View>
        </View>
        <Pressable onPress={() => onPressChatIcon(item)}>
          <ChatIcon width={30} height={30} />
        </Pressable>
      </View>

      <View style={[orderDetailStyles.rowItem, {marginTop: 15}]}>
        <AppText>Order Number</AppText>
        <AppText fontSize={12} greyText>
          {orderNumber}
        </AppText>
      </View>

      <View style={[orderDetailStyles.rowItem, {marginTop: 10}]}>
        <AppText>Placed On</AppText>
        <AppText fontSize={12} greyText>
          {placedOn}
        </AppText>
      </View>

      <View style={[orderDetailStyles.rowItem, {marginTop: 15}]}>
        <AppText>Status</AppText>
        <AppText fontSize={12} primary>
          {orderStatus}
        </AppText>
      </View>

      <View style={{gap: 3}}>
        <AppText fontFamily={FONTS.medium} style={{marginTop: 12}}>
          Products ({products?.length})
        </AppText>
        <View style={{gap: 10}}>
          {products.slice(0, 2).map((item, index) => (
            <CartItem item={item} isCounter={false} isQuatity={true} isCrossIcon={false} key={index} />
          ))}
        </View>
      </View>
    </Pressable>
  );
};

export default ShopMyOrders;
