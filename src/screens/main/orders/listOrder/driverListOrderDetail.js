import {View, Image, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppButton, AppScrollView, AppText, AppTextInput, Header, Loader, Screen, SuccessModal} from '../../../../components';
import {FONTS} from '../../../../utils/theme';
import {listStyles, orderDetailStyles} from '../../styles';
import {UnCheckSquareIcon, CheckSquareIcon, ChatIcon, LocationGrayIcon} from '../../../../assets/icons';
import globalStyles from '../../../../../globalStyles';
import commonAPI from '../../../../network/commonAPI';
import {getUserFullName, onAPIError} from '../../../../helpers';
import {useDriverOrderActions} from '../../../../hooks';
import {ROUTES} from '../../../../utils/constants';
import {API_METHODS, callApi} from '../../../../network/NetworkManger';
import {API} from '../../../../network/Environment';

const DriverListOrderDetail = ({navigation, route}) => {
  const params = route?.params;
  const {handleAcceptRejectOrder} = useDriverOrderActions();
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const isAccepted = order?.orderStatus === 'accepted by rider';
  const isBillSend = order?.orderStatus === 'buying grocery';

  const [billSentModalShow, setBillSentModalShow] = useState(false);
  const [bill, setBill] = useState('');
  const [paymentDoneModalShow, setPaymentDoneModalShow] = useState(false);

  const orderId = params?.orderId;
  const customer = order?.customer || {};
  const customerImage = customer?.image;
  const customerFullName = getUserFullName(customer?.firstName, customer?.lastName);
  const deliveryLocation = order?.endLocation?.address || order?.orderSummary?.endLocation?.address;
  const orderNumber = order?.orderNumber;
  const groceryList = order?.items || order?.orderSummary?.listItems;
  const isCheckMarkShow = isAccepted;
  const isAddBillShow = isAccepted;
  const isSummaryShow = false;
  const isContinueButtonShow = isAccepted && selectedProducts?.length > 0 && bill;
  const isOrderStatusShow = true;
  const orderType = params?.orderType;

  useEffect(() => {
    getOrderDetail();
  }, [orderId]);

  const getOrderDetail = async () => {
    setIsLoading(true);
    const response = await commonAPI.getOrderDetail(orderId);
    // console.log('reSS:', JSON.stringify(response));
    setIsLoading(false);
    if (response.success) {
      setOrder(response?.order);
      setSelectedProducts(response?.order?.orderSummary?.listItems.map(i => i?._id));
    }
  };

  const handlePressItem = (item, index) => {
    if (selectedProducts.includes(item?._id)) {
      setSelectedProducts(selectedProducts.filter(i => i !== item._id));
    } else {
      setSelectedProducts([...selectedProducts, item._id]);
    }
  };

  const handleContinue = () => {
    const buyedProducts = groceryList.map(i => ({...i, isAvailable: selectedProducts.includes(i?._id)}));

    const data = {orderId, updatedItems: buyedProducts, itemsTotal: bill};

    const onSuccess = response => {
      setBillSentModalShow(true);
      setTimeout(() => {
        setBillSentModalShow(false);
        navigation.goBack();
      }, 1000);
    };

    callApi(API_METHODS.PATCH, API.buyingListItems, data, onSuccess, onAPIError, setIsLoading);
  };

  const handleNavigate = () => {
    navigation.navigate(ROUTES.MapNavigete, {orderId});
  };

  if (isLoading) {
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
      <AppScrollView>
        <View style={orderDetailStyles.headContainer}>
          <View style={{gap: 3}}>
            <View style={orderDetailStyles.headerContainer}>
              {customerImage && <Image source={{uri: customerImage}} style={orderDetailStyles.image} />}
              <View style={orderDetailStyles.contentText}>
                <AppText fontFamily={FONTS.medium}>{customerFullName}</AppText>
                <View style={orderDetailStyles.locationContainer}>
                  <LocationGrayIcon width={12} height={12} />
                  <AppText fontSize={12} greyText>
                    {deliveryLocation}
                  </AppText>
                </View>
              </View>
              <Pressable onPress={() => navigation.navigate(ROUTES.ChatRoom, {inboxId: customer?._id})}>
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
                    {isCheckMarkShow && (
                      <>
                        {selectedProducts?.includes?.(item?._id) ? (
                          <CheckSquareIcon width={20} height={20} onPress={() => handlePressItem(item, index)} />
                        ) : (
                          <UnCheckSquareIcon width={20} height={20} onPress={() => handlePressItem(item, index)} />
                        )}
                      </>
                    )}
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
          {isAddBillShow && (
            <>
              <AppText fontFamily={FONTS.semiBold} fontSize={16}>
                Add Bill
              </AppText>
              <AppTextInput placeholder="Add Total Amount" onChangeText={setBill} />
            </>
          )}
          {isSummaryShow && (
            <View style={orderDetailStyles.billItemContainer}>
              <View style={orderDetailStyles.billItemContainer1}>
                <AppText>Item total</AppText>
                <AppText>Saving</AppText>
                <AppText>Service Fee</AppText>
                <AppText>Tax</AppText>
                <AppText>Total Payment</AppText>
              </View>
              <View style={orderDetailStyles.billItemContainer2}>
                <AppText fontFamily={FONTS.semiBold}>$678.5</AppText>
                <AppText fontFamily={FONTS.semiBold}>$-4.9</AppText>
                <AppText fontFamily={FONTS.semiBold}>$3.26</AppText>
                <AppText fontFamily={FONTS.semiBold}>$2.89</AppText>
                <AppText fontFamily={FONTS.semiBold}>$178.99</AppText>
              </View>
            </View>
          )}
        </View>

        {!isAccepted && !isBillSend && (
          <View style={[orderDetailStyles.buttonsContainer, {marginTop: 0}, globalStyles.bottomButton]}>
            <AppButton title={'Accept'} onPress={() => handleAcceptRejectOrder(order, 'accept', true)} containerStyle={orderDetailStyles.button} transparentButton={true} />
            <AppButton title={'Reject'} onPress={() => handleAcceptRejectOrder(order, 'reject', true)} containerStyle={orderDetailStyles.button} />
          </View>
        )}

        {isContinueButtonShow && <AppButton title={'Continue'} onPress={handleContinue} containerStyle={[globalStyles.bottomButton, {marginTop: 50}]} />}
        {isBillSend && order.riderStatus == 'On the way' && <AppButton title={'Navigate'} onPress={handleNavigate} containerStyle={[globalStyles.bottomButton, {marginTop: 50}]} />}
      </AppScrollView>

      <SuccessModal
        heading={'Bill Sent'}
        description={'Wait for payment'}
        buttonTitle={'Back To Home'}
        onPressButton={() => {
          setBillSentModalShow(false);
          navigation.popToTop();
        }}
        setIsVisible={setBillSentModalShow}
        isVisible={billSentModalShow}
      />
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

export default DriverListOrderDetail;
