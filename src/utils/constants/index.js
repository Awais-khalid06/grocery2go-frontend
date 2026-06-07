export const ROUTES = {
  Splash: "Splash",
  Onboarding: "Onboarding",
  AccountType: "AccountType",
  SignIn: "SignIn",
  SignUp: "SignUp",
  ForgotPassword: "ForgotPassword",
  Verification: "Verification",
  ResetPassword: "ResetPassword",
  Home: "Home",
  ShopDetails: "ShopDetails",
  ProductDetail: "ProductDetail",
  Shops: "Shops",
  Favorite: "Favorite",
  Groceries: "Groceries",
  EditAddress: "EditAddress",
  MyCart: "MyCart",
  SetLocationOnMap: "SetLocationOnMap",
  Checkout: "Checkout",
  OrderAccepted: "OrderAccepted",
  Lists: "Lists",
  List: "List",
  AddList: "AddList",
  Riders: "Riders",
  RiderDetails: "RiderDetails",
  OrderTracking: "OrderTracking",
  OrderDetails: "OrderDetails",
  OrderTrack: "OrderTrack",
  AddFeedback: "AddFeedback",
  AddTip: "AddTip",
  ChatRoom: "ChatRoom",
  Notification: "Notification",
  Settings: "Settings",
  EditProfile: "EditProfile",
  NotificationSetting: "NotificationSetting",
  ChangePassword: "ChangePassword",
  DeleteAccount: "DeleteAccount",
  PrivacyPolicy: "PrivacyPolicy",
  TermsOfService: "TermsOfService",
  HelpCenter: "HelpCenter",
  OrderHistory: "OrderHistory",
  CompleteProfile: "CompleteProfile",
  ShopMyOrders: "ShopMyOrders",
  CompletedOrders: "CompletedOrders",
  ShopNewOrders: "ShopNewOrders",
  TotalEarnings: "TotalEarnings",
  ShopOwnerProducts: "ShopOwnerProducts",
  AddProduct: "AddProduct",
  ManageStock: "ManageStock",
  BankDetail: "BankDetail",
  DriverMyOrders: "DriverMyOrders",
  DriverListOrderDetail: "DriverListOrderDetail",
  DriverNewOrders: "DriverNewOrders",
  AddBank: "AddBank",
  MyWallet: "MyWallet",
  ChatInbox: "ChatInbox",
  MapNavigete: "MapNavigete",
  UserListOrderDetail: "UserListOrderDetail",
};

export const STACKS = {
  Auth: "Auth",
  Main: "Main",
};

export const TABS = {
  HomeTab: "HomeTab",
  BuyTab: "BuyTab",
  ClipboardTab: "ClipboardTab",
  OrdersTab: "OrdersStack",
  ProfileTab: "ProfileTab",
  // Grocery Owner
  OrdersTab: "OrdersTab",
  ProductsTab: "ProductsTab",
  GroceryOwnerOrdersTab: "GroceryOwnerOrdersTab",
};

export const CURRENCY_UNIT = "$";

const countryData = require("../../../node_modules/react-native-phone-number-input/node_modules/react-native-country-picker-modal/lib/assets/data/countries-emoji.json");

// Reuse the bundled country dataset so the dropdown stays complete without hand-maintaining a short list.
export const STRIPE_COUNTRIES = Object.keys(countryData)
  .map((code) => {
    const countryName = countryData?.[code]?.name?.common || code;

    return {
      label: countryName,
      value: countryName,
      cca2: code,
    };
  })
  .sort((countryA, countryB) => countryA.label.localeCompare(countryB.label));

export const STRIPE_COUNTRY_CODE_BY_NAME = STRIPE_COUNTRIES.reduce(
  (acc, country) => {
    acc[country.value] = country.cca2;
    return acc;
  },
  {}
);
