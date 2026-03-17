import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  newOrders: [],
  orderDetail: {},
};

const shopOwnerOrderSlice = createSlice({
  name: 'shopOwnerOrders',
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

    removeOrderDetail: (state, action) => {
      state.orderDetail = {};
    },

    removeOrderFromNewOrderList: (state, action) => {
      const orderId = action.payload;
      state.newOrders = state.newOrders.filter(o => o._id !== orderId);
    },
  },
});

export const shopOwnerOrderActions = shopOwnerOrderSlice.actions;
export default shopOwnerOrderSlice.reducer;
