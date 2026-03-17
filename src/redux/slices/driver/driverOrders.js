import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  newOrders: [],
  orderDetail: {},
};

const driverOrderSlice = createSlice({
  name: 'driverOrders',
  initialState,
  reducers: {
    setNewOrders: (state, action) => {
      state.newOrders = action.payload;
    },

    setOrderDetail: (state, action) => {
      state.orderDetail = action.payload;
    },

    updateOrderDetail: (state, action) => {
      state.orderDetail = {...state.orderDetail, ...action.payload};
    },

    removeOrderFromNewOrderList: (state, action) => {
      const orderId = action.payload;
      state.newOrders = state.newOrders.filter(o => o._id !== orderId);
    },
  },
});

export const driverOrdersActions = driverOrderSlice.actions;
export default driverOrderSlice.reducer;
