import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {AppButton, AppText, Header, Loader, Screen} from '../../../components';
import GoogleMap from '../../../components/googleMap';
import globalStyles from '../../../../globalStyles';
import {navigateStyles} from '../styles';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {moveToExternalMap, onAPIError} from '../../../helpers';
import {driverOrderDetailSelector} from '../../../redux/selectors';
import {useDispatch, useSelector} from 'react-redux';
import {driverOrdersActions} from '../../../redux/slices/driver/driverOrders';

const MapNavigete = ({navigation, route}) => {
  const params = route?.params;

  const orderId = params?.orderId;
  const shopId = params?.shopId;
  const customerLocation = params?.customerLocation;
  const navigateLocation = params?.navigateLocation;

  const [isLoading, setIsLoading] = useState(false);
  const driverOrderDetail = useSelector(driverOrderDetailSelector) || {};
  const dispatch = useDispatch();

  let buttonTitle = 'Reached';
  if (shopId) buttonTitle = 'Picked Up';

  const handlePressBottomButton = () => {
    if (buttonTitle === 'Reached') handleReachedRider();
    else if (buttonTitle === 'Picked Up') handleShopPickedUp();
  };

  const handleReachedRider = () => {
    const onSuccess = response => {
      // console.log('Reach Status response: ', response);

      if (customerLocation) {
        const orderDetail = {...driverOrderDetail};
        orderDetail.riderStatus = 'Arrived';
        dispatch(driverOrdersActions.setOrderDetail(orderDetail));
        navigation.goBack();
      } else {
        navigation.popToTop();
      }
    };

    const data = {orderId: orderId, riderStatus: 'Arrived'};
    callApi(API_METHODS.POST, API.rirderReachStatus, data, onSuccess, onAPIError, setIsLoading);
  };

  const handleShopPickedUp = () => {
    if (!shopId) return;

    const onSuccess = response => {
      const shopWithProducts = driverOrderDetail?.shopDetailWithProduct.map(s => ({...s}));
      const pickedOrderShopIndex = shopWithProducts?.findIndex(s => s?.shopId == shopId);

      if (pickedOrderShopIndex > -1) {
        shopWithProducts[pickedOrderShopIndex].isOrderPickedUp = true;
        dispatch(driverOrdersActions.updateOrderDetail({shopDetailWithProduct: shopWithProducts}));
        navigation.goBack();
      }
    };

    const data = {orderId, shopId};
    callApi(API_METHODS.POST, API.markedShopOrderPicked, data, onSuccess, onAPIError, setIsLoading);
  };

  const handleStartNavigation = () => {
    moveToExternalMap({lat: navigateLocation?.coordinates[1], lng: navigateLocation?.coordinates[0], label: navigateLocation?.address});
  };

  return (
    <Screen>
      <Header title={'Navigate'} />
      <Loader isLoading={isLoading} />
      <View style={[globalStyles.flex1, {alignItems: 'center', justifyContent: 'center'}]}>
        {/* <GoogleMap></GoogleMap> */}

        <AppText onPress={handleStartNavigation}>Press Here to Start Navigation</AppText>
        <AppButton title={buttonTitle} containerStyle={navigateStyles.bottonButton} onPress={handlePressBottomButton} />
      </View>
    </Screen>
  );
};

export default MapNavigete;
