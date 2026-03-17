import {FlatList} from 'react-native';
import React from 'react';
import {FlatListEmptyComponent, Header, OrderActionCard, Screen} from '../../../components';
import globalStyles from '../../../../globalStyles';
import {ROUTES} from '../../../utils/constants';
import {shopOwnerNewOrdersSelector, userSelector} from '../../../redux/selectors';
import {useDispatch, useSelector} from 'react-redux';
import commonAPI from '../../../network/commonAPI';
import {useShopOrderActions} from '../../../hooks';

const ShopNewOrders = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const {handleAcceptRejectOrder} = useShopOrderActions();
  const orders = useSelector(shopOwnerNewOrdersSelector);

  const handlePressNewOrder = item => {
    navigation.navigate(ROUTES.OrderDetails, {orderId: item?._id, orderType: 'NEW'});
  };

  return (
    <Screen>
      <Header title={'New Orders'} />

      <FlatList
        data={orders}
        refreshing={false}
        onRefresh={() => commonAPI.getShopNewOrders({dispatch})}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<FlatListEmptyComponent label={'No Order'} />}
        renderItem={({item, index}) => (
          <OrderActionCard
            item={item}
            type={'SHOP_NEW_ORDER'}
            onPress={handlePressNewOrder}
            onPressAccept={item => handleAcceptRejectOrder(item, 'accept')}
            onPressReject={item => handleAcceptRejectOrder(item, 'reject')}
            myShopId={user?.shopId}
          />
        )}
        contentContainerStyle={[globalStyles.screenPadding, globalStyles.flexGrow1, globalStyles.inputsGap, globalStyles.screenPaddingBottom10]}
      />
    </Screen>
  );
};

export default ShopNewOrders;
