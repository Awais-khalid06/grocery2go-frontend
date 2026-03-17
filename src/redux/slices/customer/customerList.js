import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  myLists: [],
};

const customerListSlice = createSlice({
  name: 'customerList',
  initialState,
  reducers: {
    setMyLists: (state, action) => {
      state.myLists = action.payload;
    },

    removeList: (state, action) => {
      const listId = action.payload;
      state.myLists = state.myLists.filter(p => p._id !== listId);
    },
  },
});

export const customerListActions = customerListSlice.actions;
export default customerListSlice.reducer;
