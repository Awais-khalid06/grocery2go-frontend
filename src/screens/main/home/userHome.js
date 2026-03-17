import {Image, Pressable, RefreshControl, ScrollView, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppScrollView, AppText, AppTextInput, GroceryCard, Header, Loader, Screen, ShopCard, ShowMessage} from '../../../components';
import {BellIcon, ChatGrayIcon, ChevronIcon, HeartIcon, LocationFilledGrayIcon, SearchIcon} from '../../../assets/icons';
import {homeStyles} from '../styles';
import {FONTS} from '../../../utils/theme';
import globalStyles from '../../../../globalStyles';
import {PRODUCT_CATEGORIES} from '../../../static';
import {ROUTES} from '../../../utils/constants';
import {useNavigation} from '@react-navigation/native';
import BottomSheet from '../../../components/bottomSheet';
import GooglePlacesInput from '../../../components/googlePlacesInput';
import {useDispatch, useSelector} from 'react-redux';
import {groceriesSelector, shopsNearMeSelector, userSelector} from '../../../redux/selectors';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';
import {customerHomeActions} from '../../../redux/slices/customer/customerHome';
import useCustomerCart from '../../../hooks/useCustomerCart';
import commonAPI from '../../../network/commonAPI';
import useDebounce from '../../../hooks/useDebounce';

