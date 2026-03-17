import {View, Image, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppButton, AppModal, AppScrollView, AppText, AppTextInput, Header, Loader, Screen, SuccessModal} from '../../../../components';
import {cartStyles, listStyles, orderDetailStyles} from '../../styles';
import {ChatIcon, CheckCircleIcon, ChevronIcon, LocationGrayIcon, UnCheckCircleIcon} from '../../../../assets/icons';
import {COLORS, FONTS} from '../../../../utils/theme';
import CartItem from '../../../../components/UI/cartItem';
import {ROUTES} from '../../../../utils/constants';
import globalStyles from '../../../../../globalStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import commonAPI from '../../../../network/commonAPI';
import {getUserFullName, navigateToChatRoom, onAPIError} from '../../../../helpers';
import {useShopOrderActions} from '../../../../hooks';
import {useDispatch, useSelector} from 'react-redux';
import {shopOrderDetailSelector, userSelector} from '../../../../redux/selectors';
import {shopOwnerOrderActions} from '../../../../redux/slices/shopOwner/shopOwnerOrders';
import {API_METHODS, callApi} from '../../../../network/NetworkManger';
import {API} from '../../../../network/Environment';

const ShopOwnerOrderDetail = () => {
  const route = useRoute();
  const params = route.params;
  const orderType = params?.orderType; // NEW
  const orderId = params?.orderId;

  const dispatch = useDispatch();
  const user = useSelector(userSelector) || {};
  const navigation = useNavigation();
  const {handleAcceptRejectOrder} = useShopOrderActions();
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [orderArrivedModalShow, setOrderArrivedModalShow] = useState(false);
  const [orderCompleteModalShow, setOrderCompleteModalShow] = useState(false);
  const order = useSelector(shopOrderDetailSelector) || {};

  const myShopId = user?.shopId;
  const customerDetail = order?.customer || {};
  const orderNumber = order?.orderNumber;
  const myShop = order?.shopDetailWithProduct?.find?.(p => p.shopId == myShopId); // Find my shop from shop details
  const productDetail = myShop?.products || [];
  const myShopOrderSummaryDetail = myShop?.shopOrderSummary || {};
  const deliveryLocationText = order.orderSummary?.endLocation?.address;
  const isMyOrderReadyForPickup = myShop?.isOrderReadyForPickup;

  useEffect(() => {
    getOrderDetail();

    return () => {
      dispatch(shopOwnerOrderActions.removeOrderDetail());
    };
  }, [orderId]);

  const getOrderDetail = async () => {
    setIsFullScreenLoading(true);
    const response = await commonAPI.getOrderDetail(orderId);
    // console.log('GET ORDER: ', JSON.stringify(response));
    setIsFullScreenLoading(false);
    if (response.success) {
      dispatch(shopOwnerOrderActions.setOrderDetail(response?.order));
    }
  };

  const ORDER_SUMMARY = [
    {title: 'Items', amount: `${myShopOrderSummaryDetail?.shopItems}`},
    {title: 'Total Payment', amount: `$${Number(myShopOrderSummaryDetail?.shopItemsTotal)?.toFixed?.(2)}`},
  ];

  const handleReadyForPickup = () => {
    const onSuccess = response => {
      const shopWithProducts = order?.shopDetailWithProduct.map(s => ({...s}));
      const shopIndex = shopWithProducts.findIndex(s => s.shopId == myShopId);

      if (shopIndex > -1) {
        shopWithProducts[shopIndex].isOrderReadyForPickup = true;
        dispatch(shopOwnerOrderActions.updateOrderDetail({shopDetailWithProduct: shopWithProducts}));
      }
    };

    const data = {orderId, shopId: myShopId};
    callApi(API_METHODS.POST, API.shopReadyForPickupStatusUpdate, data, onSuccess, onAPIError, setIsLoading);
  };

  const handlePressChatIcon = () => {
    const customerId = customerDetail?._id;
    if (customerId) navigation.navigate(ROUTES.ChatRoom, {inboxId: customerId});
  };

  if (isFullScreenLoading) {
    return (
      <Screen>
        <Header title={'Order Details'} />
        <Loader isLoading={isFullScreenLoading} />
      </Screen>
    );
  }

  const renderBottomActionButtons = () => {
    if (orderType === 'NEW') {
      return (
        <View style={[orderDetailStyles.rowButtonsContainer, {marginVertical: 15}]}>
          <AppButton title={'Accept'} onPress={() => handleAcceptRejectOrder(order, 'accept', true)} containerStyle={orderDetailStyles.rowButton} transparentButton={true} />
          <AppButton title={'Reject'} onPress={() => handleAcceptRejectOrder(order, 'reject', true)} containerStyle={orderDetailStyles.rowButton} />
        </View>
      );
    }

    if (!isMyOrderReadyForPickup) {
      return (
        <View style={orderDetailStyles.footerButtonContainer}>
          <AppButton disabled={false} title={'Ready For Pickup'} onPress={handleReadyForPickup} />
        </View>
      );
    }
  };

  const driverDetail = order?.rider;

  return (
    <Screen>
      <Header title={'Order Details'} />
      <Loader isLoading={isLoading} />
      <AppScrollView>
        <View style={orderDetailStyles.headContainer}>
          <View style={orderDetailStyles.headerContainer}>
            {customerDetail?.image && <Image source={{uri: customerDetail?.image}} style={orderDetailStyles.image} />}
            <View style={orderDetailStyles.contentText}>
              <AppText fontFamily={FONTS.medium}>{getUserFullName(customerDetail.firstName, customerDetail.lastName)}</AppText>
              <View style={orderDetailStyles.locationContainer}>
                <LocationGrayIcon width={12} height={12} />
                <AppText fontSize={12} greyText>
                  {deliveryLocationText}
                </AppText>
              </View>
            </View>
            <Pressable onPress={handlePressChatIcon}>
              <ChatIcon width={30} height={30} />
            </Pressable>
          </View>

          <View style={[orderDetailStyles.rowItem, {marginTop: 15}]}>
            <AppText>Order Number</AppText>
            <AppText fontSize={12} greyText>
              {orderNumber}
            </AppText>
          </View>

          <View style={{gap: 3}}>
            <AppText fontFamily={FONTS.medium} style={{marginTop: 12}}>
              Products
            </AppText>
            <View style={{gap: 10}}>
              {productDetail.map((item, index) => (
                <CartItem item={item} isCounter={false} isQuatity={true} isCrossIcon={false} key={index} />
              ))}
            </View>
          </View>
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

        {driverDetail && (
          <View style={[{marginTop: 15, gap: 10}]}>
            <AppText fontFamily={FONTS.semiBold}>Driver</AppText>
            <View style={[orderDetailStyles.headContainer, {padding: '2%'}]}>
              <View style={orderDetailStyles.headerContainer}>
                <Image source={{uri: driverDetail?.image}} style={orderDetailStyles.image} />
                <View style={orderDetailStyles.contentText}>
                  <AppText fontFamily={FONTS.medium} fontSize={12}>
                    {getUserFullName(driverDetail?.firstName, driverDetail?.lastName)}
                  </AppText>
                </View>
                <Pressable onPress={() => navigateToChatRoom({navigation, inboxId: driverDetail?._id})}>
                  <ChatIcon width={30} height={30} />
                </Pressable>
              </View>
            </View>
          </View>
        )}

        <View style={[orderDetailStyles.rowItem, {marginTop: 15}]}>
          <AppText>Order Status</AppText>
          <AppText fontSize={12} primary>
            {order?.orderStatus}
          </AppText>
        </View>

        <View style={globalStyles.flex1} />

        {renderBottomActionButtons()}
      </AppScrollView>

      <AppModal isVisible={orderArrivedModalShow} setIsVisible={setOrderArrivedModalShow}>
        <View style={globalStyles.modalContainer}>
          <AppText fontFamily={FONTS.semiBold} fontSize={18}>
            Rider Arrived
          </AppText>
          <AppText greyText style={[orderDetailStyles.textCenter, orderDetailStyles.marginTopBottom]}>
            Lorem ipsum dolor sit amet consectetur. Interdum tempor nisi metus vulputate.
          </AppText>
          <AppButton
            title={'Pay Delivery Charges'}
            onPress={() => {
              setOrderArrivedModalShow(false);
              setOrderCompleteModalShow(true);
            }}
          />
        </View>
      </AppModal>

      <SuccessModal
        heading={'Order Completed'}
        description={'Add feedback for rider'}
        buttonTitle={'Add Feedback'}
        onPressButton={() => {
          setOrderCompleteModalShow(false);
          navigation.replace(ROUTES.AddFeedback);
        }}
        setIsVisible={setOrderCompleteModalShow}
        isVisible={orderCompleteModalShow}
      />
    </Screen>
  );
};

export default ShopOwnerOrderDetail;
