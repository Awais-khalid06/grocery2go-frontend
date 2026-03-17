import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  taxes: {},
};

const orderSummarySlice = createSlice({
  name: 'orderSummary',
  initialState,
  reducers: {
    setTaxes: (state, action) => {
      state.taxes = action.payload;
    },
  },
});

export const orderSummaryActions = orderSummarySlice.actions;
export default orderSummarySlice.reducer;
