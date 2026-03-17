import {View, Pressable, StyleSheet, Image} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from '../../utils/theme';
import {GrayHeartCircleIcon, PlusPrimaryIcon, RedHeartCircleIcon} from '../../assets/icons';
import AppText from '../text';
import {wp} from '../../helpers';
import globalStyles from '../../../globalStyles';

const GroceryCard = ({item, style, onPress, isHeartComponent, onPressPlusIcon, onPressHeartIcon, isLikeLoading, index}) => {
  const imageUri = item?.productImages?.[0];

  return (
    <Pressable style={[styles.container, style]} onPress={() => onPress(item)}>
      <View style={globalStyles.flex1}>
        {imageUri && <Image source={{uri: imageUri}} style={styles.image} />}
        <View style={styles.nameAndHeartContainer}>
          <View style={globalStyles.flex1}>
            <AppText numberOfLines={2} fontFamily={FONTS.medium} fontSize={12}>
              {item.productName}
            </AppText>
            <AppText fontSize={10} greyText>
              {item.volume}, Price
            </AppText>
          </View>

          {isHeartComponent && (
            <Pressable style={styles.heartContainer} disabled={isLikeLoading} onPress={() => onPressHeartIcon?.(item, index)}>
              {item?.isFavorite ? <RedHeartCircleIcon width={25} height={25} /> : <GrayHeartCircleIcon width={25} height={25} />}
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.amountAddcontainer}>
        <AppText>${item.price}</AppText>
        <PlusPrimaryIcon width={30} height={30} onPress={() => onPressPlusIcon?.(item)} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: COLORS.white, padding: 10, maxWidth: wp(35), borderRadius: 10, borderWidth: 1, borderColor: COLORS.grey1, flex: 1},
  amountAddcontainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20},
  nameAndHeartContainer: {flexDirection: 'row', alignItems: 'center', marginTop: 10},
  image: {width: '100%', height: 60, borderRadius: 10},
  heartContainer: {width: 25, height: 25},
});

export default GroceryCard;
