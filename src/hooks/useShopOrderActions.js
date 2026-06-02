import {useDispatch} from 'react-redux';
import {useEffect, useRef, useState} from 'react';
import commonAPI from '../network/commonAPI';
import {confirmationAlert} from '../helpers';
import {shopOwnerOrderActions} from '../redux/slices/shopOwner/shopOwnerOrders';
import {useNavigation} from '@react-navigation/native';

const useShopOrderActions = () => {
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
    if (action === 'reject') {
      const isConfirmed = await confirmationAlert('Are you sure to reject this order?', 'No', 'Yes');
      if (!isConfirmed) return;
    }

    const orderId = item._id;
    setActiveOrderAction({orderId, action});

    try {
      const response = await commonAPI.shopAcceptRejectOrder({orderId, action});
      if (!response?.success) return;

      dispatch(shopOwnerOrderActions.removeOrderFromNewOrderList(orderId));
      commonAPI.getShopNewOrders({dispatch});

      if (hasGoBack) navigation.goBack();
    } finally {
      clearActiveAction();
    }
  };

  return {
    handleAcceptRejectOrder,
    activeOrderId: activeOrderAction.orderId,
    activeAction: activeOrderAction.action,
    isActionLoading: Boolean(activeOrderAction.orderId),
  };
};

export default useShopOrderActions;
