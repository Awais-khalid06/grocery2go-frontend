import {FlatList} from 'react-native';
import React, {useState} from 'react';
import {FlatListEmptyComponent, Header, Loader, OrderActionCard, Screen} from '../../../components';
import globalStyles from '../../../../globalStyles';
import {ROUTES} from '../../../utils/constants';
import {driverNewOrdersSelector} from '../../../redux/selectors';
import {useDispatch, useSelector} from 'react-redux';
import commonAPI from '../../../network/commonAPI';
import {useDriverOrderActions} from '../../../hooks';

const DriverNewOrders = ({navigation}) => {
  const dispatch = useDispatch();
  const {handleAcceptRejectOrder, handlePressNewOrder} = useDriverOrderActions();
  const orders = useSelector(driverNewOrdersSelector);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Screen>
      <Header title={'New Orders'} />
      <Loader isLoading={isLoading} />

      <FlatList
        data={orders}
        refreshing={false}
        onRefresh={() => commonAPI.getDriverNewOrders({dispatch, setIsLoading})}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<FlatListEmptyComponent label={'No Order'} />}
        renderItem={({item, index}) => (
          <OrderActionCard
            item={item}
            type={'DRIVER_NEW_ORDER'}
            onPress={handlePressNewOrder}
            onPressAccept={item => handleAcceptRejectOrder(item, 'accept')}
            onPressReject={item => handleAcceptRejectOrder(item, 'reject')}
            isPriceShow={false}
          />
        )}
        contentContainerStyle={[globalStyles.screenPadding, globalStyles.flexGrow1, globalStyles.inputsGap, globalStyles.screenPaddingBottom10]}
      />
    </Screen>
  );
};

export default DriverNewOrders;
