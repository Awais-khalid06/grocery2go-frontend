import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {RedArrowIcon, WhiteAngledArrowIcon} from '../../assets/icons';
import AppText from '../text';
import globalStyles from '../../../globalStyles';
import {COLORS, FONTS} from '../../utils/theme';
import {IconWrapper} from '../../screens/main/home/userHome';
import dayjs from 'dayjs';

const EarningCard = ({item}) => {
  return (
    <View style={styles.container}>
      <RedArrowIcon width={30} height={30} />
      <View style={[globalStyles.flex1, styles.leftText]}>
        <AppText fontFamily={FONTS.medium} fontSize={12}>
          {item?.order?.orderNumber || item?.orderNumber}
        </AppText>
        {item?.card && (
          <AppText fontSize={10} greyText>
            ****************8913
          </AppText>
        )}
      </View>

      <View style={styles.rightText}>
        <AppText fontSize={12} style={styles.dollarCount}>
          +{item?.amount}$
        </AppText>
        <AppText fontSize={12} greyText>
          {dayjs(item?.createdAt).format('DD/MM/YYYY - hh:mm A')}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'center', gap: 12},
  rightText: {alignItems: 'flex-end', gap: 3},
  dollarCount: {color: COLORS.green},
  leftText: {gap: 3},
});

export default EarningCard;
