import {View} from 'react-native';
import React, {useState} from 'react';
import {AppButton, AppScrollView, AppText, AppTextInput, Header, Loader, Screen, ShowMessage} from '../../../components';
import CartItem from '../../../components/UI/cartItem';
import {FONTS} from '../../../utils/theme';
import globalStyles from '../../../../globalStyles';
import {cartStyles} from '../styles';
import {ChevronIcon} from '../../../assets/icons';
import DatePicker from 'react-native-date-picker';
import {ROUTES} from '../../../utils/constants';
import {useSelector} from 'react-redux';
import {customerCartSelector, userSelector} from '../../../redux/selectors';
import dayjs from 'dayjs';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';
import useCustomerCart from '../../../hooks/useCustomerCart';
import {validateDeliveryTime as deliveryTimeValidation} from '../../../utils/validations';
import commonAPI from '../../../network/commonAPI';
import usePaymentSheetHandler from '../../../hooks/usePaymentSheetHandler';

const Checkout = ({navigation, route}) => {
  const currentDate = new Date();
  const after2HourDate = new Date(currentDate.setHours(currentDate.getHours() + 2));
  const params = route?.params;

  const user = useSelector(userSelector);
  const {handleResetCart} = useCustomerCart();
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
    {title: 'Items Total', amount: `$${Number(cartTotal)?.toFixed?.(2)}`},
    {title: 'Delivery fee', amount: `$${deliveryFee}`},
    {title: 'Service fee', amount: `$${serviceFee}`},
    {title: 'Admin Fee', amount: `$${adminFee}`},
    {title: 'Sales Tax', amount: `$${salesTax.toFixed(2)}`},
    {title: 'Total Payment', amount: `$${formattedTotalPayment}`},
  ];
  // console.log('cartItems: ', JSON.stringify(myCart, null, 2));
  function calculateTotalTax(cartItems) {
    const shopWiseTotal = {};

    // Step 1: Group items by shop and calculate subtotal for each shop
    cartItems.forEach(item => {
      const shopName = item?.shopDetails?.shopTitle || item?.shopTitle;
      const salesTaxRate = (item?.shopDetails?.salesTax || item?.salesTax) / 100; // Convert % to decimal

      if (!shopWiseTotal[shopName]) {
        shopWiseTotal[shopName] = {total: 0, taxRate: salesTaxRate};
      }

      shopWiseTotal[shopName].total += item.price * item.itemQuantity;
    });

    // Step 2: Calculate tax for each shop
    let totalTax = 0;
    Object.values(shopWiseTotal).forEach(({total, taxRate}) => {
      totalTax += total * taxRate;
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
    const isValidate = deliveryTimeValidation(deliveryTime);
    if (!isValidate) return;

    const onSuccess = async response => {
      if (response.success) {
        const {customer, clientSecret, id, metadata} = response?.order?.paymentIntent || {};
        const sheetData = {customerId: customer, clientSecret: clientSecret, paymentIntentId: id, orderId: metadata?.orderId};

        const onSuccessPayment = async () => {
          const verifyResponse = await commonAPI.verifyOrderPayment({
            paymentIntentId: sheetData?.paymentIntentId,
            orderId: sheetData?.orderId,
          });

          if (verifyResponse?.success) {
            navigation.replace(ROUTES.OrderAccepted);
            handleResetCart();
          }
        };

        initializeAndPresentPaymentSheet(sheetData, onSuccessPayment);
      }
    };

    const deliveryLocation = getDeliveryLocation();
    const data = {deliveryLocation, deliveryTime, salesTax, cart: {products: myCartList.map(i => ({grocery: i._id, quantity: i.itemQuantity}))}};
    callApi(API_METHODS.POST, API.confirmCheckout, data, onSuccess, onAPIError, setIsLoading);
  };

  return (
    <Screen>
      <Header title={'Check Out'} />
      <Loader isLoading={isLoading} />

      <AppScrollView>
        <View style={{gap: 5}}>
          <AppText fontFamily={FONTS.medium}>Total item (4)</AppText>
          <View style={globalStyles.inputsGap}>
            {myCartList.map((item, index) => (
              <CartItem item={item} isCounter={false} isQuatity={true} isCrossIcon={false} key={index} />
            ))}
          </View>
        </View>

        <View style={{marginTop: 20, gap: 5}}>
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

        <AppButton title={'Pay Now'} containerStyle={globalStyles.bottomButton} onPress={handlePayNow} />
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
