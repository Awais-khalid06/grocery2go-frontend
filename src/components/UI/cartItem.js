import {View, StyleSheet, Image, Pressable} from 'react-native';
import React, {useState} from 'react';
import AppText from '../text';
import {AddSquareIcon, CrossGrayIcon, EditPencilIcon, MenuDotsIcon, MinusSquareIcon, PlusSqaureIcon, RemoveIcon} from '../../assets/icons';
import {COLORS, FONTS} from '../../utils/theme';
import globalStyles from '../../../globalStyles';
import {listStyles} from '../../screens/main/styles';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../utils/constants';

const CartItem = ({item, onPress, isCrossIcon = true, isCounter = true, isQuatity, type, onPressIncrement, onPressDecrement, onPressCrossIcon, onPressEdit}) => {
  const navigation = useNavigation();
  const [dotMenuShow, setDotMenuShow] = useState(false);

  let borderColorOfStatus = COLORS.primary;
  let textColorOfStatus = COLORS.primary;
  if (item?.stockStatus === 'available') [(borderColorOfStatus = COLORS.green), (textColorOfStatus = COLORS.green)];

  const itemPrice = item?.price?.toFixed?.(2);
  const itemQuantity = item?.itemQuantity ? item?.itemQuantity : item?.quantity;

  return (
    <Pressable style={styles.container} onPress={() => onPress?.(item)}>
      <Image source={{uri: item?.productImages?.[0]}} style={styles.image} />
      <View style={styles.contentContainer}>
        <View style={[styles.titlecontainer]}>
          <View style={globalStyles.flex1}>
            <AppText fontFamily={FONTS.medium}>{item?.productName}</AppText>
            <AppText fontSize={12} greyText>
              {item?.volume}, Price
            </AppText>
          </View>
          {type === 'PRODUCT' && (
            <Pressable onPress={() => setDotMenuShow(prev => !prev)} style={styles.crossIcon}>
              <MenuDotsIcon width={15} height={15} />
            </Pressable>
          )}
          {isCrossIcon && (
            <Pressable onPress={() => onPressCrossIcon?.(item._id)}>
              <CrossGrayIcon style={styles.crossIcon} width={12} height={12} />
            </Pressable>
          )}
        </View>

        <View style={styles.mainCounterContainer}>
          {isQuatity && (
            <View style={styles.counterContainer}>
              <AppText fontSize={12}>Quantity: {itemQuantity}</AppText>
            </View>
          )}

          {isCounter && (
            <View style={styles.counterContainer}>
              <MinusSquareIcon width={35} height={35} onPress={() => onPressDecrement?.(item._id)} />
              <AppText>{itemQuantity}</AppText>
              <PlusSqaureIcon width={35} height={35} onPress={() => onPressIncrement?.(item?._id)} />
            </View>
          )}

          <AppText fontFamily={FONTS.semiBold} fontSize={16} primary style={type === 'PRODUCT' ? globalStyles.flex1 : null}>
            ${itemPrice}
          </AppText>

          {type === 'PRODUCT' && (
            <View style={[styles.stockContainer, {borderColor: borderColorOfStatus}]}>
              <AppText fontSize={12} fontFamily={FONTS.medium} style={{color: textColorOfStatus}}>
                {item?.stockStatus}
              </AppText>
            </View>
          )}
        </View>
      </View>

      {dotMenuShow && (
        <View style={[listStyles.dotMenuListContainer, {top: 0, right: 25}]}>
          <Pressable
            onPress={() => {
              setDotMenuShow(false);
              onPressEdit?.(item);
            }}
            style={[listStyles.dropdownItemContainer, listStyles.listPaddingAndBorder]}>
            <EditPencilIcon width={15} height={15} />
            <AppText>Edit</AppText>
          </Pressable>
          <Pressable
            onPress={() => {
              setDotMenuShow(false);
              navigation.navigate(ROUTES.ManageStock, {productId: item._id});
            }}
            style={[listStyles.dropdownItemContainer, listStyles.listPaddingAndBorder, {borderBottomWidth: 0, paddingBottom: 5}]}>
            <AddSquareIcon width={15} height={15} />
            <AppText>Add Stock</AppText>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%', padding: 10, flexDirection: 'row', alignItems: 'center', gap: 15, borderWidth: 1, borderColor: COLORS.grey2, borderRadius: 10, backgroundColor: COLORS.white},
  image: {width: '20%', height: '100%', borderRadius: 10},
  contentContainer: {gap: 10, flex: 1},
  counterContainer: {flexDirection: 'row', alignItems: 'center', gap: 15, flex: 1},
  mainCounterContainer: {flexDirection: 'row', alignItems: 'center', flex: 1},
  crossIcon: {alignSelf: 'flex-start'},
  stockContainer: {borderWidth: 1, borderRadius: 100, paddingHorizontal: '5%', paddingVertical: 3},
  titlecontainer: {flexDirection: 'row'},
});

export default CartItem;
