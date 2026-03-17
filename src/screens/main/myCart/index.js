import {View, FlatList} from 'react-native';
import React, {useState} from 'react';
import {AddressVerificationModal, AppButton, AppText, Header, Screen} from '../../../components';
import CartItem from '../../../components/UI/cartItem';
import globalStyles from '../../../../globalStyles';
import {cartStyles} from '../styles';
import {FONTS} from '../../../utils/theme';
import {ROUTES} from '../../../utils/constants';
import {useSelector} from 'react-redux';
import {customerCartSelector} from '../../../redux/selectors';
import useCustomerCart from '../../../hooks/useCustomerCart';

const MyCart = ({navigation}) => {
  const {handleDecrementCartItem, handleIncrementCartItem, handleRemoveItemFromCart, handleResetCart} = useCustomerCart();
  const myCart = useSelector(customerCartSelector);
  const [isDeliveryAddressModalShow, setIsDeliveryAddressModalShow] = useState(false);

  const myCartList = myCart.cartItems;
  const cartTotal = myCart?.totalPrice?.toFixed?.(2);

  const handleCheckout = () => {
    setIsDeliveryAddressModalShow(true);
  };

  const renderListFooterComponent = () => {
    return (
      <View style={cartStyles.checkoutCard}>
        <View>
          <AppText>Total Price</AppText>
          <AppText fontSize={16} fontFamily={FONTS.semiBold}>
            ${cartTotal}
          </AppText>
        </View>

        <AppButton title={'Checkout'} textStyle={{fontSize: 12}} containerStyle={cartStyles.checkoutCardButton} onPress={handleCheckout} disabled={myCartList?.length === 0} />
      </View>
    );
  };

  return (
    <Screen>
      <Header title={'My Cart'} />
      <FlatList
        data={myCartList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => <CartItem item={item} onPressCrossIcon={handleRemoveItemFromCart} onPressDecrement={handleDecrementCartItem} onPressIncrement={handleIncrementCartItem} />}
        contentContainerStyle={[globalStyles.flexGrow1, globalStyles.screenPadding, globalStyles.inputsGap, globalStyles.screenPaddingBottom10]}
        ListFooterComponent={renderListFooterComponent}
        ListFooterComponentStyle={cartStyles.checkoutCardFooter}
      />

      <AddressVerificationModal
        isVisible={isDeliveryAddressModalShow}
        setIsVisible={setIsDeliveryAddressModalShow}
        onPressChange={() => {
          setIsDeliveryAddressModalShow(false);
          navigation.navigate(ROUTES.EditAddress, {prevScreen: 'MY_CART'});
        }}
        onPressContinue={() => {
          setIsDeliveryAddressModalShow(false);
          navigation.navigate(ROUTES.Checkout);
        }}
        onPress={() => {
          setIsDeliveryAddressModalShow(false);
          navigation.navigate(ROUTES.Checkout);
        }}
      />
    </Screen>
  );
};

export default MyCart;
