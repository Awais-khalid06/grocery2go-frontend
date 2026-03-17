import {useDispatch} from 'react-redux';
import {customerCartActions} from '../redux/slices/customer/customerCart';
import {ShowMessage} from '../components';

const useCustomerCart = () => {
  const dispatch = useDispatch();

  const handleRemoveItemFromCart = itemId => {
    ShowMessage(`Item removed`);
    dispatch(customerCartActions.removeItemFromCart(itemId));
  };

  const handleAddItemToCart = (item, quantity = 1) => {
    ShowMessage(`${quantity} ${item.productName} added in cart`);
    dispatch(customerCartActions.addItemInCart({item, quantity}));
  };

  const handleIncrementCartItem = itemId => {
    dispatch(customerCartActions.incrementItemQuantity(itemId));
  };

  const handleDecrementCartItem = itemId => {
    dispatch(customerCartActions.decrementItemQuantity(itemId));
  };

  const handleResetCart = itemId => {
    dispatch(customerCartActions.resetCartItems());
  };

  return {handleAddItemToCart, handleDecrementCartItem, handleIncrementCartItem, handleRemoveItemFromCart, handleResetCart};
};

export default useCustomerCart;
