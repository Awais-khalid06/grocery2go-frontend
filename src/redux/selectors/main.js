// CUSTOMER
export const groceriesSelector = state => state?.customerHome?.groceries;
export const shopsNearMeSelector = state => state?.customerHome?.shopsNearMe;
export const customerCartSelector = state => state?.customerCart;
export const customerListsSelector = state => state?.customerList.myLists;

// COMMON
export const productCategoriesSelector = state => state?.common.productCategories;

// SHOP OWNER
export const shopOwnerProductsSelector = state => state?.shopOwnerProduct.myProducts;
export const shopOwnerNewOrdersSelector = state => state?.shopOwnerOrders.newOrders;
export const shopOrderDetailSelector = state => state?.shopOwnerOrders.orderDetail;

// DRIVER
export const driverNewOrdersSelector = state => state?.driverOrders.newOrders;
export const driverOrderDetailSelector = state => state?.driverOrders.orderDetail;

// ORDER SUMMARY
export const taxesSelector = state => state?.orderSummary.taxes;
