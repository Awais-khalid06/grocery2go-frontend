import {View} from 'react-native';
import React, {useState} from 'react';
import {AppButton, AppScrollView, AppText, AppTextInput, Header, Loader, Screen, ShowMessage} from '../../../components';
import globalStyles from '../../../../globalStyles';
import commonAPI from '../../../network/commonAPI';

const ManageStock = ({navigation, route}) => {
  const [quantity, setQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const productId = route.params?.productId;

  const handleDone = async () => {
    if (!quantity) return ShowMessage('Please add quantity');

    const data = {productId: productId, productDetails: {quantity}};
    setIsLoading(true);
    const response = await commonAPI.updateProductAPI(data);
    setIsLoading(false);

    if (response.success) navigation.goBack();
  };

  return (
    <Screen>
      <Header title={'Manage Stock'} />
      <Loader isLoading={isLoading} />
      <AppScrollView>
        <View style={[globalStyles.inputsGap, globalStyles.flex1]}>
          <AppText>Lorem ipsum dolor sit amet consectetur. Eget urna neque pellentesque eu dui.</AppText>
          <AppTextInput keyboardType="number-pad" placeholder="400" onChangeText={setQuantity} />
        </View>

        <AppButton title={'Done'} containerStyle={globalStyles.bottomButton} onPress={handleDone} />
      </AppScrollView>
    </Screen>
  );
};

export default ManageStock;
