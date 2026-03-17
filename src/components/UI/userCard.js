import {View, StyleSheet, Pressable, Image} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from '../../utils/theme';
import {AvatarImage} from '../../assets/images';
import AppText from '../text';
import {LocationDistanceIcon, StarFilledIcon} from '../../assets/icons';
import AppButton from '../button';
import StarRating from '../starRating';
import {getDistanceFromLatLon, getUserFullName} from '../../helpers';

const UserCard = ({type, onPress, item, currentUserLocation, onPressRequest}) => {
  if (type === 'Rider') {
    const myLat = currentUserLocation?.coordinates?.[1];
    const myLng = currentUserLocation?.coordinates?.[0];
    const riderLat = item?.rider?.location?.coordinates?.[1];
    const riderLng = item?.rider?.location?.coordinates?.[0];

    const distance = getDistanceFromLatLon(myLat, myLng, riderLat, riderLng);
    const riderImage = item?.rider?.image;

    return (
      <Pressable style={styles.container} onPress={() => onPress?.(item)}>
        {riderImage && <Image source={{uri: riderImage}} style={styles.image} />}
        <View style={styles.contentContainer}>
          <View style={styles.gap3}>
            <AppText fontSize={12}>{getUserFullName(item?.rider?.firstName, item?.rider?.lastName)}</AppText>
            <View style={styles.locationContainer}>
              <LocationDistanceIcon />
              <AppText fontSize={10} greyText>
                {distance}
              </AppText>
            </View>
          </View>

          <View style={styles.rightContent}>
            <View style={styles.starRatingContainer}>
              <StarFilledIcon width={12} />
              <AppText fontSize={12} greyText>
                {item?.averageRating}({item?.ratings?.length})
              </AppText>
            </View>
            <View style={styles.requestButtonContainer}>
              <AppText fontSize={12} fontFamily={FONTS.medium} onPress={() => onPress?.(item)}>
                View Profile
              </AppText>
              <AppButton title={'Request'} onPress={() => onPressRequest?.(item)} textStyle={styles.requestButtonText} containerStyle={styles.requestButton} />
            </View>
          </View>
        </View>
      </Pressable>
    );
  } else if (type === 'Review') {
    return (
      <Pressable style={[styles.container, styles.seperatorLine]} onPress={onPress}>
        {item?.from?.image && <Image source={{uri: item?.from?.image}} style={styles.image} />}
        <View style={styles.contentContainer}>
          <View style={styles.gap3}>
            <AppText fontSize={12}>{getUserFullName(item?.from?.firstName, item?.from?.lastName)}</AppText>
            {item?.comment && (
              <AppText fontSize={10} greyText>
                {item?.comment}
              </AppText>
            )}
          </View>
        </View>
        <StarRating defaultRating={item?.stars} size={13} />
      </Pressable>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {width: '100%', backgroundColor: COLORS.white, padding: '4%', borderRadius: 10, flexDirection: 'row', alignItems: 'center'},
  image: {width: 50, height: 50, borderRadius: 100},
  locationContainer: {flexDirection: 'row', alignItems: 'center', gap: 5},
  contentContainer: {flexDirection: 'row', alignItems: 'center', marginStart: '3%', flex: 1},
  gap3: {gap: 3, flex: 1},
  requestButton: {width: '40%', height: 25, marginStart: '5%'},
  requestButtonText: {fontSize: 12},
  requestButtonContainer: {flexDirection: 'row', alignItems: 'center'},
  rightContent: {alignItems: 'flex-end', gap: 12},
  starRatingContainer: {flexDirection: 'row', alignItems: 'center', gap: 5},
  seperatorLine: {borderBottomWidth: 1, borderColor: COLORS.grey1},
});

export default UserCard;
