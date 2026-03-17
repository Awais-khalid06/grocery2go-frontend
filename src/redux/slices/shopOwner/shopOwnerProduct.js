import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  myProducts: [],
};

const shopOwnerProductSlice = createSlice({
  name: 'shopOwnerProduct',
  initialState,
  reducers: {
    setMyProducts: (state, action) => {
      state.myProducts = action.payload;
    },

    removeProductFromMyProducts: (state, action) => {
      state.myProducts = state.myProducts.filter(p => p._id !== action.payload);
    },
  },
});

export const shopOwnerProductActions = shopOwnerProductSlice.actions;
export default shopOwnerProductSlice.reducer;
