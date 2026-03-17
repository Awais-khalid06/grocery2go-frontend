import {View, Text} from 'react-native';
import React from 'react';
import {AppButton, AppScrollView, AppText, AppTextInput, Header, Screen} from '../../../components';
import globalStyles from '../../../../globalStyles';
import {FONTS} from '../../../utils/theme';

const BankDetail = ({navigation}) => {
  return (
    <Screen>
      <Header title={'Bank Detail'} />
      <AppScrollView>
        <View style={[globalStyles.flex1, {gap: 10}]}>
          <AppText fontFamily={FONTS.medium} fontSize={16}>
            Add Bank Info
          </AppText>
          <AppText fontSize={12} greyText>
            Lorem ipsum dolor sit amet consectetur. Adipiscing pulvinar nulla nullam sit ultricies.
          </AppText>
          <View style={[globalStyles.inputsGap, {marginTop: 25}]}>
            <AppTextInput placeholder="Bank Info" />
            <AppTextInput placeholder="Account no" />
          </View>
        </View>
        <AppButton title={'Done'} containerStyle={globalStyles.bottomButton} onPress={() => navigation.goBack()} />
      </AppScrollView>
    </Screen>
  );
};

export default BankDetail;
