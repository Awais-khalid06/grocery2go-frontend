import {View, Image, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppScrollView, AppText, GroceryCard, Header, Loader, Screen} from '../../../components';
import {homeStyles, shopDetailStyles} from '../styles';
import {GrayHeartCircleIcon, LocationGrayIcon, RedHeartCircleIcon} from '../../../assets/icons';
import {FONTS} from '../../../utils/theme';
import globalStyles from '../../../../globalStyles';
import {ROUTES} from '../../../utils/constants';
import commonAPI from '../../../network/commonAPI';
import dayjs from 'dayjs';
import {useDispatch} from 'react-redux';
import {customerHomeActions} from '../../../redux/slices/customer/customerHome';
import useCustomerCart from '../../../hooks/useCustomerCart';

const ShopDetails = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {handleAddItemToCart} = useCustomerCart();
  const [shop, setShop] = useState({});
  const [isImagesLoad, setIsImagesLoad] = useState(false);
  const params = route.params;
  const shopId = params?.shopId;

  const products = shop?.groceries || [];

  useEffect(() => {
    getShopDetail();
  }, [shopId]);

  const getShopDetail = async () => {
    setIsLoading(true);
    const [shopResponse, productsResponse] = await Promise.all([
      commonAPI.getOneShop(shopId),
      commonAPI.getShopProducts(shopId),
    ]);
    setIsLoading(false);

    if (shopResponse.success) {
      const shopData = shopResponse?.data?.data || {};
      const productsFromShopDetail = Array.isArray(shopData?.groceries) ? shopData.groceries : [];
      const productsFromDedicatedAPI = Array.isArray(productsResponse?.data)
        ? productsResponse.data
        : Array.isArray(productsResponse?.data?.data)
          ? productsResponse.data.data
          : null;

      const products = productsResponse?.success && productsFromDedicatedAPI
        ? productsFromDedicatedAPI
        : productsFromShopDetail;

      setShop({...shopData, groceries: products});
    }
  };

  const handleLikeUnLikeShop = () => {
    dispatch(customerHomeActions.setShopLike(shopId));
    setShop({...shop, isFavorite: !shop?.isFavorite});
    commonAPI.shopLikeUnlike(shopId);
  };

  const operatingHours = shop?.operatingHours || '';
  const operatingFrom = operatingHours?.split?.('to')?.[0];
  const operatingTo = operatingHours.split?.('to')?.[1];
  const formatedOperatingFrom = dayjs(operatingFrom).format('hh:mm A');
  const formatedOperatingTo = dayjs(operatingTo).format('hh:mm A');

  if (isLoading) {
    return (
      <Screen>
        <Header title={'Shop Details'} />
        <Loader isLoading={isLoading} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title={'Shop Details'} />

      {shop?.image && <Image source={{uri: shop?.image}} style={shopDetailStyles.image} />}
      <AppScrollView>
        <View style={[shopDetailStyles.rowAndCenter, shopDetailStyles.shopInfoContainer]}>
          <View style={[globalStyles.flex1, shopDetailStyles.textContent]}>
            <AppText fontSize={16} fontFamily={FONTS.semiBold}>
              {shop?.shopTitle}
            </AppText>
            <View style={[shopDetailStyles.rowAndCenter, {gap: 5}]}>
              <LocationGrayIcon width={12} height={12} />
              <AppText greyText fontSize={12}>
                {shop?.location?.address}
              </AppText>
            </View>
          </View>
          {<Pressable onPress={handleLikeUnLikeShop}>{shop?.isFavorite ? <RedHeartCircleIcon width={35} height={35} /> : <GrayHeartCircleIcon width={35} height={35} />}</Pressable>}
        </View>

        <View style={[shopDetailStyles.rowAndCenter, shopDetailStyles.justifyCenterAndMT15]}>
          <AppText fontFamily={FONTS.medium}>Operating hours</AppText>
          <AppText fontSize={12} fontFamily={FONTS.medium}>
            {formatedOperatingFrom}-{formatedOperatingTo}
          </AppText>
        </View>

        <View style={[shopDetailStyles.rowAndCenter, shopDetailStyles.justifyCenterAndMT15]}>
          <AppText fontFamily={FONTS.medium}>Reviews</AppText>
          <AppText fontSize={12} fontFamily={FONTS.medium}>
            {shop?.totalReviews || 0}
          </AppText>
        </View>

        <View style={[homeStyles.sectionLabel]}>
          <AppText fontFamily={FONTS.semiBold} style={globalStyles.flex1}>
            Products
          </AppText>
          <AppText fontSize={12} primary onPress={() => navigation.navigate(ROUTES.Groceries, {groceriesOfOneShop: products})}>
            See All
          </AppText>
        </View>

        <View style={shopDetailStyles.productContainer}>
          {products.map((product, index) => (
            <GroceryCard
              onPressPlusIcon={handleAddItemToCart}
              onPress={() => navigation.navigate(ROUTES.ProductDetail, {productId: product?._id})}
              style={shopDetailStyles.productCard}
              item={product}
              key={index}
            />
          ))}
        </View>

        {products.length == 0 && (
          <View style={shopDetailStyles.noProductContainer}>
            <AppText>No Product</AppText>
          </View>
        )}
      </AppScrollView>
    </Screen>
  );
};

export default ShopDetails;
