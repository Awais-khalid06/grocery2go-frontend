import {createSlice} from '@reduxjs/toolkit';
import {ACCOUNT_TYPE} from '../../static';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  accountType: ACCOUNT_TYPE.USER,
  isRememberMe: false,
  rememberedCredentials: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },

    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },

    setAccountType: (state, action) => {
      state.accountType = action.payload;
    },

    setIsRememberMe: (state, action) => {
      state.isRememberMe = action.payload;
    },

    setRememberedCredentials: (state, action) => {
      if (!state.rememberedCredentials) state.rememberedCredentials = {};
      state.rememberedCredentials.email = action.payload.email;
      state.rememberedCredentials.password = action.payload.password;
    },

    resetRememberedCredentials: (state, action) => {
      state.rememberedCredentials = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
