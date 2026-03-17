import {View} from 'react-native';
import React from 'react';
import AppModal from '../modal';
import globalStyles from '../../../globalStyles';
import {MapLocationIcon} from '../../assets/icons';
import {cartStyles} from '../../screens/main/styles';
import {FONTS} from '../../utils/theme';
import AppText from '../text';
import AppButton from '../button';

const AddressVerificationModal = ({isVisible, setIsVisible, onPressChange, onPressContinue}) => {
  return (
    <AppModal isVisible={isVisible} setIsVisible={setIsVisible}>
      <View style={globalStyles.modalContainer}>
        <MapLocationIcon width={120} height={120} />
        <View style={cartStyles.modalContent}>
          <AppText fontFamily={FONTS.medium}>Correct delivery address?</AppText>
          <AppText greyText fontSize={12}>
            Lorem ipsum dolor sit amet
          </AppText>
        </View>

        <View style={cartStyles.modalbuttons}>
          <AppButton containerStyle={cartStyles.modalContinueBtn} title={'Change'} onPress={onPressChange} />
          <AppText fontFamily={FONTS.semiBold} fontSize={12} onPress={onPressContinue}>
            Continue
          </AppText>
        </View>
      </View>
    </AppModal>
  );
};

export default AddressVerificationModal;
