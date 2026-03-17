import {View, Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import {AppButton, AppScrollView, AppText, AppTextInput, Header, Screen} from '../../../components';
import {tipStyles} from '../styles';
import {CheckCircleIcon, CheckRadioIcon, UnCheckCircleIcon, UnCheckRadioIcon} from '../../../assets/icons';
import globalStyles from '../../../../globalStyles';

const AddTip = () => {
  const [selected, setSelected] = useState(null);
  const TIPS = [{amount: '20'}, {amount: '30'}, {amount: '40'}, {amount: '50'}, {amount: '60'}, {amount: 'Others'}];
  console.log(selected);
  return (
    <Screen>
      <Header title={'Add Tip'} />
      <AppScrollView>
        <AppText greyText>Lorem ipsum dolor sit amet consectetur. Urna suscipit ornare leo sit augue. Posuere bibendum phasellus hac tincidunt lorem malesuada. Id.</AppText>

        <View style={tipStyles.itemsContainer}>
          {TIPS.map((tip, index) => (
            <Pressable key={index} style={tipStyles.item} onPress={() => setSelected(tip.amount)}>
              {selected === tip.amount ? <CheckRadioIcon width={20} height={20} /> : <UnCheckRadioIcon width={20} height={20} />}
              <AppText greyText fontSize={12}>
                {tip.amount !== 'Others' ? `$${tip.amount}` : 'Others'}
              </AppText>
            </Pressable>
          ))}

          {selected === 'Others' ? <AppTextInput placeholder="Amount" /> : null}
        </View>

        <AppButton title={'Pay Now'} containerStyle={globalStyles.bottomButton} />
      </AppScrollView>
    </Screen>
  );
};

export default AddTip;
