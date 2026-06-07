import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  BoxActiveIcon,
  BoxIcon,
  BuyActiveIcon,
  BuyIcon,
  ClipboardActiveIcon,
  ClipboardIcon,
  DispatchActiveIcon,
  DispatchIcon,
  HomeActiveIcon,
  HomeIcon,
  ProfileActiveIcon,
  ProfileIcon,
  ShopActiveIcon,
  ShopIcon,
  TabActiveIcon,
} from '../../assets/icons';
import { ClipboardStack, DriverOrdersStack, GroceryOwnerOrdersStack, HomeStack, OrdersStack, ProductsStack, ProfileStack } from '../stacks/main';
import { TABS } from '../../utils/constants';
import { Platform, View } from 'react-native';
import globalStyles from '../../../globalStyles';
import { MyCart } from '../../screens/main';
import { useAccountType } from '../../hooks';
import { useEffect, useMemo } from 'react';
import useSocket from '../../hooks/useSocket';
import { useSelector } from 'react-redux';
import { customerCartSelector, userSelector } from '../../redux/selectors';
import { AppText } from '../../components';
import { FONTS } from '../../utils/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, wp } from '../../helpers';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  const socket = useSocket();
  const insets = useSafeAreaInsets();
  const user = useSelector(userSelector) || {};
  const { isCustomer, isDriver, isGroceryOwner } = useAccountType();
  const myCart = useSelector(customerCartSelector);
  const myCartTotalItems = myCart?.cartItems?.length;

  useEffect(() => {
    socket.connect();
    const myId = user?._id;

    if (myId) {
      console.log('Socket Emit: User-Enter');
      socket.emit('user-enter', { userId: myId }, error => console.log(error));
    }

    return () => {
      console.log('Clean Up ALL Listner');

      socket.emit('user-leave', { userId: myId }, error => console.log(error));

      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  const tabBarDynamicStyle = useMemo(() => {
    const bottomInset = insets.bottom || 0;
    const height = hp(10) + (bottomInset > 0 ? bottomInset * 0.35 : 0);
    return {
      ...{ height: 65, borderTopWidth: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
      paddingTop: Platform.OS === 'ios' ? wp(3) : wp(2),
      height,
    };
  }, [insets.bottom]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: tabBarDynamicStyle,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={focused ? HomeActiveIcon : HomeIcon} />,
        }}
        name={TABS.HomeTab}
        component={HomeStack}
      />

      {(isGroceryOwner || isDriver) && (
        <Tab.Screen
          options={{
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={focused ? BoxActiveIcon : BoxIcon} />,
          }}
          name={TABS.GroceryOwnerOrdersTab}
          component={isDriver ? DriverOrdersStack : GroceryOwnerOrdersStack}
        />
      )}

      {isGroceryOwner && (
        <Tab.Screen
          options={{
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={focused ? ShopActiveIcon : ShopIcon} />,
          }}
          name={TABS.ProductsTab}
          component={ProductsStack}
        />
      )}

      {isCustomer && (
        <Tab.Screen
          options={{
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={focused ? BuyActiveIcon : BuyIcon} />,
            tabBarBadge: myCartTotalItems > 0 ? myCartTotalItems : null,
            tabBarBadgeStyle: globalStyles.tabBadgeStyle,
          }}
          name={TABS.BuyTab}
          component={MyCart}
        />
      )}

      {isCustomer && (
        <Tab.Screen
          options={{
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={focused ? ClipboardActiveIcon : ClipboardIcon} />,
          }}
          name={TABS.ClipboardTab}
          component={ClipboardStack}
        />
      )}

      {isCustomer && (
        <Tab.Screen
          options={{
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={focused ? DispatchActiveIcon : DispatchIcon} />,
          }}
          name={TABS.OrdersTab}
          component={OrdersStack}
        />
      )}

      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={focused ? ProfileActiveIcon : ProfileIcon} />,
        }}
        name={TABS.ProfileTab}
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
};

const TabIcon = ({ Icon, focused }) => {
  return (
    <View style={globalStyles.tabContainer}>
      <Icon height={22} width={22} />
      {focused ? <TabActiveIcon width={15} height={15} style={globalStyles.tabTriangle} /> : null}
    </View>
  );
};

export default BottomTab;
