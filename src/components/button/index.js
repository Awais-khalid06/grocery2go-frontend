import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import AppText from '../text';
import {COLORS, FONTS} from '../../utils/theme';
import LinearGradient from 'react-native-linear-gradient';

const AppButton = ({title, containerStyle, style, textStyle, onPress, LeftIcon, RightIcon, disabled, gradientOtherProps, transparentButton, ...restProps}) => {
  let colors = [COLORS.secondary, COLORS.primary];
  if (disabled) colors = [COLORS.grey5, COLORS.grey5];
  else if (transparentButton) colors = ['transparent', 'transparent'];

  return (
    <LinearGradient colors={colors} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={[styles.primary, containerStyle]} {...gradientOtherProps}>
      <TouchableOpacity disabled={disabled} style={[styles.primary, style]} onPress={onPress} activeOpacity={0.5} {...restProps}>
        {LeftIcon ? LeftIcon : null}
        <AppText style={[styles.primaryText, {color: transparentButton ? COLORS.black : COLORS.white}, textStyle]}>{title}</AppText>
        {RightIcon ? RightIcon : null}
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  primary: {
    width: '100%',
    height: 45,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },

  primaryText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
});

export default AppButton;
