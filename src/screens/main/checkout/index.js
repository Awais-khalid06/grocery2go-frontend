import { View } from 'react-native';
import React, { useState } from 'react';
import { AppButton, AppScrollView, AppText, AppTextInput, Header, Screen } from '../../../components';
import CartItem from '../../../components/UI/cartItem';
import { FONTS } from '../../../utils/theme';
import globalStyles from '../../../../globalStyles';
import { cartStyles } from '../styles';
import { ChevronIcon } from '../../../assets/icons';
import DatePicker from 'react-native-date-picker';
import { ROUTES } from '../../../utils/constants';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { customerCartSelector, userSelector } from '../../../redux/selectors';
import dayjs from 'dayjs';
import { API_METHODS, callApi } from '../../../network/NetworkManger';
import { API } from '../../../network/Environment';
import { onAPIError } from '../../../helpers';
import { validateDeliveryTime as deliveryTimeValidation } from '../../../utils/validations';
import usePaymentSheetHandler from '../../../hooks/usePaymentSheetHandler';
import { customerCartActions } from '../../../redux/slices/customer/customerCart';

const Checkout = ({ navigation, route }) => {
  const currentDate = new Date();
  const after2HourDate = new Date(currentDate.setHours(currentDate.getHours() + 2));
  const params = route?.params;

  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const initializeAndPresentPaymentSheet = usePaymentSheetHandler();
  const [isDeliveryModalShow, setIsDeliveryModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState(after2HourDate);
  const myCart = useSelector(customerCartSelector);
  const paramsLocation = params?.location;

  // console.log('myCart: ', JSON.stringify(myCart, null, 2));

  const myCartList = myCart.cartItems;
  const cartTotal = myCart?.totalPrice ?? 0;
  const deliveryFee = 5;
  const serviceFee = 4;
  const adminFee = 3;
  const salesTax = calculateTotalTax(myCartList);
  const totalPayment = deliveryFee + serviceFee + adminFee + cartTotal + salesTax;

  const formattedTotalPayment = Number(totalPayment).toFixed(2);

  const ORDER_SUMMARY = [
    { title: 'Items Total', amount: `$${Number(cartTotal)?.toFixed?.(2)}` },
    { title: 'Delivery fee', amount: `$${deliveryFee}` },
    { title: 'Service fee', amount: `$${serviceFee}` },
    { title: 'Admin Fee', amount: `$${adminFee}` },
    { title: 'Sales Tax', amount: `$${salesTax.toFixed(2)}` },
    { title: 'Total Payment', amount: `$${formattedTotalPayment}` },
  ];
  // console.log('cartItems: ', JSON.stringify(myCart, null, 2));
  function calculateTotalTax(cartItems) {
    let totalTax = 0;
    cartItems.forEach(item => {
      const salesTaxRate = Number(item?.salesTax || 0) / 100;
      totalTax += Number(item?.price || 0) * salesTaxRate;
    });

    return totalTax;
  }

  const getDeliveryLocation = () => {
    if (paramsLocation) {
      return {
        type: 'Point',
        coordinates: [paramsLocation.longitude, paramsLocation.latitude],
        address: paramsLocation.name,
      };
    } else {
      const location = user?.location;
      return {
        type: 'Point',
        coordinates: location.coordinates,
        address: location.address,
      };
    }
  };

  const handlePayNow = () => {
    console.log('[Checkout] Pay Now clicked', {
      cartItemsCount: myCartList?.length || 0,
      totalPayment: formattedTotalPayment,
    });

    const isValidate = deliveryTimeValidation(deliveryTime);
    if (!isValidate) return;

    const onSuccess = async response => {
      console.log('[Checkout] cart/verify-payment success response', response);
      if (response.success) {
        const { customer, clientSecret, id, metadata } = response?.order?.paymentIntent || {};
        const sheetData = { customerId: customer, clientSecret: clientSecret, paymentIntentId: id, orderId: metadata?.orderId };
        console.log('[Checkout] sheetData prepared', {
          hasCustomerId: !!sheetData.customerId,
          hasClientSecret: !!sheetData.clientSecret,
          hasPaymentIntentId: !!sheetData.paymentIntentId,
          hasOrderId: !!sheetData.orderId,
        });

        const onSuccessPayment = async () => {
          console.log('[Checkout] onSuccessPayment callback fired');
          dispatch(customerCartActions.resetCartItems());
          console.log('[Checkout] cart reset dispatched, navigating back');
          navigation.goBack();
        };

        const paymentSheetResult = await initializeAndPresentPaymentSheet(sheetData, onSuccessPayment);
        console.log('[Checkout] payment sheet flow result', paymentSheetResult);
      }
    };

    const onCheckoutError = error => {
      console.log('[Checkout] cart/verify-payment error response', error);
      onAPIError(error);
    };

    const deliveryLocation = getDeliveryLocation();
    const data = { deliveryLocation, deliveryTime, salesTax, cart: { products: myCartList.map(i => ({ grocery: i._id, quantity: i.itemQuantity })) } };
    console.log('[Checkout] cart/verify-payment request payload', data);
    callApi(API_METHODS.POST, API.confirmCheckout, data, onSuccess, onCheckoutError, setIsLoading);
  };

  return (
    <Screen>
      <Header title={'Check Out'} />

      <AppScrollView>
        <View style={{ gap: 5 }}>
          <AppText fontFamily={FONTS.medium}>Total item (4)</AppText>
          <View style={globalStyles.inputsGap}>
            {myCartList.map((item, index) => (
              <CartItem item={item} isCounter={false} isQuatity={true} isCrossIcon={false} key={index} />
            ))}
          </View>
        </View>

        <View style={{ marginTop: 20, gap: 5 }}>
          <AppText fontFamily={FONTS.semiBold}>Order Summary</AppText>

          <View style={cartStyles.orderSummaryContainer}>
            {ORDER_SUMMARY.map((item, index) => (
              <View key={index} style={cartStyles.listItem}>
                <AppText fontSize={12}>{item.title}</AppText>
                <AppText fontFamily={FONTS.semiBold} fontSize={12}>
                  {item.amount}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        <View style={[cartStyles.deliveryTime, globalStyles.flex1]}>
          <AppTextInput onPressRightIcon={() => setIsDeliveryModalShow(true)} editable={false} RightIcon={ChevronIcon} placeholder="Delivery time" value={dayjs(deliveryTime).format('hh:mm A')} />
        </View>

        <AppButton title={isLoading ? 'Processing...' : 'Pay Now'} isLoading={isLoading} disabled={isLoading} containerStyle={globalStyles.bottomButton} onPress={handlePayNow} />
      </AppScrollView>

      <DatePicker
        modal
        mode="time"
        open={isDeliveryModalShow}
        minimumDate={after2HourDate}
        date={deliveryTime}
        onConfirm={date => {
          setIsDeliveryModalShow(false);
          setDeliveryTime(date);
        }}
        onCancel={() => {
          setIsDeliveryModalShow(false);
        }}
      />
    </Screen>
  );
};

export default Checkout;
