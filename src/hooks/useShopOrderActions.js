import {useDispatch} from 'react-redux';
import commonAPI from '../network/commonAPI';
import {confirmationAlert} from '../helpers';
import {shopOwnerOrderActions} from '../redux/slices/shopOwner/shopOwnerOrders';
import {useNavigation} from '@react-navigation/native';

const useShopOrderActions = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleAcceptRejectOrder = async (item, action, hasGoBack = false) => {
    if (action === 'reject') {
      const isConfirmed = await confirmationAlert('Are you sure to reject this order?', 'No', 'Yes');
      if (!isConfirmed) return;
    }

    const orderId = item._id;
    dispatch(shopOwnerOrderActions.removeOrderFromNewOrderList(orderId));
    commonAPI.shopAcceptRejectOrder({orderId, action});

    if (hasGoBack) navigation.goBack();
  };

  return {handleAcceptRejectOrder};
};

export default useShopOrderActions;
