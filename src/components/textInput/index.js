import React, {useState} from 'react';
import {TextInput, View, StyleSheet, Pressable} from 'react-native';
import {COLORS, FONTS} from '../../utils/theme';
import AppText from '../text';
import {EyeClosedIcon, EyeShowIcon} from '../../assets/icons';

function AppTextInput({
  RightIcon,
  LeftIcon,
  width = '100%',
  onChangeText,
  containerStyle,
  placeholder = '',
  innerRef,
  onPressRightIcon,
  textInputStyle,
  secureTextEntry,
  label,
  multiline,
  textInputContainerStyle,
  keyboardType,
  isPasswordEye,
  ...otherProps
}) {
  const [passwordShow, setPasswordShow] = useState(true);

  return (
    <View style={containerStyle}>
      {label && <AppText style={styles.label}>{label}</AppText>}

      <View style={[styles.searchSection, textInputContainerStyle]}>
        {LeftIcon && <LeftIcon height={20} />}

        <TextInput
          ref={innerRef}
          style={[styles.input, textInputStyle]}
          selectionColor={COLORS.primary}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textGray}
          secureTextEntry={isPasswordEye && passwordShow}
          onChangeText={onChangeText}
          multiline={multiline}
          keyboardType={keyboardType}
          {...otherProps}
        />

        {RightIcon && (
          <Pressable onPress={onPressRightIcon}>
            <RightIcon height={18} width={18} />
          </Pressable>
        )}

        {isPasswordEye && <Pressable onPress={() => setPasswordShow(!passwordShow)}>{!passwordShow ? <EyeShowIcon height={18} width={18} /> : <EyeClosedIcon height={18} width={18} />}</Pressable>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.grey2,
    backgroundColor: COLORS.white,
  },

  input: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.black,
    height: '100%',
    paddingHorizontal: 7,
    includeFontPadding: false,
  },
  label: {fontFamily: FONTS.medium, marginBottom: 7},
});

export default AppTextInput;
