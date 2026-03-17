import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from '../../utils/theme';
import {ChevronIcon} from '../../assets/icons';
import AppText from '../text';

const LabelWithRightChevron = ({title, LeftIcon, onPress, isDisabled, isSeperator = true, renderRightComponent, isTextPrimary}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container} disabled={isDisabled}>
      <View style={styles.titleAndRight}>
        {LeftIcon && <LeftIcon height={20} width={20} />}
        <AppText style={styles.label} primary={isTextPrimary}>
          {title}
        </AppText>
        {renderRightComponent ? renderRightComponent() : <ChevronIcon rotation={-90} height={15} />}
      </View>
      {isSeperator && <View style={styles.seperator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
  },

  titleAndRight: {flexDirection: 'row', alignItems: 'center', gap: 10},

  label: {
    fontFamily: FONTS.medium,
    flexGrow: 1,
    fontSize: 12,
  },

  rightIcon: {width: 12, height: 12, resizeMode: 'contain'},

  seperator: {width: '100%', height: 1, backgroundColor: COLORS.grey2, marginTop: 12},
});

export default LabelWithRightChevron;
