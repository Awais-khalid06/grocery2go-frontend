import {View, Image, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppButton, AppModal, AppScrollView, AppText, AppTextInput, Header, Loader, Screen, SuccessModal} from '../../../../components';
import {cartStyles, orderDetailStyles} from '../../styles';
import {ChatIcon, InfoBlueIcon, LocationGrayIcon} from '../../../../assets/icons';
import {COLORS, FONTS} from '../../../../utils/theme';
import CartItem from '../../../../components/UI/cartItem';
import {ROUTES} from '../../../../utils/constants';
import globalStyles from '../../../../../globalStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import commonAPI from '../../../../network/commonAPI';
import dayjs from 'dayjs';
import {getUserFullName, onAPIError} from '../../../../helpers';
import usePaymentSheetHandler from '../../../../hooks/usePaymentSheetHandler';

const UserOrderDetail = ({}) => {
  const navigation = useNavigation();
  const initializeAndPresentPaymentSheet = usePaymentSheetHandler();
  const route = useRoute();

  // PREV SCREEN PARAMS
  const params = route.params;
  const orderId = params?.orderId;

  const [orderArrivedModalShow, setOrderArrivedModalShow] = useState(false);
  const [orderCompleteModalShow, setOrderCompleteModalShow] = useState(false);
  const [order, setOrder] = useState({});
  const [orderStatus, setOrderStatus] = useState('');
  const [isDeliveryModalShow, setIsDeliveryModalShow] = useState(false);
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isProductListShow = true;

  // API RESULTS CONVERT TO KEYS
  const shopDetails = order?.shopDetailWithProduct || [];
  const orderSummary = order?.orderSummary || {};
  const shopIDsThatAcceptOrder = orderSummary?.shopAcceptedOrder || [];
  const shopIDsThatRejectOrder = orderSummary?.shopRejectedOrder || [];
  const riderDetail = order?.rider;
  const orderPaymentStatus = orderSummary?.paymentStatus;
  const deliveryPaymentStatus = orderSummary?.deliveryPaymentStatus;
  // console.log('ORDER:', order);
  useEffect(() => {
    getOrderDetail();
  }, [orderId]);

  const getOrderDetail = async () => {
    setIsFullScreenLoading(true);
    const response = await commonAPI.getOrderDetail(orderId);

    setIsFullScreenLoading(false);
    if (response.success) {
      const order = response.order;
      setOrderStatus(order.orderStatus);
      setOrder(order);
      // console.log('ORDER: ', JSON.stringify(order));
    }
  };

  const handlePressChatIcon = shop => {
    const shopOwnerId = shop?.ownerId;
    navigation.navigate(ROUTES.ChatRoom, {inboxId: shopOwnerId});
  };

  const getOneShopOrderStatus = shop => {
    const shopId = shop?.shopId;

    if (shopIDsThatAcceptOrder?.includes(shopId)) return 'Accepted';
    else if (shopIDsThatRejectOrder?.includes(shopId)) return 'Rejected';
    else return 'Pending';
  };

  const handlePayDeliveryCharges = async () => {
    setOrderArrivedModalShow(false);

    // PAYMENT SHEET HANDLE

    setIsLoading(true);
    const response = await commonAPI.riderPayDeliveryCharges(orderId);
    setIsLoading(false);

    // console.log('RES: ', JSON.stringify(response));

    if (response.success) {
      const {customer, clientSecret, id, metadata} = response?.data?.order?.paymentIntentData || {};
      const sheetData = {customerId: customer, clientSecret: clientSecret, paymentIntentId: id, orderId: metadata?.orderId};

      const onSuccessPayment = async () => {
        const verifyResponse = await commonAPI.verifyDeliveryPayment({
          paymentIntentId: sheetData?.paymentIntentId,
          orderId: sheetData?.orderId,
        });

        if (verifyResponse?.success) {
          setOrderCompleteModalShow(true);
          setOrder(prev => ({...prev, orderSummary: {...prev?.orderSummary, deliveryPaymentStatus: 'paid'}}));
        }
      };

      initializeAndPresentPaymentSheet(sheetData, onSuccessPayment);
    }
  };

  const ORDER_SUMMARY = [
    {title: 'Items Total', amount: `$${Number(orderSummary?.itemsTotal)?.toFixed(2)}`},
    {title: 'Delivery fee', amount: `$${5}`},
    {title: 'Service fee', amount: `$${4}`},
    {title: 'Admin Fee', amount: `$${3}`},
    {title: 'Sales Tax', amount: orderSummary?.salesTax?.toFixed?.(2) || 0.5},
    {title: 'Total Payment', amount: `$${Number(orderSummary?.totalPayment)?.toFixed?.(2)}`, status: orderSummary?.paymentStatus},
    // {title: 'Delivery Fee', amount: '$199.98', status: 'Unpaid'},
  ];

  if (isFullScreenLoading) {
    return (
      <Screen>
        <Header title={'Order Details'} />
        <Loader isLoading={isFullScreenLoading} />
      </Screen>
    );
  }

  const renderOrderStatus = () => {
    let status = orderStatus;

    return status;
  };

  return (
    <Screen>
      <Header title={'Order Details'} />
      <Loader isLoading={isLoading} />
      <AppScrollView>
        <View style={globalStyles.inputsGap}>
          {shopDetails.map((shop, index) => (
            <View key={index} style={orderDetailStyles.headContainer}>
              <View style={orderDetailStyles.headerContainer}>
                {shop?.image && <Image source={{uri: shop?.image}} style={orderDetailStyles.image} />}
                <View style={orderDetailStyles.contentText}>
                  <AppText fontFamily={FONTS.medium}>{shop?.shopTitle}</AppText>
                  <View style={orderDetailStyles.locationContainer}>
                    <LocationGrayIcon width={12} height={12} />
                    <AppText fontSize={12} greyText style={globalStyles.flex1}>
                      {shop?.location?.address}
                    </AppText>
                  </View>
                  <AppText fontSize={12} primary>
                    {getOneShopOrderStatus(shop)}
                  </AppText>
                </View>
                <Pressable onPress={() => handlePressChatIcon(shop)}>
                  <ChatIcon width={30} height={30} />
                </Pressable>
              </View>

              {isProductListShow && (
                <View style={{gap: 3}}>
                  <AppText fontFamily={FONTS.medium} style={{marginTop: 12}}>
                    Products
                  </AppText>
                  <View style={globalStyles.gap10}>
                    {shop?.products?.map((item, index) => (
                      <CartItem item={item} isCounter={false} isQuatity={true} isCrossIcon={false} key={index} />
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
        {riderDetail && (
          <View style={[{marginTop: 15, gap: 10}]}>
            <AppText fontFamily={FONTS.semiBold}>Driver</AppText>
            <View style={[orderDetailStyles.headContainer, {padding: '2%'}]}>
              <View style={orderDetailStyles.headerContainer}>
                <Image source={{uri: riderDetail?.image}} style={orderDetailStyles.image} />
                <View style={orderDetailStyles.contentText}>
                  <AppText fontFamily={FONTS.medium} fontSize={12}>
                    {getUserFullName(riderDetail?.firstName, riderDetail?.lastName)}
                  </AppText>
                </View>
                <Pressable onPress={() => navigation.navigate(ROUTES.ChatRoom, {inboxId: riderDetail?._id})}>
                  <ChatIcon width={30} height={30} />
                </Pressable>
              </View>
            </View>
          </View>
        )}

        <View style={[orderDetailStyles.rowItem, {marginTop: 15}]}>
          <AppText>Order Status</AppText>
          <AppText fontSize={12} primary>
            {renderOrderStatus()}
          </AppText>
        </View>

        <View style={[orderDetailStyles.rowItem, {marginTop: 15}]}>
          <AppText>Order Number</AppText>
          <AppText fontSize={12} greyText>
            {order?.orderNumber}
          </AppText>
        </View>

        <View style={[orderDetailStyles.orderSummary]}>
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
                    <View style={{backgroundColor: item.status === 'paid' ? COLORS.green : COLORS.danger, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 100}}>
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

        <View style={[cartStyles.deliveryTime, globalStyles.flex1]}>
          <AppTextInput
            // onPressRightIcon={() => setIsDeliveryModalShow(true)}
            editable={false}
            // RightIcon={ChevronIcon}
            placeholder="Delivery time"
            value={dayjs(orderSummary?.deliveryTime).format('hh:mm A')}
          />
        </View>

        {orderPaymentStatus === 'unpaid' && (
          <View style={orderDetailStyles.footerButtonContainer}>
            {/* <AppButton disabled={false} title={'Track'} onPress={() => navigation.navigate(ROUTES.OrderTrack)} /> */}
            {/* <AppButton disabled={false} title={'Pay Now'} onPress={() => navigation.navigate(ROUTES.AddTip)} /> */}
          </View>
        )}

        {riderDetail && deliveryPaymentStatus === 'unpaid' && orderPaymentStatus === 'paid' && (
          <View style={[orderDetailStyles.footerButtonContainer, {gap: 5}]}>
            <View style={[orderDetailStyles.rowElement, {marginTop: 5}]}>
              <InfoBlueIcon />
              <AppText fontSize={12} style={orderDetailStyles.blueText}>
                Just pay delivery charges via app when rider arrive
              </AppText>
            </View>
            <AppButton title={'Pay delivery Charges'} onPress={() => setOrderArrivedModalShow(true)} />
          </View>
        )}
      </AppScrollView>

      <AppModal isVisible={orderArrivedModalShow} setIsVisible={setOrderArrivedModalShow}>
        <View style={globalStyles.modalContainer}>
          <AppText fontFamily={FONTS.semiBold} fontSize={18}>
            Rider Arrived
          </AppText>
          <AppText greyText style={[orderDetailStyles.textCenter, orderDetailStyles.marginTopBottom]}>
            Lorem ipsum dolor sit amet consectetur. Interdum tempor nisi metus vulputate.
          </AppText>
          <AppButton title={'Pay Delivery Charges'} onPress={handlePayDeliveryCharges} />
        </View>
      </AppModal>

      <SuccessModal
        heading={'Order Completed'}
        description={'Add feedback for rider'}
        buttonTitle={'Add Feedback'}
        onPressButton={() => {
          setOrderCompleteModalShow(false);
          setTimeout(() => {
            navigation.replace(ROUTES.AddFeedback, {riderId: riderDetail?._id});
          }, 200);
        }}
        setIsVisible={setOrderCompleteModalShow}
        isVisible={orderCompleteModalShow}
      />
    </Screen>
  );
};

export default UserOrderDetail;
