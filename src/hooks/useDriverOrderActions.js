import {useDispatch} from 'react-redux';
import {useEffect, useRef, useState} from 'react';
import {driverOrdersActions} from '../redux/slices/driver/driverOrders';
import commonAPI from '../network/commonAPI';
import {confirmationAlert} from '../helpers';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../utils/constants';

const useDriverOrderActions = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isMountedRef = useRef(true);
  const [activeOrderAction, setActiveOrderAction] = useState({orderId: null, action: null});

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const clearActiveAction = () => {
    if (isMountedRef.current) {
      setActiveOrderAction({orderId: null, action: null});
    }
  };

  const handleAcceptRejectOrder = async (item, action, hasGoBack = false) => {
    const orderType = item?.orderType; // simpleOrder | listOrder

    if (action === 'reject') {
      const isConfirmed = await confirmationAlert('Are you sure to reject this order?', 'No', 'Yes');
      if (!isConfirmed) return;
    }

    const orderId = item._id;
    setActiveOrderAction({orderId, action});

    try {
      const data = {action, orderType};
      if (item?.orderType === 'simpleOrder') data.orderId = orderId;
      else data.listId = orderId;

      const response = await commonAPI.driverAcceptRejectOrder(data);
      if (!response?.success) return;

      dispatch(driverOrdersActions.removeOrderFromNewOrderList(orderId));

      if (hasGoBack) navigation.goBack();
    } finally {
      clearActiveAction();
    }
  };

  const handlePressNewOrder = (item, orderType = 'NEW') => {
    if (item.orderType === 'simpleOrder') navigation.navigate(ROUTES.OrderDetails, {orderId: item?._id, orderType});
    else navigation.navigate(ROUTES.DriverListOrderDetail, {orderId: item?._id, orderType});
  };

  return {
    handleAcceptRejectOrder,
    handlePressNewOrder,
    activeOrderId: activeOrderAction.orderId,
    activeAction: activeOrderAction.action,
    isActionLoading: Boolean(activeOrderAction.orderId),
  };
};

export default useDriverOrderActions;
