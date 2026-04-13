// PRODUCTION
export const BASE_URL = 'http://ec2-3-87-102-186.compute-1.amazonaws.com/api/v1/';
export const SOCKET_BASE_URL = 'http://ec2-3-87-102-186.compute-1.amazonaws.com/';

export const IMAGE_BASE_URL = '';
// export const GOOGLE_API_KEY = 'AIzaSyDgV6iD-c7l49_1CJHniPUJlfQQSK6tofU';
export const GOOGLE_API_KEY = 'AIzaSyDdLnKDZKRKwWROK9yTbwzttsmPCM8CyF0';

export const API = {
  sendOTP: 'user/sendOTP',
  verifyOTP: 'user/verify',
  verifyOTPResetPassword: 'user/verifyOTPResetPassword',
  signUp: 'user/signUp',
  signIn: 'user/login',
  forgotPassword: 'user/forgetPassword',
  resetPassword: 'user/resetPassword',
  ownerProfileUpdate: 'user/update-owner-profile',
  driverProfileUpdate: 'user/update-rider-profile',
  userMe: 'user/me',
  updateUserProfile: 'user/update-user-profile',
  updatePassword: 'user/updateMyPassword',
  logout: 'user/logout',
  getGroceries: 'shop/all-shops-groceries',
  productCreate: 'product/create',
  getCategories: 'product/all-categories',
  createShop: 'shop/create',
  getMyShop: 'shop/',
  updateShop: 'shop/',
  product: 'product/',
  updateProduct: 'product/update-product',
  getShopProducts: 'product/get-shop-products/',
  deleteProduct: 'product/delete-product',
  getOneProduct: 'product/get-product-details',
  productLikeUnLike: 'product/mark-favorite-unfavorite',
  getFavorite: 'product/get-all-favorite-products',
  shopsNearMe: 'shop/get-nearby-shops',
  getAllShops: 'shop/getAllShop',
  getOneShop: '/shop', // SHOP ID
  getAllFavShops: 'shop/get-all-favorite-shop',
  shopLikeUnlike: 'shop/mark-favorite-unfavorite', // SHOP ID
  confirmCheckout: 'cart/verify-payment',
  getAllRiders: 'list/get-all-riders',
  getRiderDetail: 'list/get-rider-details', // RIDER ID
  requestRider: 'list/request-rider',
  createList: 'list/create-list',
  getUserLists: 'list/get-all-user-lists',
  list: 'list',
  buyingListItems: 'list/buying-grocery',
  userNewOrders: 'order/get-user-orders',
  getOrderDetail: 'order/order-details', // ORDER ID

  shopNewOrders: 'order/get-shop-orders', // SHOP ID
  shopAcceptRejectOrder: 'order/accept-reject-order-owner', // {orderId: '', action: "accept" | "reject"}
  driverAcceptRejectOrder: 'order/accept-reject-order-rider', // {orderId: '', action: "accept" | "reject"}
  driverAcceptRejectListOrder: 'list/accept-reject-list-order', // {orderId: '', action: "accept" | "reject"}

  getShopAcceptedOrders: 'order/get-shop-accepted-orders',
  getRiderNewOrders: 'order/get-rider-orders', // RIDER NEW ORDERS (FILTER REJECTED BY RIDER)
  getRiderMyOrders: 'order/get-rider-accepted-orders',

  verfyStripeOnboarding: 'user/stripe/verify-onboarding',
  createStripeAccount: 'user/stripe/add-bank',
  getStripeOnboardingLink: 'user/stripe/get-onboarding-link',
  getStripeAccountBalance: 'user/stripe/get-account-balance',
  getStripeTransactions: 'user/stripe/get-transactions',

  customerPayListBill: 'list/send-list-bill',
  verifyPayment: 'list/verify-payment',
  verifyDeliveryPayment: 'list/verify-delivery-payment',
  rirderReachStatus: 'list/mark-rider-reached',
  markedShopOrderPicked: 'order/mark-shop-order-pickedup',
  shopReadyForPickupStatusUpdate: 'order/mark-shop-order-ready-for-pickup',
  riderPayDeliveryCharges: 'list/pay-delivery-charges',
  updateOrderStatus: 'order/change-order-status',
  addReview: 'rating/create',
  shopStats: 'shop/shop-stats',
  shopCompletedOrders: 'shop/shop-completed-orders',
  riderCompletedOrders: 'rider/rider-completed-orders',
  riderStats: 'rider/rider-stats',

  notifications: 'user/mynotifications?page=1&limit=1000',
  deleteAccountSendOtp: 'user/delete-account-send-otp',
  deleteAccountOtpVerify: 'user/delete-account-verify',
  getOneShopEarning: 'earnings/get-one-shop-earnings', // :id
  getShopEarningHistory: 'earnings/shop-earnings-history', // :id
  faqs: 'faqs',
  getRiderEarningHistory: 'earnings/rider-earnings-history', // :id
  socialLogin: 'user/socialLogin',
  searchProductAndShops: 'product',
};
