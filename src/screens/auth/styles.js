import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../utils/theme';
import {hp, isIOS, wp} from '../../helpers';

export const splashStyles = StyleSheet.create({
  backgroundImage: {flex: 1, height: hp(110)},
  logo: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export const signUpStyles = StyleSheet.create({
  headText: {gap: 5},
  actionButton: {marginTop: 130},
  bottomContent: {alignSelf: 'center', alignItems: 'center', gap: 15, marginVertical: 40},
  inputsContainer: {marginTop: 25},
  socialIcons: {flexDirection: 'row', gap: 15},
  rememberContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  checkContainer: {flexDirection: 'row', alignItems: 'center', gap: 5},
  phoneInput: {
    width: '100%',
    height: 45,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.grey2,
  },
  phoneInputTextInput: {
    color: COLORS.black,
    fontFamily: FONTS.regular,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontSize: 12,
  },
  phoneInputTextContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
  phoneInputCodeText: {
    color: COLORS.black,
    fontFamily: FONTS.regular,
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontSize: 12,
  },
  buttonContainer: {marginTop: 25, alignItems: 'center'},
  bottomBox: {},
});

export const accountTypeStyles = StyleSheet.create({
  logo: {alignSelf: 'center'},
  accountsContainer: {marginTop: 20, gap: 20},
  content: {marginBottom: 40},
});

export const onboardingStyles = StyleSheet.create({
  onBoardContainer: {width: wp(100), alignItems: 'center'},
  headText: {fontFamily: FONTS.bold, textAlign: 'center', fontSize: 18},
  headDescription: {textAlign: 'center', color: COLORS.textGray, marginTop: 10},
  textContainer: {width: '80%', marginTop: 35, alignSelf: 'center'},

  dotsContainer: {flexDirection: 'row', alignSelf: 'center', gap: 8, marginBottom: 35},
  dotActive: {width: 38, height: 8, borderRadius: 100},
  dotInactive: {width: 8, height: 8, borderRadius: 100},

  buttonContainer: {width: '90%', alignSelf: 'center', marginVertical: isIOS ? 10 : 30, flexDirection: 'row', justifyContent: 'space-between'},
  actionButton: {width: '48%'},
  flatList: {justifyContent: 'center', alignItems: 'center', flexGrow: 1},
  paginateAndButton: {marginTop: 30, gap: 50},
  contentContainer: {flex: 1, justifyContent: 'center', paddingTop: '5%'},
});

export const otpVerifyStyles = StyleSheet.create({
  otpInput: {
    borderWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 100,
    height: 50,
    width: 50,
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    marginTop: 40,
    color: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  buttonContainer: {alignItems: 'center', gap: 20},
});

export const addBankStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  wrapper: {
    flex: 1,
    width: '100%',
  },
  fg1: {
    flexGrow: 1,
  },
  webviewStyle: {
    flex: 1,
    width: wp(100),
  },
});
