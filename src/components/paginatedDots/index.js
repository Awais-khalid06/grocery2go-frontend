import {StyleSheet, View} from 'react-native';
import React from 'react';
import {COLORS} from '../../utils/theme';

const PaginateDots = ({totalIndex = 3, type = 'Circle', activeIndex, color1 = COLORS.primary, color2 = COLORS.grey2, style, gap = 8, activeDotStyle, inActiveDotStyle}) => {
  const Dot = type === 'Circle' ? CircleDot : BarDot;

  return (
    <View style={[styles.dotsContainer, {gap}, style]}>
      {Array.from({length: totalIndex}, (_, index) => (
        <Dot key={index} isActive={activeIndex === index} color1={color1} color2={color2} activeDotStyle={activeDotStyle} inActiveDotStyle={inActiveDotStyle} />
      ))}
    </View>
  );
};

const BarDot = ({isActive, color1, color2, activeDotStyle, inActiveDotStyle}) => {
  return <View style={isActive ? [styles.barDotActive, {backgroundColor: color1}, activeDotStyle] : [styles.barDotInactive, {backgroundColor: color2}, inActiveDotStyle]} />;
};

const CircleDot = ({isActive, color1, color2, activeDotStyle, inActiveDotStyle}) => {
  return <View style={isActive ? [styles.circleDotActive, {backgroundColor: color1}, activeDotStyle] : [styles.circleDotInactive, {backgroundColor: color2}, inActiveDotStyle]} />;
};

const styles = StyleSheet.create({
  dotsContainer: {flexDirection: 'row', alignSelf: 'center', alignItems: 'center'},
  barDotActive: {width: 30, height: 8, borderRadius: 100},
  barDotInactive: {width: 8, height: 8, borderRadius: 100},
  circleDotActive: {width: 15, height: 15, borderRadius: 100},
  circleDotInactive: {width: 8, height: 8, borderRadius: 100},
});

export default PaginateDots;
