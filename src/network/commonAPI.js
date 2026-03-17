import {ShowMessage} from '../components';
import {getDeviceIdAndFCM, onAPIError} from '../helpers';
import {authActions} from '../redux/slices/auth';
import {commonActions} from '../redux/slices/common';
import {driverOrdersActions} from '../redux/slices/driver/driverOrders';
import {shopOwnerOrderActions} from '../redux/slices/shopOwner/shopOwnerOrders';
import {ROUTES, STACKS} from '../utils/constants';
import {API} from './Environment';
import {API_METHODS, callApi} from './NetworkManger';

const sendOTP = async data => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => {
    apiResponse = error;
  };

  await callApi(API_METHODS.POST, API.sendOTP, data, onSuccess, onError);

  if (apiResponse.message) ShowMessage(apiResponse.message);
  return apiResponse;
};

const verifyOTP = async (data, apiEndPoint = API.verifyOTP) => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => {
    apiResponse = error;
  };

  const formatedData = {...data, device: await getDeviceIdAndFCM()};
  await callApi(API_METHODS.POST, apiEndPoint, formatedData, onSuccess, onError);

  if (apiResponse.message) ShowMessage(apiResponse.message);
  return apiResponse;
};

const forgotPassword = async email => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  await callApi(API_METHODS.POST, API.forgotPassword, {email}, onSuccess, onError);

  return apiResponse;
};

const getMyProfile = async () => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  await callApi(API_METHODS.GET, API.userMe, null, onSuccess, onError);

  return apiResponse;
};

const logout = async (dispatch, navigation) => {
  dispatch(authActions.setUser(null));
  dispatch(authActions.setRefreshToken(null));
  dispatch(authActions.setAccessToken(null));

  setTimeout(() => {
    navigation.replace(STACKS.Auth);
  }, 500);

  const onSuccess = response => {};

  const onError = error => {
    if (error.message === 'User recently changed password please login again!') {
      onSuccess({success: true});
    }
  };

  callApi(API_METHODS.POST, API.logout, {device: await getDeviceIdAndFCM()}, onSuccess, onError);
};

const updateUserProfile = async data => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  await callApi(API_METHODS.PATCH, `${API.updateUserProfile}`, data, onSuccess, onError);

  return apiResponse;
};

const getProductCategories = async dispatch => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;

    if (response.success) {
      const formatedData = response.data.map(cat => ({label: cat.categoryName, value: cat.categoryName, image: cat.categoryImage}));
      dispatch(commonActions.setProductCategories(formatedData));
    }
  };

  const onError = error => (apiResponse = error);

  await callApi(API_METHODS.GET, API.getCategories, null, onSuccess, onError);

  return apiResponse;
};

const updateOwnerProfile = async (data, dispatch) => {
  const onSuccess = response => {
    if (response.success) {
      const user = response.data.user;
      console.log('UPDATE PROFILE:', response);
      if (user) dispatch(authActions.setUser(user));
    }
  };

  await callApi(API_METHODS.PATCH, API.ownerProfileUpdate, data, onSuccess, onAPIError);
};

const getOneProductDetail = async productId => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  await callApi(API_METHODS.GET, `${API.getOneProduct}/${productId}`, null, onSuccess, onError);
  return apiResponse;
};

const updateProductAPI = async data => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  await callApi(API_METHODS.PATCH, API.updateProduct, data, onSuccess, onError);
  return apiResponse;
};

const productLikeUnlike = async productId => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  await callApi(API_METHODS.POST, `${API.productLikeUnLike}/${productId}`, null, onSuccess, onError);

  return apiResponse;
};

const shopLikeUnlike = async shopId => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  await callApi(API_METHODS.POST, `${API.shopLikeUnlike}/${shopId}`, null, onSuccess, onError);

  return apiResponse;
};

const requestRider = async data => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  await callApi(API_METHODS.POST, `${API.requestRider}`, data, onSuccess, onError);

  return apiResponse;
};

