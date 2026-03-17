import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  totalPrice: 0,
};

const calculateTotalPrice = cartItems => {
  return cartItems.reduce((total, item) => total + item.price, 0);
};

const customerCartSlice = createSlice({
  name: 'customerCart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      state.totalPrice = calculateTotalPrice(state.cartItems);
    },

    resetCartItems: (state, action) => {
      state.cartItems = [];
      state.totalPrice = 0;
    },

    addItemInCart: (state, action) => {
      const item = action.payload.item;
      const quantity = action.payload?.quantity;
      const existingItemIndex = state.cartItems.findIndex(i => i._id === item._id);

      if (existingItemIndex >= 0) {
        state.cartItems[existingItemIndex].itemQuantity += quantity;
        state.cartItems[existingItemIndex].price += item.price * quantity;
      } else {
        state.cartItems.push({...item, price: item.price * quantity, itemQuantity: quantity});
      }

      state.totalPrice = calculateTotalPrice(state.cartItems);
    },

    removeItemFromCart: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter(i => i._id !== itemId);
      state.totalPrice = calculateTotalPrice(state.cartItems);
    },

    incrementItemQuantity: (state, action) => {
      const itemId = action.payload;
      const existingItemIndex = state.cartItems.findIndex(i => i._id === itemId);

      if (existingItemIndex >= 0) {
        const item = state.cartItems[existingItemIndex];
        const unitPrice = item.price / item.itemQuantity;
        item.itemQuantity += 1;
        item.price += unitPrice;
      }
      state.totalPrice = calculateTotalPrice(state.cartItems);
    },

    decrementItemQuantity: (state, action) => {
      const itemId = action.payload;
      const existingItemIndex = state.cartItems.findIndex(i => i._id === itemId);

      if (existingItemIndex >= 0) {
        const item = state.cartItems[existingItemIndex];
        const unitPrice = item.price / item.itemQuantity;
        if (item.itemQuantity > 1) {
          item.price -= unitPrice;
          item.itemQuantity -= 1;
        } else {
          state.cartItems = state.cartItems.filter(i => i._id !== itemId);
        }
      }
      state.totalPrice = calculateTotalPrice(state.cartItems);
    },

    addItemInCartWithQuantity: (state, action) => {
      const item = action.item;
      const quantity = action.quantity;

      const existingItemIndex = state.cartItems.findIndex(i => i._id === item._id);

      if (existingItemIndex >= 0) {
        state.cartItems[existingItemIndex].itemQuantity += quantity;
        state.cartItems[existingItemIndex].price += item.price;
      } else {
        state.cartItems.push({...item, itemQuantity: quantity});
      }

      state.totalPrice = calculateTotalPrice(state.cartItems);
    },
  },
});

export const customerCartActions = customerCartSlice.actions;
export default customerCartSlice.reducer;
