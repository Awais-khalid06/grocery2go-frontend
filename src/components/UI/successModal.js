import {View} from 'react-native';
import React from 'react';
import AppModal from '../modal';
import globalStyles from '../../../globalStyles';
import {GreenTickIcon} from '../../assets/icons';
import {cartStyles} from '../../screens/main/styles';
import {FONTS} from '../../utils/theme';
import AppText from '../text';
import AppButton from '../button';

const SuccessModal = ({isVisible, setIsVisible, onPressButton, buttonTitle, heading, description}) => {
  return (
    <AppModal isVisible={isVisible} setIsVisible={setIsVisible}>
      <View style={[globalStyles.modalContainer, {paddingHorizontal: 0}]}>
        <GreenTickIcon width={100} height={100} />
        <View style={[cartStyles.modalContent, {marginTop: 20, gap: 10}]}>
          <AppText fontFamily={FONTS.medium} fontSize={18}>
            {heading}
          </AppText>
          <AppText greyText fontSize={12} style={{textAlign: 'center'}}>
            {description}
          </AppText>
        </View>

        <View style={cartStyles.modalbuttons}>
          <AppButton containerStyle={cartStyles.modalContinueBtn} title={buttonTitle} onPress={onPressButton} />
        </View>
      </View>
    </AppModal>
  );
};

export default SuccessModal;
