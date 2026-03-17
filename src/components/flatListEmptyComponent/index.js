import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

import AppText from '../text';
import {COLORS, FONTS} from '../../utils/theme';

const FlatListEmptyComponent = ({label, isLabelHide = false}) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.label}>{isLabelHide ? '' : label}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.black,
  },
});

export default FlatListEmptyComponent;
