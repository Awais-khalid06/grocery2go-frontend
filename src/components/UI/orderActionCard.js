import {View, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from '../../utils/theme';
import {IconWrapper} from '../../screens/main/home/userHome';
import {LocationDistanceIcon, WoodBoxIcon} from '../../assets/icons';
import AppText from '../text';
import globalStyles from '../../../globalStyles';
import AppButton from '../button';
import {getDistanceFromLatLon, getFromNowTime} from '../../helpers';

const OrderActionCard = ({onPress, type, item, loggedInUserLocation, onPressAccept, onPressReject, isPriceShow = true, isAcceptRejectButtonsShow = true}) => {
  const orderNumber = item?.orderNumber;

  let locationAddress = item?.orderSummary?.endLocation?.address;
  let itemsTotalPrice = 0;
  let totalItems = 0;

  const orderType = item?.orderType;
  // console.log('ITEM:', JSON.stringify(item, null, 2));
  if (type === 'SHOP_NEW_ORDER') {
    itemsTotalPrice = item?.shopDetails?.[0]?.shopOrderSummary?.shopItemsTotal;
    totalItems = item?.shopDetails?.[0]?.shopOrderSummary?.shopItems;
  }

  if (type === 'DRIVER_NEW_ORDER' || type === 'DRIVER_MY_ORDER' || type === 'COMPLETED_ORDER') {
    if (type === 'DRIVER_MY_ORDER' && orderType === 'listOrder') {
      totalItems = item?.orderSummary?.totalListItems;
      locationAddress = item?.orderSummary?.endLocation?.address;
    } else {
      itemsTotalPrice = item?.orderSummary?.totalPayment;
      totalItems = item?.orderSummary?.totalItems;
    }
  }

  const timestamp = getFromNowTime(item?.createdAt);
  const customerLocation = item?.endLocation;
  const distanceInMile = getDistanceFromLatLon(customerLocation?.coordinates[1], customerLocation?.coordinates?.[0], loggedInUserLocation?.coordinates[1], loggedInUserLocation?.coordinates[0]);

  return (
    <Pressable onPress={() => onPress?.(item)} style={styles.container}>
      <View style={styles.headContainer}>
        <IconWrapper Icon={WoodBoxIcon} style={styles.icon} width={50} height={50} />
        <View style={[globalStyles.flex1, styles.textcontent]}>
          <View style={styles.orderNumberContainer}>
            <AppText style={globalStyles.flex1} fontFamily={FONTS.medium}>
              Order {orderNumber}
            </AppText>
            <AppText fontSize={12} greyText>
              {timestamp}
            </AppText>
          </View>
          <AppText greyText fontSize={12}>
            Location: {locationAddress}
          </AppText>
          <View style={styles.distanceContainer}>
            <LocationDistanceIcon />
            <AppText greyText fontSize={12} style={globalStyles.flex1}>
              {distanceInMile}
            </AppText>

            {isPriceShow && (
              <AppText primary fontFamily={FONTS.medium}>
                ${itemsTotalPrice}
              </AppText>
            )}

            {type === 'DRIVER_MY_ORDER' && orderType === 'listOrder' && (
              <AppText primary fontFamily={FONTS.medium}>
                {totalItems} items
              </AppText>
            )}
          </View>
        </View>
      </View>

      {isAcceptRejectButtonsShow && (type == 'SHOP_NEW_ORDER' || type === 'DRIVER_NEW_ORDER') && (
        <>
          <View style={styles.itemsContainer}>
            <AppText fontFamily={FONTS.medium}>{orderType == 'simpleOrder' ? 'Items' : 'Grocery List'}</AppText>
            <AppText fontFamily={FONTS.medium}>{totalItems}</AppText>
          </View>

          <View style={styles.buttonsContainer}>
            <AppButton title={'Accept'} onPress={() => onPressAccept?.(item)} containerStyle={styles.button} transparentButton={true} />
            <AppButton title={'Reject'} containerStyle={styles.button} onPress={() => onPressReject?.(item)} />
          </View>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: COLORS.white, borderRadius: 12, padding: '6%'},
  icon: {backgroundColor: COLORS.grey400, width: 70, height: 70, justifyContent: 'center', alignItems: 'center', borderRadius: 15},
  distanceContainer: {flexDirection: 'row', alignItems: 'center', gap: 3},
  headContainer: {flexDirection: 'row', gap: 15, alignItems: 'center'},
  itemsContainer: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 10},
  rightContent: {},
  orderNumberContainer: {flexDirection: 'row', alignItems: 'center'},
  textcontent: {gap: 3},
  button: {width: '45%', height: 40, textAlign: 'center', textAlignVertical: 'center'},
  buttonsContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20},
});

export default OrderActionCard;
