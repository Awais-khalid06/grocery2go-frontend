import {View, Pressable, StyleSheet, Image} from 'react-native';
import React from 'react';
import AppText from '../text';
import {COLORS, FONTS} from '../../utils/theme';
import {GrayHeartCircleIcon, LocationGrayIcon, RedHeartCircleIcon} from '../../assets/icons';

const ShopCard = ({item, style, onPress, onPressHeartIcon}) => {
  const imageUri = item?.image;
  return (
    <Pressable style={[styles.container, style]} onPress={() => onPress?.(item)}>
      {imageUri && <Image source={{uri: imageUri}} style={styles.image} />}
      <View style={styles.contentContainer}>
        <AppText fontFamily={FONTS.medium}>{item?.shopTitle}</AppText>
        <Pressable onPress={() => onPressHeartIcon?.(item)}>{item?.isFavorite ? <RedHeartCircleIcon /> : <GrayHeartCircleIcon />}</Pressable>
      </View>
      <View style={styles.locationContainer}>
        <LocationGrayIcon width={12} height={12} />
        <AppText greyText fontSize={12}>
          {item?.location?.address}
        </AppText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%', backgroundColor: COLORS.white, padding: 10, borderRadius: 10},
  image: {width: '100%', height: 120, borderRadius: 10},
  contentContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10},
  locationContainer: {flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5},
});

export default ShopCard;
