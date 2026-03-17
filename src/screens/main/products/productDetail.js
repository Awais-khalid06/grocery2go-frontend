import {View, Image, ScrollView, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppButton, AppModal, AppScrollView, AppText, Header, Loader, PaginateDots, Screen, SeperatorLine} from '../../../components';
import {ChevronIcon, GrayHeartCircleIcon, MinusIcon, PlusIcon, RedHeartCircleIcon} from '../../../assets/icons';
import {productDetailStyles, shopDetailStyles} from '../styles';
import globalStyles from '../../../../globalStyles';
import {COLORS, FONTS} from '../../../utils/theme';
import {CURRENCY_UNIT, ROUTES} from '../../../utils/constants';
import {useAccountType} from '../../../hooks';
import {useDispatch, useSelector} from 'react-redux';
import {shopOwnerProductActions} from '../../../redux/slices/shopOwner/shopOwnerProduct';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';
import {userSelector} from '../../../redux/selectors';
import commonAPI from '../../../network/commonAPI';
import {customerHomeActions} from '../../../redux/slices/customer/customerHome';
import useCustomerCart from '../../../hooks/useCustomerCart';

const ProductDetail = ({route, navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector) || {};
  const {handleAddItemToCart} = useCustomerCart();
  const params = route.params || {};
  const [activeBoardIndex, setActiveBoardIndex] = useState(0);
  const {isCustomer, isGroceryOwner} = useAccountType();
  const [counter, setCounter] = useState(1);
  const [isProductDetail, setIsProductDetail] = useState(true);
  const [deleteModalShow, setDeleteModelShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [product, setProduct] = useState({});

  const screenType = params?.screenType;
  const isOwnerSeeProduct = screenType === 'OWNER_SEE_PRODUCT';
  const productId = params?.productId;

  useEffect(() => {
    if (productId) {
      getProductDetails();
    }
  }, [productId]);

  const getProductDetails = async () => {
    setIsLoading(true);
    const response = await commonAPI.getOneProductDetail(productId);

    setIsLoading(false);
    if (response.success) setProduct(response.data);
  };

  const handleMomentumScrollEnd = event => {
    const index = Math.floor(Math.floor(event.nativeEvent.contentOffset.x) / Math.floor(event.nativeEvent.layoutMeasurement.width));
    setActiveBoardIndex(index);
  };

  const handleDeleteProduct = () => {
    setDeleteModelShow(false);

    deleteProductAPI();
  };

  const deleteProductAPI = () => {
    const onSuccess = response => {
      if (response.success) {
        dispatch(shopOwnerProductActions.removeProductFromMyProducts(productId));
        navigation.goBack();
      }
    };

    callApi(API_METHODS.DELETE, `${API.deleteProduct}/${productId}`, null, onSuccess, onAPIError, setIsLoading);
  };

  const handleAddtoCart = () => {
    handleAddItemToCart(product, counter);
  };

  const handleLikeUnlike = async () => {
    if (productId) {
      dispatch(customerHomeActions.setGroceeryLike(productId));
      setProduct({...product, isFavorite: !product.isFavorite});

      setIsLikeLoading(true);
      await commonAPI.productLikeUnlike(productId);
      setIsLikeLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Screen>
        <Header title={'Product Details'} />
        <Loader isLoading={isLoading} />
      </Screen>
    );
  }

  const renderFooterButtons = () => {
    if (isOwnerSeeProduct) {
      return (
        <View style={[globalStyles.bottomButton, {gap: 15}]}>
          <AppButton
            title={'Delete Product'}
            textStyle={productDetailStyles.deleteBtntext}
            containerStyle={productDetailStyles.deleteProductButton}
            gradientOtherProps={{colors: ['transparent', 'transparent']}}
            onPress={() => setDeleteModelShow(true)}
          />
          <AppButton title={'Edit Product'} onPress={() => navigation.navigate(ROUTES.AddProduct, {screenType: 'EDIT_MODE', productId: product?._id, shopId: user?.shopId})} />
        </View>
      );
    } else {
      return <AppButton title={'Add To Cart'} onPress={handleAddtoCart} containerStyle={globalStyles.bottomButton} />;
    }
  };

  return (
    <Screen>
      <Header title={'Product Details'} />
      <AppScrollView contentContainerStyle={{paddingHorizontal: 0}}>
        <View style={productDetailStyles.imageContainer}>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={globalStyles.flexGrow1} pagingEnabled onMomentumScrollEnd={handleMomentumScrollEnd}>
            {product?.productImages?.map?.((img, index) => (
              <Image key={index} source={{uri: img}} style={productDetailStyles.image} />
            ))}
          </ScrollView>

          <PaginateDots
            totalIndex={product?.productImages?.length}
            type="dots"
            activeIndex={activeBoardIndex}
            activeDotStyle={{width: 25, height: 5}}
            inActiveDotStyle={{width: 5, height: 5}}
            gap={4}
            style={{marginBottom: 12}}
            color1={COLORS.green}
          />
        </View>
        <View style={[globalStyles.flex1, globalStyles.screenPadding, {marginTop: 10}]}>
          <View style={[shopDetailStyles.rowAndCenter, shopDetailStyles.shopInfoContainer]}>
            <View style={[globalStyles.flex1, shopDetailStyles.textContent]}>
              <AppText fontSize={16} fontFamily={FONTS.semiBold}>
                {product?.productName}
              </AppText>
              <AppText greyText fontSize={12}>
                {product.volume}, price
              </AppText>
            </View>
            {isCustomer && (
              <Pressable onPress={handleLikeUnlike} disabled={isLikeLoading} style={{opacity: isLikeLoading ? 0.5 : 1}}>
                {product?.isFavorite ? <RedHeartCircleIcon width={35} height={35} /> : <GrayHeartCircleIcon width={35} height={35} />}
              </Pressable>
            )}
          </View>

          {isCustomer && (
            <View style={productDetailStyles.counterMainContainer}>
              <View style={productDetailStyles.counterContainer}>
                <Pressable
                  onPress={() => {
                    if (counter > 1) setCounter(prev => prev - 1);
                  }}>
                  <MinusIcon />
                </Pressable>
                <View style={productDetailStyles.counter}>
                  <AppText fontFamily={FONTS.medium}>{counter}</AppText>
                </View>

                <Pressable onPress={() => setCounter(prev => prev + 1)}>
                  <PlusIcon />
                </Pressable>
              </View>

              <AppText fontSize={22} primary fontFamily={FONTS.semiBold}>
                ${product?.price}
              </AppText>
            </View>
          )}

          {isGroceryOwner && (
            <View style={productDetailStyles.ownerPriceAndQuantity}>
              <View style={productDetailStyles.rowItem}>
                <AppText>Price</AppText>
                <AppText fontSize={12} fontFamily={FONTS.medium}>
                  {CURRENCY_UNIT}
                  {product?.price}
                </AppText>
              </View>
              <View style={productDetailStyles.rowItem}>
                <AppText>{product?.quantity !== 0 ? 'Quantity' : 'Volume'}</AppText>
                <AppText fontSize={12} fontFamily={FONTS.medium}>
                  {product?.quantity !== 0 ? product?.quantity : product?.volume}
                </AppText>
              </View>
            </View>
          )}

          <SeperatorLine style={productDetailStyles.seperatorLine} />

          {product?.description && (
            <View style={globalStyles.flex1}>
              <View style={productDetailStyles.productDetail}>
                <AppText fontFamily={FONTS.semiBold} fontSize={16}>
                  Product Detail
                </AppText>
                <Pressable onPress={() => setIsProductDetail(p => !p)}>
                  <ChevronIcon style={{transform: [{rotate: isProductDetail ? '360deg' : '180deg'}]}} />
                </Pressable>
              </View>

              {isProductDetail && (
                <AppText greyText fontSize={12}>
                  {product?.description}
                </AppText>
              )}
            </View>
          )}

          {renderFooterButtons()}
        </View>
      </AppScrollView>

      <AppModal isVisible={deleteModalShow} setIsVisible={setDeleteModelShow}>
        <View style={globalStyles.modalContainer}>
          <AppText fontSize={16} fontFamily={FONTS.medium}>
            Sure?
          </AppText>
          <AppText style={productDetailStyles.deleteModalCenteredText} greyText>
            Are you sure you want to delete this product?
          </AppText>
          <View style={productDetailStyles.deleteModalButtons}>
            <AppButton title={'Delete'} containerStyle={productDetailStyles.deleteModalButton} transparentButton={true} onPress={handleDeleteProduct} />
            <AppButton title={'Cancel'} containerStyle={productDetailStyles.deleteModalButton} onPress={() => setDeleteModelShow(false)} />
          </View>
        </View>
      </AppModal>
    </Screen>
  );
};

export default ProductDetail;
