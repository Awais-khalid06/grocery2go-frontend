import {View, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import AppText from '../text';
import {FONTS} from '../../utils/theme';
import {ArrowIcon} from '../../assets/icons';

const Header = ({title, RightIcon, LeftIcon, titleTextStyle, onPressLeftIcon, onPressRightIcon, leftIconStyle, rightIconStyle}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Pressable onPress={onPressLeftIcon ? onPressLeftIcon : () => (navigation.canGoBack() ? navigation.goBack() : null)} style={[styles.leftContainer, leftIconStyle]}>
          {LeftIcon ? LeftIcon : <ArrowIcon />}
        </Pressable>

        <AppText style={[styles.titleText, titleTextStyle]}>{title}</AppText>
      </View>

      <Pressable onPress={onPressRightIcon} style={[styles.rightContainer, rightIconStyle]}>
        {RightIcon ? RightIcon : null}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 45,
    marginHorizontal: '5%',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rightContainer: {
    // position: 'absolute',
    // alignSelf: 'flex-end',
  },
  titleText: {fontFamily: FONTS.semiBold, fontSize: 16},
});

export default Header;
