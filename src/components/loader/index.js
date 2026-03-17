import {StyleSheet} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {COLORS, FONTS} from '../../utils/theme';

export const Loader = ({isLoading}) => {
  if (!isLoading) return null;

  return <Spinner visible={isLoading} textContent={'Loading...'} color={COLORS.primary} textStyle={styles.textContent} />;
};

const styles = StyleSheet.create({
  textContent: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
});
