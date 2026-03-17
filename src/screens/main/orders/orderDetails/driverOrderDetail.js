import {View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppButton, AppScrollView, AppText, Header, Loader, OrderActionCard, Screen} from '../../../../components';
import {cartStyles, orderDetailStyles} from '../../styles';
import {COLORS, FONTS} from '../../../../utils/theme';
import globalStyles from '../../../../../globalStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import commonAPI from '../../../../network/commonAPI';
import {useDispatch, useSelector} from 'react-redux';
import {driverOrderDetailSelector, userSelector} from '../../../../redux/selectors';
import {useDriverOrderActions} from '../../../../hooks';
import {getUserFullName} from '../../../../helpers';
import {ROUTES} from '../../../../utils/constants';
import {driverOrdersActions} from '../../../../redux/slices/driver/driverOrders';

// THIS COMPONENT ONLY HANDLE SIMPLE ORDER
const DriverOrderDetail = () => {
  const route = useRoute();
  const params = route.params;
  const orderId = params?.orderId;
  const orderType = params?.orderType;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {handleAcceptRejectOrder} = useDriverOrderActions();
  const user = useSelector(userSelector);
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const order = useSelector(driverOrderDetailSelector) || {};
  // console.log('ORDER:', order);
  const orderSummary = order?.orderSummary || {};
  const shops = order?.shopDetailWithProduct || [];
  // const pickupLocationText = orderSummaryDetail?.startLocation?.address;
  // const devliveryLocationText = orderSummaryDetail?.endLocation?.address;
  const shopIDsThatAcceptOrder = orderSummary?.shopAcceptedOrder || [];
  const shopIDsThatRejectOrder = orderSummary?.shopRejectedOrder || [];
  const customerDeliveryLocation = orderSummary?.endLocation?.address;

  const totaItems = orderSummary?.totalItems;
  let ORDER_SUMMARY = [
    {title: 'Items', amount: totaItems},
    {title: 'Total Payment', amount: `$${Number(orderSummary?.totalPayment)?.toFixed?.(2)}`},
  ];

  useEffect(() => {
    getOrderDetail();
  }, [orderId]);

  const getOrderDetail = async () => {
    setIsFullScreenLoading(true);
    const response = await commonAPI.getOrderDetail(orderId);
    // console.log('reSS:', JSON.stringify(response));
    setIsFullScreenLoading(false);
    if (response.success) {
      dispatch(driverOrdersActions.setOrderDetail(response?.order));
    }
  };

  const getOneShopOrderStatus = shop => {
    const shopId = shop?.shopId;

    if (shopIDsThatAcceptOrder?.includes(shopId)) return 'Accepted';
    else if (shopIDsThatRejectOrder?.includes(shopId)) return 'Rejected';
    else return 'Pending';
  };

  const handlePressNavigate = (shop, type) => {
    if (type === 'SHOP') {
      const shopId = shop?.shopId;

      if (shopId) navigation.navigate(ROUTES.MapNavigete, {orderId, shopId, navigateLocation: shop?.location});

      return;
    }

    if (type === 'CUSTOMER') {
      navigation.navigate(ROUTES.MapNavigete, {orderId, customerLocation: orderSummary?.endLocation, navigateLocation: orderSummary?.endLocation});
    }
  };

  const handleOrderCompleted = async () => {
    setIsLoading(true);
    const response = await commonAPI.updateOrderStatus(orderId, 'completed');
    setIsLoading(false);

    console.log('Completed: ', response);

    if (response.success) {
      navigation.goBack();
    }
  };

  const isOrderPickedFromAllShops = shops.every(s => s?.isOrderPickedUp == true);

  if (isFullScreenLoading) {
    return (
      <Screen>
        <Header title={'Order Details'} />
        <Loader isLoading={true} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title={'Order Details'} />
      <Loader isLoading={isLoading} />
      <AppScrollView>
        <OrderActionCard type={'DRIVER_NEW_ORDER'} item={order} loggedInUserLocation={user?.location} isAcceptRejectButtonsShow={false} />
        <View style={[orderDetailStyles.orderSummary, {flex: undefined}]}>
          <AppText fontFamily={FONTS.semiBold} fontSize={16}>
            Order Summary
          </AppText>
          <View style={cartStyles.orderSummaryContainer}>
            {ORDER_SUMMARY.map((item, index) => (
              <View key={index} style={cartStyles.listItem}>
                <AppText fontSize={12}>{item.title}</AppText>
                <View style={orderDetailStyles.rowElement}>
                  <AppText fontFamily={FONTS.semiBold} fontSize={12}>
                    {item.amount}
                  </AppText>
                  {item.status ? (
                    <View style={{backgroundColor: item.status === 'Paid' ? COLORS.green : COLORS.danger, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 100}}>
                      <AppText fontSize={12} style={{color: COLORS.white}}>
                        {item.status}
                      </AppText>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </View>

        {shops?.length > 0 && (
          <View style={[{marginTop: 15, gap: 10}]}>
            <AppText fontFamily={FONTS.semiBold}>Shops</AppText>
            {shops.map((shop, index) => (
              <View key={index} style={[orderDetailStyles.headContainer]}>
                <View style={orderDetailStyles.headerContainer}>
                  {shop?.image && <Image source={{uri: shop?.image}} style={orderDetailStyles.image} />}
                  <View style={orderDetailStyles.contentText}>
                    <AppText fontFamily={FONTS.medium} fontSize={12}>
                      {shop?.shopTitle}
                    </AppText>
                    <AppText greyText fontSize={12}>
                      {shop?.location?.address}
                    </AppText>
                  </View>
                  <AppText fontFamily={FONTS.medium} fontSize={12}>
                    {getOneShopOrderStatus(shop)}
                  </AppText>
                </View>

                {orderType !== 'NEW' && (
                  <View style={orderDetailStyles.marginTop20}>
                    {shop?.isOrderPickedUp ? (
                      <AppText fontSize={12} primary>
                        Order Picked
                      </AppText>
                    ) : (
                      <AppButton title={'Navigate'} containerStyle={orderDetailStyles.shopButton} textStyle={{fontSize: 12}} onPress={() => handlePressNavigate(shop, 'SHOP')} />
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={[{marginTop: 15, gap: 10}]}>
          <AppText fontFamily={FONTS.semiBold}>Customer</AppText>

          <View style={[orderDetailStyles.headContainer]}>
            <View style={orderDetailStyles.headerContainer}>
              {order?.customer?.image && <Image source={{uri: order?.customer?.image}} style={orderDetailStyles.image} />}
              <View style={orderDetailStyles.contentText}>
                <AppText fontFamily={FONTS.medium} fontSize={12}>
                  {getUserFullName(order?.customer?.firstName, order?.customer?.lastName)}
                </AppText>
                <AppText greyText fontSize={12}>
                  {customerDeliveryLocation}
                </AppText>
              </View>
            </View>
            {orderType !== 'NEW' && isOrderPickedFromAllShops && order?.riderStatus !== 'Arrived' && (
              <View style={orderDetailStyles.marginTop20}>
                <AppButton title={'Navigate'} containerStyle={orderDetailStyles.shopButton} textStyle={{fontSize: 12}} onPress={() => handlePressNavigate(null, 'CUSTOMER')} />
              </View>
            )}
          </View>
        </View>

        <View style={[orderDetailStyles.rowItem, {marginTop: 15}, globalStyles.flex1]}>
          <AppText>Order Status</AppText>
          <AppText fontSize={12} primary>
            {order?.orderStatus}
          </AppText>
        </View>

        {/* <View style={[globalStyles.flex1, {marginTop: 20}]}>
          <View style={orderDetailStyles.distanceItem}>
            <LocationCircle1Icon width={40} height={40} />
            <View>
              <AppText fontFamily={FONTS.medium}>Pick Up Location</AppText>
              <AppText greyText fontSize={12}>
                {pickupLocationText}
              </AppText>
            </View>
          </View>
          <View style={orderDetailStyles.distanceDotsBar} />
          <View style={orderDetailStyles.distanceItem}>
            <TruckCircleIcon width={40} height={40} />
            <View>
              <AppText fontFamily={FONTS.medium}>Delivery Location</AppText>
              <AppText greyText fontSize={12}>
                {devliveryLocationText}
              </AppText>
            </View>
          </View>
        </View> */}

        {orderSummary?.deliveryPaymentStatus === 'paid' && order?.orderStatus !== 'completed' && (
          <View style={[orderDetailStyles.buttonsContainer, {marginTop: 15}, globalStyles.bottomButton]}>
            <AppButton title={'Order Completed'} onPress={handleOrderCompleted} />
          </View>
        )}

        {orderType === 'NEW' && (
          <View style={[orderDetailStyles.buttonsContainer, {marginTop: 0}, globalStyles.bottomButton]}>
            <AppButton title={'Accept'} onPress={() => handleAcceptRejectOrder(order, 'accept', true)} containerStyle={orderDetailStyles.button} transparentButton={true} />
            <AppButton title={'Reject'} onPress={() => handleAcceptRejectOrder(order, 'reject', true)} containerStyle={orderDetailStyles.button} />
          </View>
        )}
      </AppScrollView>
    </Screen>
  );
};

export default DriverOrderDetail;