const UserHome = ({}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {handleAddItemToCart} = useCustomerCart();
  const groceries = useSelector(groceriesSelector);
  const shopsNearMe = useSelector(shopsNearMeSelector);
  const user = useSelector(userSelector) || {};
  const locationBottomSheetRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceText = useDebounce(searchQuery, 1000);

  const location = user?.location;
  const myLat = location?.coordinates?.[1] || 48.85552283403529;
  const myLng = location?.coordinates?.[0] || 2.37035159021616;

  const [region, setRegion] = useState({
    name: location?.address,
    latitude: myLat,
    longitude: myLng,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });

  useEffect(() => {
    getShopsNearYou();
  }, [region?.latitude, region?.longitude, debounceText]);

  const getShopsNearYou = () => {
    const onSuccess = response => {
      if (response.success) {
        const shops = response?.data?.shops || [];
        const groceries = response?.data?.groceries || [];

        dispatch(customerHomeActions.setGroceries(groceries));
        dispatch(customerHomeActions.setShopsNearMe(shops));
      }
    };

    const endpoint = `${API.shopsNearMe}/?latitude=${region?.latitude}&longitude=${region.longitude}&maxDistance=10&keyword=${debounceText}`;
    callApi(API_METHODS.GET, endpoint, null, onSuccess, onAPIError);
  };

  const handleLikeUnLikeShop = item => {
    const shopId = item?._id;
    dispatch(customerHomeActions.setShopLike(shopId));
    commonAPI.shopLikeUnlike(shopId);
  };

  const handleSelectLocation = (data, details) => {
    setRegion(current => ({
      ...current,
      name: data.description,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    }));

    locationBottomSheetRef.current.close();
  };

  const handleAddItemInCart = item => {
    handleAddItemToCart(item);
  };

  const handleGroceryItemPress = item => {
    if (item?._id) navigation.navigate(ROUTES.ProductDetail, {productId: item._id});
  };

  const handleShopPress = item => {
    const shopId = item?._id;
    if (shopId) navigation.navigate(ROUTES.ShopDetails, {shopId});
  };

  const handlePullToRefresh = () => {
    getShopsNearYou();
  };

  const groceriesLength = groceries?.length;
  const shopsNearMeLength = shopsNearMe?.length;

  return (
    <Screen>
      <Loader isLoading={isLoading} />
      <Pressable onPress={() => locationBottomSheetRef.current.open()} style={homeStyles.header}>
        <LocationFilledGrayIcon />
        <AppText darkGrayText fontFamily={FONTS.medium} numberOfLines={1}>
          {region.name}
        </AppText>
        <ChevronIcon width={18} />
      </Pressable>

      <View style={[homeStyles.searchContainer, globalStyles.screenPadding]}>
        <AppTextInput
          textInputContainerStyle={homeStyles.textInputContainerStyle}
          containerStyle={homeStyles.searchBar}
          LeftIcon={SearchIcon}
          placeholder="Search for Grocery or Shop"
          onChangeText={setSearchQuery}
        />
        <View style={homeStyles.iconsContainer}>
          <IconWrapper Icon={BellIcon} onPress={() => navigation.navigate(ROUTES.Notification)} />
          <IconWrapper Icon={HeartIcon} onPress={() => navigation.navigate(ROUTES.Favorite)} />
          <IconWrapper Icon={ChatGrayIcon} onPress={() => navigation.navigate(ROUTES.ChatInbox)} />
        </View>
      </View>

      <AppScrollView contentContainerStyle={{paddingHorizontal: 0}} refreshControl={<RefreshControl refreshing={false} onRefresh={handlePullToRefresh} />}>
        <View style={globalStyles.screenPadding}>
          <View style={homeStyles.sectionLabel}>
            <AppText fontFamily={FONTS.medium}>Catogories</AppText>
          </View>
          <View style={homeStyles.categoriesContainer}>
            {PRODUCT_CATEGORIES.map(product => (
              <Pressable key={product.name} style={homeStyles.categoryContainer}>
                <Image source={product.icon} style={homeStyles.icon} />
                <AppText fontSize={10}>{product.name}</AppText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[homeStyles.sectionLabel, globalStyles.screenPadding, {marginTop: 20}]}>
          <AppText fontFamily={FONTS.medium} style={globalStyles.flex1}>
            Groceries
          </AppText>
          <AppText fontSize={12} primary onPress={() => navigation.navigate(ROUTES.Groceries)}>
            See All
          </AppText>
        </View>

        <View style={{flexGrow: groceriesLength > 0 ? undefined : 1}}>
          <ScrollView showsHorizontalScrollIndicator={false} nestedScrollEnabled horizontal contentContainerStyle={homeStyles.groceriesContentContainer} style={homeStyles.groceriesContainer}>
            {groceriesLength > 0 ? (
              groceries.slice(0, 5).map((grocery, index) => <GroceryCard style={{width: 150}} key={index} item={grocery} onPressPlusIcon={handleAddItemInCart} onPress={handleGroceryItemPress} />)
            ) : (
              <View style={homeStyles.notfound}>
                <AppText>No Grocery</AppText>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={[homeStyles.sectionLabel, globalStyles.screenPadding]}>
          <AppText fontFamily={FONTS.medium} style={globalStyles.flex1}>
            Shops Near you
          </AppText>
          <AppText fontSize={12} primary onPress={() => navigation.navigate(ROUTES.Shops)}>
            See All
          </AppText>
        </View>

        <View style={{flexGrow: shopsNearMeLength > 0 ? undefined : 1}}>
          <ScrollView showsHorizontalScrollIndicator={false} nestedScrollEnabled horizontal contentContainerStyle={homeStyles.groceriesContentContainer} style={homeStyles.shopsContainer}>
            {shopsNearMeLength > 0 ? (
              shopsNearMe.slice(0, 5).map((shop, index) => <ShopCard key={index} item={shop} style={homeStyles.shopCard} onPress={handleShopPress} onPressHeartIcon={handleLikeUnLikeShop} />)
            ) : (
              <View style={homeStyles.notfound}>
                <AppText>No Shop</AppText>
              </View>
            )}
          </ScrollView>
        </View>
      </AppScrollView>

      <BottomSheet ref={locationBottomSheetRef} height={200}>
        <View style={homeStyles.bottomSheetContainer}>
          <GooglePlacesInput placeholder="Address" onSelect={handleSelectLocation} />
        </View>
      </BottomSheet>
    </Screen>
  );
};

export const IconWrapper = ({Icon, onPress, style, width = 20, height = 20}) => {
  return (
    <Pressable onPress={onPress} style={[homeStyles.bellWrapper, style]}>
      <Icon width={width} height={height} />
    </Pressable>
  );
};

export default UserHome;
