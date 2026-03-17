import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  groceries: [],
  shopsNearMe: [],
};

const customerHomeSlice = createSlice({
  name: 'customerHome',
  initialState,
  reducers: {
    setGroceries: (state, action) => {
      state.groceries = action.payload;
    },

    setGroceeryLike: (state, action) => {
      const groceryId = action.payload;
      if (!groceryId) return;

      const updatedGroceries = state.groceries.map((grocery, idx) => (grocery._id === groceryId ? {...grocery, isFavorite: !grocery.isFavorite} : grocery));
      state.groceries = updatedGroceries;
    },

    setShopLike: (state, action) => {
      const shopId = action.payload;
      if (!shopId) return;

      const updatedShops = state.shopsNearMe.map((s, idx) => (s._id === shopId ? {...s, isFavorite: !s.isFavorite} : s));
      state.shopsNearMe = updatedShops;
    },

    setShopsNearMe: (state, action) => {
      state.shopsNearMe = action.payload;
    },
  },
});

export const customerHomeActions = customerHomeSlice.actions;
export default customerHomeSlice.reducer;
