import {useSelector} from 'react-redux';
import {accountSelector} from '../redux/selectors';
import {ACCOUNT_TYPE} from '../static';

const useAccountType = () => {
  const accountType = useSelector(accountSelector);

  const isCustomer = accountType === ACCOUNT_TYPE.CUSTOMER;
  const isDriver = accountType === ACCOUNT_TYPE.DRIVER;
  const isGroceryOwner = accountType === ACCOUNT_TYPE.GROCERY_OWNER;

  return {isCustomer, isDriver, isGroceryOwner};
};

export default useAccountType;
