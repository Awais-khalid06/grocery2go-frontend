import {View, Text} from 'react-native';
import React from 'react';
import {AppButton, AppText, ColorMixerBackground} from '../../../components';
import {TickCongratIcon} from '../../../assets/icons';
import {FONTS} from '../../../utils/theme';
import {orderAcceptStyles} from '../styles';
import {wp} from '../../../helpers';

const OrderAccepted = ({navigation}) => {
  return (
    <ColorMixerBackground>
      <View style={orderAcceptStyles.container}>
        <TickCongratIcon width={wp(55)} height={wp(55)} />
        <View style={orderAcceptStyles.contentText}>
          <AppText style={{textAlign: 'center'}} fontFamily={FONTS.medium} fontSize={18}>
            Your Order has been accepted
          </AppText>
          <AppText fontSize={12} greyText style={{textAlign: 'center'}}>
            Your items has been placcd and is on it’s way to being processed
          </AppText>
        </View>

        <View style={orderAcceptStyles.buttonsContainer}>
          <AppButton title={'Track order'} onPress={() => navigation.popToTop()} />
          <AppText fontFamily={FONTS.semiBold} onPress={() => navigation.popToTop()}>
            Back to home
          </AppText>
        </View>
      </View>
    </ColorMixerBackground>
  );
};

export default OrderAccepted;
