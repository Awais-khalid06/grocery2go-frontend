import {ShowMessage} from '../../components';

export const emailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const passwordFormat = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,24}$/;
export const phoneFormat = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

export const signupValidations = (data, isCustomer) => {
  if (!data.firstName) return ShowMessage('First name is required');
  else if (!data.lastName) return ShowMessage('Last name is required');
  else if (!data.email) return ShowMessage('Email is required');
  else if (!emailFormat.test(data.email)) return ShowMessage('Email is invalid');
  else if (!data.phoneNumber) return ShowMessage('Phone number is required');
  else if (!phoneFormat.test(data.phoneNumber)) return ShowMessage('Phone number is invalid');
  else if (!data.password) return ShowMessage('Password is required');
  else if (data.password.length < 8) return ShowMessage('Password must be 6 character long');
  else if (data.password !== data.confirmPassword) return ShowMessage('Password and confirm password is not matched');
  else if (!data.address && isCustomer) return ShowMessage('Address is required');
  else return true;
};

export const siginValidations = data => {
  if (!data.email) return ShowMessage('Email is required');
  else if (!emailFormat.test(data.email)) return ShowMessage('Email is invalid');
  else if (!data.password) return ShowMessage('Password is required');
  else return true;
};

export const resetPasswordValidations = data => {
  if (!data.password) return ShowMessage('Password is required');
  else if (data.password.length < 8) return ShowMessage('Password must be 6 character long');
  else if (data.password !== data.confirmPassword) return ShowMessage('Password and confirm password is not matched');
  else return true;
};

export const changePasswordValidations = data => {
  if (!data.currentPassword) return ShowMessage('Current password is required');
  if (!data.newPassword) return ShowMessage('New password is required');
  else if (data.newPassword !== data.confirmPassword) return ShowMessage('New password and confirm password is not matched');
  else if (data.newPassword.length < 8) return ShowMessage('Password must be 6 character long');
  else return true;
};

export const otpValidations = data => {
  if (!data.otp) return ShowMessage('OTP is required');
  else return true;
};

export const forgotPasswordValidations = data => {
  if (!data.email) return ShowMessage('Email is required');
  else if (!emailFormat.test(data.email)) return ShowMessage('Email is invalid');
  else return true;
};

export const ownerCompleteProfileValidations = data => {
  if (!data.image) return ShowMessage('Profile image is required');
  else if (!data.groceryShopName) return ShowMessage('Grocery shop name is required');
  else if (!data.address) return ShowMessage('Address is required');
  else if (!data.salesTax) return ShowMessage('Sales tax is required');
  else if (!data.openingTime) return ShowMessage('Shop opening time is required');
  else if (!data.closingTime) return ShowMessage('Shop closing time is required');
  else if (!data.countryValue) return ShowMessage('Country is required');
  // else if (!data.bankName) return ShowMessage('Bank Name is required');
  // else if (!data.accountNumber) return ShowMessage('Account number is required');
  else return true;
};

export const driverCompleteProfileValidations = data => {
  if (!data.image) return ShowMessage('Profile image is required');
  else if (!data.address) return ShowMessage('Address is required');
  else if (!data.vehiclePermit) return ShowMessage('Vehicle permit time is required');
  else if (!data.countryValue) return ShowMessage('Country is required');
  // else if (!data.bankName) return ShowMessage('Bank Name is required');
  // else if (!data.accountNumber) return ShowMessage('Account number is required');
  else return true;
};

export const addProductValidations = data => {
  if (data.productImages.length === 0) return ShowMessage('At least 1 product image is required');
  else if (!data.productName) return ShowMessage('Product name is required');
  else if (!data.price) return ShowMessage('Product price is required');
  else if (!data.shopType) return ShowMessage('Please select shop type');
  else if (!data.categoryName) return ShowMessage('Please select category of product');
  else if (!data.unitTypeValue) return ShowMessage('Please select product measure unit');
  else if ((data.unitTypeValue == 'volume' || data.unitTypeValue == 'weight') && !data.volume)
    return ShowMessage(data.unitTypeValue == 'volume' ? 'Product volume is required' : 'Product weight is required');
  else if (data.unitTypeValue == 'quantity' && !data.quantity) return ShowMessage('Product qunatity is required');
  else if (!data.manufacturedBy) return ShowMessage('Product manufacturer is required');
  else if (!data.description) return ShowMessage('Product description is required');
  else return true;
};

export const validateDeliveryTime = deliveryTime => {
  const now = new Date();

  if (!deliveryTime) {
    ShowMessage('Delivery time is required.');
    return false;
  } else if (deliveryTime <= now) {
    ShowMessage('Delivery time must be greater than the current time.');
    return false;
  } else return true;
};
