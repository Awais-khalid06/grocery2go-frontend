import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  productCategories: [],
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setProductCategories: (state, action) => {
      state.productCategories = action.payload;
    },
  },
});

export const commonActions = commonSlice.actions;
export default commonSlice.reducer;
