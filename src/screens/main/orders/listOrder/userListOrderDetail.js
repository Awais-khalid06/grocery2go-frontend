import {View, Image, Pressable, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppButton, AppScrollView, AppText, AppTextInput, Header, Loader, Screen, SuccessModal} from '../../../../components';
import {FONTS} from '../../../../utils/theme';
import {listStyles, orderDetailStyles} from '../../styles';
import {ChatIcon, LocationGrayIcon, TickGreenCircleIcon, CloseRedCircleIcon, InfoBlueIcon} from '../../../../assets/icons';
import globalStyles from '../../../../../globalStyles';
import commonAPI from '../../../../network/commonAPI';
import {getUserFullName, onAPIError} from '../../../../helpers';
import {ROUTES} from '../../../../utils/constants';
import {API_METHODS, callApi} from '../../../../network/NetworkManger';
import {API} from '../../../../network/Environment';
import usePaymentSheetHandler from '../../../../hooks/usePaymentSheetHandler';

const UserListOrderDetail = ({navigation, route}) => {
  const params = route?.params;

  const initializeAndPresentPaymentSheet = usePaymentSheetHandler();
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const [isWithContentLoading, setIsWithContentLoading] = useState(false);
  const [order, setOrder] = useState({});
  const [paymentDoneModalShow, setPaymentDoneModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const orderId = params?.orderId;
  const rider = order?.rider || {};
  const riderImage = rider?.image;
  const riderFullName = getUserFullName(rider?.firstName, rider?.lastName);
  const deliveryLocation = rider?.location?.address;
  const orderNumber = order?.orderNumber;

  const orderSummary = order?.orderSummary || {};
  const groceryList = orderSummary?.listItems;

  const paymentStatus = orderSummary?.paymentStatus;
  const deliveryPaymentStatus = orderSummary?.deliveryPaymentStatus;

  useEffect(() => {
    getOrderDetail();
  }, [orderId]);
  // console.log('ORDERID', orderId);
  const getOrderDetail = async () => {
    setIsFullScreenLoading(true);
    const response = await commonAPI.getOrderDetail(orderId);

    // console.log('LIST ORDER DETAIL: ', JSON.stringify(response));

    setIsFullScreenLoading(false);
    if (response.success) {
      setOrder(response?.order);
    }
  };

  const handlePayNow = () => {
    const onSuccess = async response => {
      const {paymentIntent} = response.data;
      const data = {paymentIntentId: paymentIntent.id, customerId: paymentIntent?.customer, clientSecret: paymentIntent?.clientSecret, orderId};

      const onSuccessPayment = async () => {
        const verifyResponse = await commonAPI.verifyOrderPayment({
          paymentIntentId: data?.paymentIntentId,
          orderId: data?.orderId,
        });

        if (verifyResponse.success) {
          setOrder({...order, orderSummary: {...order?.orderSummary, paymentStatus: 'paid'}});
        }
      };

      initializeAndPresentPaymentSheet(data, onSuccessPayment);
    };

    const data = {orderId};
    callApi(API_METHODS.POST, API.customerPayListBill, data, onSuccess, onAPIError, setIsWithContentLoading);
  };

  const handleNavigate = () => {};

  const handlePressTrack = () => {};

  const handlePayDeliveryCharges = async () => {
    // PAYMENT SHEET HANDLE

    setIsWithContentLoading(true);
    const response = await commonAPI.riderPayDeliveryCharges(orderId);
    setIsWithContentLoading(false);

    if (response.success) {
      const {customer, clientSecret, id, metadata} = response?.data?.order?.paymentIntentData || {};
      const sheetData = {customerId: customer, clientSecret: clientSecret, paymentIntentId: id, orderId: metadata?.orderId};

      const onSuccessPayment = async () => {
        const verifyResponse = await commonAPI.verifyDeliveryPayment({
          paymentIntentId: sheetData?.paymentIntentId,
          orderId: sheetData?.orderId,
        });

        if (verifyResponse?.success) {
          setOrder(prev => ({...prev, orderSummary: {...prev?.orderSummary, deliveryPaymentStatus: 'paid'}}));
        }
      };

      initializeAndPresentPaymentSheet(sheetData, onSuccessPayment);
    }
  };

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
      <Loader isLoading={isWithContentLoading} />
      <AppScrollView>
        <View style={orderDetailStyles.headContainer}>
          <View style={{gap: 3}}>
            <View style={orderDetailStyles.headerContainer}>
              {riderImage && <Image source={{uri: riderImage}} style={orderDetailStyles.image} />}
              <View style={orderDetailStyles.contentText}>
                <AppText fontFamily={FONTS.medium}>{riderFullName}</AppText>
                <View style={orderDetailStyles.locationContainer}>
                  <LocationGrayIcon width={12} height={12} />
                  <AppText fontSize={12} greyText>
                    {deliveryLocation}
                  </AppText>
                </View>
              </View>
              <Pressable onPress={() => navigation.navigate(ROUTES.ChatRoom, {inboxId: rider?._id})}>
                <ChatIcon width={30} height={30} />
              </Pressable>
            </View>

            <View style={[orderDetailStyles.rowItem, {marginTop: 15}]}>
              <AppText>Order Number</AppText>
              <AppText fontSize={12} greyText>
                {orderNumber}
              </AppText>
            </View>

            <AppText fontFamily={FONTS.medium} style={{marginTop: 12}}>
              Grocery List
            </AppText>
            <View style={[listStyles.allLists]}>
              {groceryList?.map?.((item, index) => (
                <View key={index} style={listStyles.listItem}>
                  <View style={listStyles.listItemLeftContent}>
                    <AppText>1</AppText>
                    <AppText greyText fontSize={12}>
                      {item?.productName}
                    </AppText>
                  </View>
                  <View style={[orderDetailStyles.rowElement, {gap: 10}]}>
                    <AppText fontSize={12} greyText>
                      {item?.quantity}
                    </AppText>

                    {item?.isAvailable ? <TickGreenCircleIcon width={20} height={20} /> : <CloseRedCircleIcon width={20} height={20} />}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={orderDetailStyles.orderStatusContainer}>
          <AppText fontFamily={FONTS.semiBold}>Order Status</AppText>
          <AppText primary fontSize={12}>
            {order?.orderStatus}
          </AppText>
        </View>

        <View style={{gap: 10, marginTop: 20, flex: 1}}>
          <AppText fontFamily={FONTS.semiBold}>Order Summary</AppText>
          <View style={orderDetailStyles.billItemContainer}>
            <View style={orderDetailStyles.billItemContainer1}>
              <AppText>Item total</AppText>
              {/* <AppText>Saving</AppText> */}
              <AppText>Service Fee</AppText>
              <AppText>Sales Tax</AppText>
              <AppText>Total Payment</AppText>
            </View>
            <View style={orderDetailStyles.billItemContainer2}>
              <AppText fontFamily={FONTS.semiBold}>${Number(orderSummary.itemsTotal)?.toFixed?.(2)}</AppText>
              {/* <AppText fontFamily={FONTS.semiBold}>$-4.9</AppText> */}
              <AppText fontFamily={FONTS.semiBold}>${orderSummary?.serviceFee}</AppText>
              <AppText fontFamily={FONTS.semiBold}>${orderSummary?.salesTax || 0.5}</AppText>
              <AppText fontFamily={FONTS.semiBold}>${(Number(orderSummary.itemsTotal) + Number(orderSummary?.serviceFee)).toFixed(2)}</AppText>
            </View>
          </View>
        </View>

        {paymentStatus === 'unpaid' && <AppButton title={'Pay Now'} onPress={handlePayNow} containerStyle={[globalStyles.bottomButton, {marginTop: 50}]} />}

        {paymentStatus == 'paid' && deliveryPaymentStatus === 'unpaid' && (
          <View style={[globalStyles.inputsGap, {marginTop: 50}, globalStyles.bottomButton]}>
            <View style={orderDetailStyles.infoRow}>
              <InfoBlueIcon width={15} height={15} />
              <AppText style={{color: '#0EA0E8'}}>Just pay delivery charges via app when rider arrive</AppText>
            </View>
            {/* <AppButton title={'Track'} onPress={handlePressTrack} /> */}
            <AppButton title={'Pay delivery Charges'} onPress={handlePayDeliveryCharges} />
          </View>
        )}
      </AppScrollView>

      <SuccessModal
        heading={'Payment Done'}
        description={'Lorem ipsum dolor sit amet'}
        buttonTitle={'Back To Home'}
        onPressButton={() => {
          setPaymentDoneModalShow(false);
          navigation.popToTop();
        }}
        setIsVisible={setPaymentDoneModalShow}
        isVisible={paymentDoneModalShow}
      />
    </Screen>
  );
};

export default UserListOrderDetail;
