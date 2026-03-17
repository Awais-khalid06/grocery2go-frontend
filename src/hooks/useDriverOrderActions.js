import {useDispatch} from 'react-redux';
import {driverOrdersActions} from '../redux/slices/driver/driverOrders';
import commonAPI from '../network/commonAPI';
import {confirmationAlert} from '../helpers';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../utils/constants';

const useDriverOrderActions = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleAcceptRejectOrder = async (item, action, hasGoBack = false) => {
    const orderType = item?.orderType; // simpleOrder | listOrder

    if (action === 'reject') {
      const isConfirmed = await confirmationAlert('Are you sure to reject this order?', 'No', 'Yes');
      if (!isConfirmed) return;
    }

    const orderId = item._id;
    dispatch(driverOrdersActions.removeOrderFromNewOrderList(orderId));

    const data = {action, orderType};
    if (item?.orderType === 'simpleOrder') data.orderId = orderId;
    else data.listId = orderId;

    commonAPI.driverAcceptRejectOrder(data);

    if (hasGoBack) navigation.goBack();
  };

  const handlePressNewOrder = (item, orderType = 'NEW') => {
    if (item.orderType === 'simpleOrder') navigation.navigate(ROUTES.OrderDetails, {orderId: item?._id, orderType});
    else navigation.navigate(ROUTES.DriverListOrderDetail, {orderId: item?._id, orderType});
  };

  return {handleAcceptRejectOrder, handlePressNewOrder};
};

export default useDriverOrderActions;
