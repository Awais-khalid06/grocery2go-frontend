import {FlatList} from 'react-native';
import React, {useCallback, useState} from 'react';
import {FlatListEmptyComponent, GroceryCard, Header, Screen} from '../../../components';
import globalStyles from '../../../../globalStyles';
import {favoriteStyles} from '../styles';
import {useDispatch, useSelector} from 'react-redux';
import {groceriesSelector} from '../../../redux/selectors';
import {ROUTES} from '../../../utils/constants';
import commonAPI from '../../../network/commonAPI';
import useCustomerCart from '../../../hooks/useCustomerCart';
import {wp} from '../../../helpers';

const Groceries = ({navigation, route}) => {
  const dispatch = useDispatch();
  const randomGroceries = useSelector(groceriesSelector);
  const params = route?.params;
  const groceriesOfOneShop = params?.groceriesOfOneShop;
  const [groceries, setGroceries] = useState(groceriesOfOneShop ? groceriesOfOneShop : randomGroceries);
  const {handleAddItemToCart} = useCustomerCart();
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const handleLikeUnlike = useCallback(
    async (item, index) => {
      const productId = item?._id;

      if (productId) {
        setGroceries(groceries.map(i => (i._id == productId ? {...i, isFavorite: !i.isFavorite} : i)));

        setIsLikeLoading(true);
        await commonAPI.productLikeUnlike(productId);
        setIsLikeLoading(false);
      }
    },
    [groceries, dispatch],
  );

  const handleProductPress = item => {
    navigation.navigate(ROUTES.ProductDetail, {productId: item?._id});
  };

  const handleAddToCart = item => {
    handleAddItemToCart(item);
  };

  return (
    <Screen>
      <Header title={'Groceries'} />

      <FlatList
        data={groceries}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return (
            <GroceryCard
              index={index}
              onPressHeartIcon={handleLikeUnlike}
              onPress={handleProductPress}
              item={item}
              style={{maxWidth: wp(48)}}
              isHeartComponent={true}
              isLikeLoading={isLikeLoading}
              onPressPlusIcon={handleAddToCart}
            />
          );
        }}
        ListEmptyComponent={<FlatListEmptyComponent label={'No Grocery'} />}
        columnWrapperStyle={favoriteStyles.productContentContainer}
        contentContainerStyle={[globalStyles.screenPadding, globalStyles.flexGrow1, {gap: 10}]}
        style={{...favoriteStyles.marginTop15}}
      />
    </Screen>
  );
};

export default Groceries;
