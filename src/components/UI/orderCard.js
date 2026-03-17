import {View, Text, Pressable, StyleSheet, Image} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from '../../utils/theme';
import {AvatarImage, ShopImage} from '../../assets/images';
import AppText from '../text';
import {ChatIcon, LocationGrayIcon, OrderTimeSquareIcon, WoodBoxIcon} from '../../assets/icons';
import SeperatorLine from '../seperatorLine';
import globalStyles from '../../../globalStyles';
import {IconWrapper} from '../../screens/main/home/userHome';

const OrderCard = ({item, onPress, onPressChatIcon}) => {
  const shopDetails = item?.shopDetails;
  // const imageUri = shopDetails?.image;
  // const shopAddress = shopDetails?.location?.address;
  // const shopTitle = shopDetails?.name;

  // console.log('ITEM: ', item);

  return (
    <Pressable style={styles.container} onPress={() => onPress?.(item)}>
      <View style={styles.headerContainer}>
        {/* <Image source={{uri: imageUri}} style={styles.image} /> */}
        <OrderTimeSquareIcon style={styles.icon} width={45} height={45} />
        {/* <IconWrapper Icon={WoodBoxIcon} style={styles.icon} width={30} height={30} /> */}
        <View style={styles.contentText}>
          <AppText fontFamily={FONTS.medium}>{item?.orderNumber}</AppText>
          {item?.orderType === 'simpleOrder' && (
            <AppText fontSize={12} primary>
              ${item?.orderTotal}
            </AppText>
          )}
          {/* {shopAddress && (
            <View style={styles.locationContainer}>
              <LocationGrayIcon width={12} height={12} />
              <AppText fontSize={12} greyText>
                {shopAddress}
              </AppText>
            </View>
          )} */}
        </View>
        {/* <ChatIcon width={30} height={30} onPress={onPressChatIcon} /> */}
      </View>

      {item?.isRiderDetail && (
        <View style={styles.riderDetailContainer}>
          <SeperatorLine />
          <View style={styles.headerContainer}>
            <Image source={AvatarImage} style={styles.riderImage} />
            <AppText style={globalStyles.flex1}>Rider</AppText>
            <ChatIcon width={30} height={30} />
          </View>
        </View>
      )}

      <View style={styles.footerContainer}>
        {/* <View style={styles.rowItem}>
          <AppText>Total Price</AppText>
          <AppText fontSize={12}>${item?.orderTotal}</AppText>
        </View> */}
        {shopDetails?.length > 0 && (
          <View style={styles.rowItem}>
            <AppText>Number of shops</AppText>
            <AppText fontSize={12}>{shopDetails?.length}</AppText>
          </View>
        )}

        <View style={styles.rowItem}>
          <AppText>Status</AppText>
          <AppText fontSize={12} greyText primary>
            {item?.orderStatus}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%', backgroundColor: COLORS.white, padding: '4%', borderRadius: 10},
  image: {width: 50, height: 50, borderRadius: 100, marginEnd: '3%'},
  riderImage: {width: 35, height: 35, resizeMode: 'contain', borderRadius: 100, marginEnd: '3%'},
  locationContainer: {flexDirection: 'row', alignItems: 'center', gap: 3},
  headerContainer: {flexDirection: 'row', alignItems: 'center'},
  contentText: {gap: 3, flex: 1},
  footerContainer: {marginTop: 15, gap: 10},
  rowItem: {flexDirection: 'row', justifyContent: 'space-between'},
  riderDetailContainer: {marginTop: 15, gap: 10, marginBottom: 5},
  icon: {marginEnd: '4%'},
});

export default OrderCard;
