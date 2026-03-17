import {FlatList} from 'react-native';
import React from 'react';
import {FlatListEmptyComponent, Header, Screen, ShopCard} from '../../../components';
import globalStyles from '../../../../globalStyles';
import {shopsNearMeSelector} from '../../../redux/selectors';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES} from '../../../utils/constants';
import commonAPI from '../../../network/commonAPI';
import {customerHomeActions} from '../../../redux/slices/customer/customerHome';

const Shops = ({navigation}) => {
  const dispatch = useDispatch();
  const shopsNearMe = useSelector(shopsNearMeSelector);

  const handleShopPress = item => {
    const shopId = item?._id;
    if (shopId) navigation.navigate(ROUTES.ShopDetails, {shopId});
  };

  const handleLikeUnLikeShop = item => {
    const shopId = item?._id;
    dispatch(customerHomeActions.setShopLike(shopId));
    commonAPI.shopLikeUnlike(shopId);
  };

  return (
    <Screen>
      <Header title={'Shops'} />

      <FlatList
        data={shopsNearMe}
        renderItem={({item, index}) => <ShopCard key={index} item={item} onPress={handleShopPress} onPressHeartIcon={handleLikeUnLikeShop} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={[globalStyles.screenPadding, globalStyles.inputsGap, globalStyles.flexGrow1]}
        ListEmptyComponent={<FlatListEmptyComponent label={'No Shop'} />}
      />
    </Screen>
  );
};

export default Shops;
