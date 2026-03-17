import {BasketCirclesIcon, CarCircleIcon, HomeCircleIcon, ShoppingBagIcon, ShoppingGirlIcon, UserCircleIcon} from '../assets/icons';
import {AppleImage, BottlesImage, BreadsImage, DairyImage, FrozenMeatImage, LiquidsImage, MeatImage, ShopImage, ShopProductsImage, TabletsImage, TissuesImage, VegetablesImage} from '../assets/images';

export const ACCOUNT_TYPE = {
  CUSTOMER: 'CUSTOMER',
  GROCERY_OWNER: 'GROCERY_OWNER',
  DRIVER: 'DRIVER',
};

export const ONBOARDINGS = [
  {
    icon: ShoppingBagIcon,
    title: 'Best Rating',
    description: 'Lorem ipsum dolor sit amet consectetur. Cras in eget enim diam. Faucibus purus maecenas faucibus.',
  },
  {
    icon: BasketCirclesIcon,
    title: 'Best Rating',
    description: 'Lorem ipsum dolor sit amet consectetur. Cras in eget enim diam. Faucibus purus maecenas faucibus.',
  },
  {
    icon: ShoppingGirlIcon,
    title: 'Best Rating',
    description: 'Lorem ipsum dolor sit amet consectetur. Cras in eget enim diam. Faucibus purus maecenas faucibus.',
  },
];
export const ACCOUNT_TYPE_DATA = [
  {
    icon: UserCircleIcon,
    title: 'Customer',
    description: 'Lorem ipsum dolor sit amet consectetur. Cras in eget enim diam. Faucibus purus maecenas faucibus.',
  },
  {
    icon: HomeCircleIcon,
    title: 'Grocery owner',
    description: 'Lorem ipsum dolor sit amet consectetur. Cras in eget enim diam. Faucibus purus maecenas faucibus.',
  },
  {
    icon: CarCircleIcon,
    title: 'Goer (Driver)',
    description: 'Lorem ipsum dolor sit amet consectetur. Cras in eget enim diam. Faucibus purus maecenas faucibus.',
  },
];

export const PRODUCT_CATEGORIES = [
  {name: 'Fruits', icon: AppleImage},
  {name: 'Vegetables', icon: VegetablesImage},
  {name: 'Beverages', icon: BottlesImage},
  {name: 'Dairy', icon: DairyImage},
  {name: 'Bakery', icon: BreadsImage},
  {name: 'Frozen Foods', icon: FrozenMeatImage},
  {name: 'Meat', icon: MeatImage},
  {name: 'Cleaners', icon: LiquidsImage},
  {name: 'Paper Goods', icon: TissuesImage},
  {name: 'Personal Care', icon: ShopProductsImage},
  {name: 'Pharmacy', icon: TabletsImage},
];

export const SHOPS_NEAR_YOU = [
  {name: 'Grocery Shop Name', image: ShopImage, location: '3485 wood duck drive,'},
  {name: 'Grocery Shop Name', image: ShopImage, location: '3485 wood duck drive,'},
  {name: 'Grocery Shop Name', image: ShopImage, location: '3485 wood duck drive,'},
];

export const RIDERS = [
  {name: 'Jhon Doe', distance: '5ML', rating: '4.5', ratingCount: 65},
  {name: 'Jhon Sla', distance: '5ML', rating: '4.8', ratingCount: 66},
  {name: 'Jhon Doe', distance: '5ML', rating: '4.9', ratingCount: 67},
  {name: 'Jhon Doe', distance: '5ML', rating: '5.0', ratingCount: 68},
  {name: 'Jhon Doe', distance: '5ML', rating: '4.5', ratingCount: 69},
];

export const ORDER_TRACKING = [
  {name: 'Grocery Shop Name', location: '3487 wood duck drive', orderNumber: '339399393993', status: 'Market Received'},
  {name: 'Grocery Shop Name', location: '3487 wood duck drive', orderNumber: '339399393993', status: 'Accepted Order'},
  {name: 'Grocery Shop Name', location: '3487 wood duck drive', orderNumber: '339399393993', status: 'Ready For Pickup'},
  {name: 'Grocery Shop Name', location: '3487 wood duck drive', orderNumber: '339399393993', status: 'Rider Picked Up Order', isRiderDetail: true},
  {name: 'Grocery Shop Name', location: '3487 wood duck drive', orderNumber: '339399393993', status: 'Market Received'},
];

export const PRODUCTS = [
  {title: 'Bell Pepper Red', price: '4.99', status: 'Low Stock'},
  {title: 'Bell Pepper Red', price: '4.99', status: 'Available'},
  {title: 'Bell Pepper Red', price: '4.99', status: 'Low Stock'},
  {title: 'Bell Pepper Red', price: '4.99', status: 'Low Stock'},
  {title: 'Bell Pepper Red', price: '4.99', status: 'Low Stock'},
];
