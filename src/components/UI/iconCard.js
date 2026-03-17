import {View, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {COLORS} from '../../utils/theme';
import AppText from '../text';
import globalStyles from '../../../globalStyles';

const IconCard = ({item, onPress, isSelected}) => {
  const Icon = item?.icon;
  return (
    <Pressable onPress={onPress} style={styles.main}>
      <View style={[styles.container, {backgroundColor: isSelected ? COLORS.lightYellow : COLORS.lightblue}]}>
        <Icon width={80} />
        <View style={styles.content}>
          <AppText primary fontSize={16}>
            {item?.title}
          </AppText>
          <AppText greyText fontSize={10}>
            {item?.description}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 15, flexDirection: 'row', alignItems: 'center', gap: 15},
  content: {width: '72%', gap: 5},
  main: {
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 2,
    backgroundColor: COLORS.white,
    borderRadius: 15,
  },
});

export default IconCard;