const shopAcceptRejectOrder = async data => {
  // data =  {orderId: '', action: "accept | reject"}

  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  await callApi(API_METHODS.POST, `${API.shopAcceptRejectOrder}`, data, onSuccess, onError);

  return apiResponse;
};

const driverAcceptRejectOrder = async data => {
  // data =  {orderId: '', action: "accept | reject", orderType:  simpleOrder | listOrder}

  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  const endpoint = data?.orderType === 'simpleOrder' ? `${API.driverAcceptRejectOrder}` : `${API.driverAcceptRejectListOrder}`;
  delete data?.orderType;
  await callApi(API_METHODS.POST, endpoint, data, onSuccess, onError);

  return apiResponse;
};

const getOneShop = async shopId => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  await callApi(API_METHODS.GET, `${API.getOneShop}/${shopId}`, null, onSuccess, onError);

  return apiResponse;
};

const getAllRiders = async () => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  await callApi(API_METHODS.GET, `${API.getAllRiders}`, null, onSuccess, onError);

  return apiResponse;
};

const getRiderDetail = async riderId => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  await callApi(API_METHODS.GET, `${API.getRiderDetail}/${riderId}`, null, onSuccess, onError);

  return apiResponse;
};

const getOrderDetail = async orderId => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  await callApi(API_METHODS.GET, `${API.getOrderDetail}/${orderId}`, null, onSuccess, onError);

  return apiResponse;
};

const getShopNewOrders = async ({dispatch, setIsLoading}) => {
  const onSuccess = response => {
    if (response.success) dispatch(shopOwnerOrderActions.setNewOrders(response.data));
  };

  callApi(API_METHODS.GET, `${API.shopNewOrders}`, null, onSuccess, onAPIError, setIsLoading);
};

const getDriverNewOrders = async ({dispatch, setIsLoading}) => {
  const onSuccess = response => {
    // console.log('DRIVER ORDERS:', JSON.stringify(response));
    if (response.success) dispatch(driverOrdersActions.setNewOrders(response.data));
  };

  callApi(API_METHODS.GET, `${API.getRiderNewOrders}`, null, onSuccess, onAPIError, setIsLoading);
};

const verifyOrderPayment = async ({paymentIntentId, orderId}) => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  const data = {paymentIntentId, orderId};
  await callApi(API_METHODS.POST, API.verifyPayment, data, onSuccess, onError);

  return apiResponse;
};

const verifyDeliveryPayment = async ({paymentIntentId, orderId}) => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  const data = {paymentIntentId, orderId};
  await callApi(API_METHODS.POST, API.verifyDeliveryPayment, data, onSuccess, onError);

  return apiResponse;
};

const riderPayDeliveryCharges = async orderId => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  const data = {orderId};
  await callApi(API_METHODS.POST, API.riderPayDeliveryCharges, data, onSuccess, onError);

  return apiResponse;
};

const updateOrderStatus = async (orderId, orderStatus) => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);

  const data = {orderId, orderStatus};
  await callApi(API_METHODS.PATCH, API.updateOrderStatus, data, onSuccess, onError);

  return apiResponse;
};

const addReview = async data => {
  let apiResponse = {};

  const onSuccess = response => {
    apiResponse = response;
  };

  const onError = error => (apiResponse = error);
  await callApi(API_METHODS.POST, API.addReview, data, onSuccess, onError);

  return apiResponse;
};

export default {
  verifyDeliveryPayment,
  addReview,
  updateOrderStatus,
  verifyOrderPayment,
  sendOTP,
  verifyOTP,
  forgotPassword,
  logout,
  getMyProfile,
  updateUserProfile,
  getProductCategories,
  updateOwnerProfile,
  getOneProductDetail,
  updateProductAPI,
  productLikeUnlike,
  getOneShop,
  shopLikeUnlike,
  getAllRiders,
  getRiderDetail,
  requestRider,
  getOrderDetail,
  getShopNewOrders,
  shopAcceptRejectOrder,
  driverAcceptRejectOrder,
  getDriverNewOrders,
  riderPayDeliveryCharges,
};
