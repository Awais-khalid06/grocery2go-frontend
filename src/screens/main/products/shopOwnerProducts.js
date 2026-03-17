import {FlatList, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FlatListEmptyComponent, Header, Loader, Screen} from '../../../components';
import globalStyles from '../../../../globalStyles';
import CartItem from '../../../components/UI/cartItem';
import {ROUTES} from '../../../utils/constants';
import {listStyles} from '../styles';
import {PlusIcon} from '../../../assets/icons';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';
import {useDispatch, useSelector} from 'react-redux';
import {shopOwnerProductsSelector, userSelector} from '../../../redux/selectors';
import {shopOwnerProductActions} from '../../../redux/slices/shopOwner/shopOwnerProduct';

const ShopOwnerProducts = ({navigation}) => {
  const products = useSelector(shopOwnerProductsSelector);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(userSelector) || {};
  const shopId = user?.shopId;

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    if (!shopId) return;

    const onSuccess = response => {
      if (response.success) {
        console.log(response);
        dispatch(shopOwnerProductActions.setMyProducts(response.data));
      }
    };

    callApi(API_METHODS.GET, `${API.getShopProducts}`, null, onSuccess, onAPIError, setIsLoading);
  };

  return (
    <Screen>
      <Header title={'Products'} />
      <Loader isLoading={isLoading} />
      <FlatList
        data={products}
        refreshing={false}
        onRefresh={getProducts}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<FlatListEmptyComponent label={'No Product'} />}
        renderItem={({item, index}) => (
          <CartItem
            item={item}
            onPress={() => navigation.navigate(ROUTES.ProductDetail, {screenType: 'OWNER_SEE_PRODUCT', productId: item._id})}
            isCounter={false}
            isQuatity={false}
            isCrossIcon={false}
            type={'PRODUCT'}
            onPressEdit={() => navigation.navigate(ROUTES.AddProduct, {screenType: 'EDIT_MODE', productId: item?._id, shopId: user?.shopId})}
          />
        )}
        contentContainerStyle={[globalStyles.flexGrow1, globalStyles.screenPadding, globalStyles.inputsGap, globalStyles.screenPaddingBottom10]}
      />

      <Pressable style={listStyles.addContainer} onPress={() => navigation.navigate(ROUTES.AddProduct)}>
        <PlusIcon />
      </Pressable>
    </Screen>
  );
};

export default ShopOwnerProducts;
