import {View, Pressable, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppText, FlatListEmptyComponent, GroceryCard, Header, Loader, Screen, ShopCard} from '../../../components';
import {favoriteStyles} from '../styles';
import globalStyles from '../../../../globalStyles';
import {onAPIError, wp} from '../../../helpers';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {ROUTES} from '../../../utils/constants';
import commonAPI from '../../../network/commonAPI';
import {useDispatch} from 'react-redux';
import {customerHomeActions} from '../../../redux/slices/customer/customerHome';
import useCustomerCart from '../../../hooks/useCustomerCart';

const Favorite = ({navigation}) => {
  const dispatch = useDispatch();
  const {handleAddItemToCart} = useCustomerCart();
  const [activeTab, setActiveTab] = useState('Shops');
  const [isLoading, setIsLoading] = useState(false);
  const [favoritesProducts, setFavoritesProducts] = useState([]);
  const [favoriteShops, setFavroiteShops] = useState([]);

  useEffect(() => {
    getAllFavoriteShops();
    getAllFavoriteProducts();
  }, []);

  const getAllFavoriteProducts = () => {
    const onSuccess = response => {
      if (response.success) {
        setFavoritesProducts(response.data.map(i => ({...i, isFavorite: true})));
      }
    };
    callApi(API_METHODS.GET, API.getFavorite, null, onSuccess, onAPIError, setIsLoading);
  };

  const getAllFavoriteShops = () => {
    const onSuccess = response => {
      if (response.success) {
        setFavroiteShops(response.data.map(i => ({...i, isFavorite: true})));
      }
    };
    callApi(API_METHODS.GET, API.getAllFavShops, null, onSuccess, onAPIError, setIsLoading);
  };

  const handleProductPress = item => {
    if (item?._id) navigation.navigate(ROUTES.ProductDetail, {productId: item._id});
  };

  const handleAddToCart = item => {
    handleAddItemToCart(item);
  };

  const handleRemoveProductFromFavorite = item => {
    const itemId = item?._id;
    setFavoritesProducts(favoritesProducts.filter(i => i._id != itemId));
    dispatch(customerHomeActions.setGroceeryLike(itemId));
    commonAPI.productLikeUnlike(itemId);
  };

  const handleRemoveShopFromFavorite = item => {
    const shopId = item?._id;
    setFavroiteShops(favoriteShops.filter(i => i._id !== shopId));
    dispatch(customerHomeActions.setShopLike(shopId));
    commonAPI.shopLikeUnlike(shopId);
  };

  const handleShopPress = item => {
    const shopId = item?._id;
    if (shopId) navigation.navigate(ROUTES.ShopDetails, {shopId});
  };

  return (
    <Screen>
      <Header title={'Favorite'} />
      <Loader isLoading={isLoading} />
      <View style={favoriteStyles.tabContainer}>
        <Pressable style={[favoriteStyles.tab, activeTab === 'Shops' ? favoriteStyles.activeTab : null]} onPress={() => setActiveTab('Shops')}>
          <AppText primary={activeTab === 'Shops' ? true : false}>Shops</AppText>
        </Pressable>
        <Pressable style={[favoriteStyles.tab, activeTab === 'Products' ? favoriteStyles.activeTab : null]} onPress={() => setActiveTab('Products')}>
          <AppText primary={activeTab === 'Products' ? true : false}>Products</AppText>
        </Pressable>
      </View>

      <FlatList
        key={activeTab}
        data={activeTab === 'Shops' ? favoriteShops : favoritesProducts}
        numColumns={activeTab === 'Shops' ? undefined : 2}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<FlatListEmptyComponent label={isLoading ? '' : activeTab === 'Shops' ? 'No Shop' : 'No Product'} />}
        renderItem={({item, index}) => {
          if (activeTab === 'Shops') return <ShopCard item={item} onPress={handleShopPress} onPressHeartIcon={handleRemoveShopFromFavorite} />;
          return (
            <GroceryCard
              style={{maxWidth: wp(48)}}
              item={item}
              isHeartComponent={true}
              onPress={handleProductPress}
              onPressHeartIcon={handleRemoveProductFromFavorite}
              onPressPlusIcon={handleAddToCart}
            />
          );
        }}
        columnWrapperStyle={activeTab === 'Shops' ? null : favoriteStyles.productContentContainer}
        contentContainerStyle={activeTab === 'Shops' ? [globalStyles.screenPadding, globalStyles.inputsGap, globalStyles.flexGrow1] : [globalStyles.screenPadding, globalStyles.flexGrow1, {gap: 10}]}
        style={activeTab === 'Shops' ? favoriteStyles.marginTop15 : {...favoriteStyles.marginTop15}}
      />
    </Screen>
  );
};

export default Favorite;
