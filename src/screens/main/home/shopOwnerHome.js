import {View, Text, Pressable, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppScrollView, AppText, AppTextInput, Loader, OrderActionCard, Screen} from '../../../components';
import {homeStyles} from '../styles';
import globalStyles from '../../../../globalStyles';
import {ArrowDownPrimaryIcon, BellIcon, ChatGrayIcon, ClockPrimaryIcon, LogoIcon, SearchIcon, StatPrimaryIcon, TickPrimaryIcon} from '../../../assets/icons';
import {IconWrapper} from './userHome';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../../../utils/theme';
import {ROUTES, TABS} from '../../../utils/constants';
import {useDispatch, useSelector} from 'react-redux';
import {shopOwnerNewOrdersSelector, userSelector} from '../../../redux/selectors';
import commonAPI from '../../../network/commonAPI';
import {useShopOrderActions} from '../../../hooks';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';

const ShopOwnerHome = () => {
  const navigation = useNavigation();
  const {handleAcceptRejectOrder} = useShopOrderActions();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(userSelector);
  const orders = useSelector(shopOwnerNewOrdersSelector);
  const [stats, setStats] = useState({});

  useEffect(() => {
    getNewOrders();
    getShopStats();
  }, []);

  const getShopStats = () => {
    const onSuccess = response => {
      setStats(response?.data);
    };

    callApi(API_METHODS.GET, API.shopStats, null, onSuccess, onAPIError);
  };

  const getNewOrders = async () => {
    commonAPI.getShopNewOrders({dispatch, setIsLoading});
  };

  const handlePullToRefresh = () => {
    getNewOrders();
    getShopStats();
  };

  const handlePressNewOrder = item => {
    navigation.navigate(ROUTES.OrderDetails, {orderId: item?._id, orderType: 'NEW'});
  };

  const completedOrders = isLoading ? '--' : stats?.completedOrders;
  const pendingOrders = isLoading ? '--' : stats?.pendingOrders;
  const totalEarnings = isLoading ? '--' : stats?.totalEarnings?.toString();

  return (
    <Screen>
      <Loader isLoading={isLoading} />
      <View style={[homeStyles.searchContainer, globalStyles.screenPadding]}>
        <AppText fontSize={22} fontFamily={FONTS.medium} style={globalStyles.logoHeaderText}>
          Grocery2Go
        </AppText>
        {/* <AppTextInput textInputContainerStyle={homeStyles.textInputContainerStyle} containerStyle={homeStyles.searchBar} LeftIcon={SearchIcon} placeholder="Search" /> */}
        <View style={homeStyles.iconsContainer}>
          <IconWrapper Icon={BellIcon} onPress={() => navigation.navigate(ROUTES.Notification)} />
          <IconWrapper Icon={ChatGrayIcon} onPress={() => navigation.navigate(ROUTES.ChatInbox)} />
        </View>
      </View>

      <AppScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={handlePullToRefresh} />}>
        <View>
          <View style={homeStyles.sectionLabel}>
            <AppText fontFamily={FONTS.medium} style={globalStyles.flex1} fontSize={16}>
              Stats
            </AppText>
            {/* <Pressable style={homeStyles.thisWeekContainer}>
              <AppText fontFamily={FONTS.medium} fontSize={12} primary onPress={() => navigation.navigate(ROUTES.Groceries)}>
                This Week
              </AppText>
              <ArrowDownPrimaryIcon />
            </Pressable> */}
          </View>

          <View style={homeStyles.statsContainer}>
            <Pressable onPress={() => navigation.navigate(ROUTES.CompletedOrders)} style={homeStyles.statsBoxContainer}>
              <IconWrapper Icon={ClockPrimaryIcon} width={20} height={20} style={homeStyles.statsIcon} />
              <AppText fontFamily={FONTS.medium} fontSize={18} style={homeStyles.statNumber}>
                {completedOrders}
              </AppText>
              <AppText fontSize={12}>Completed Orders</AppText>
            </Pressable>
            <Pressable onPress={() => navigation.navigate(TABS.GroceryOwnerOrdersTab)} style={[homeStyles.statsBoxContainer]}>
              <IconWrapper Icon={TickPrimaryIcon} width={20} height={20} style={homeStyles.statsIcon} />
              <AppText fontFamily={FONTS.medium} fontSize={18} style={homeStyles.statNumber}>
                {pendingOrders}
              </AppText>
              <AppText fontSize={12}>Orders in Process</AppText>
            </Pressable>
            <Pressable onPress={() => navigation.navigate(ROUTES.TotalEarnings)} style={homeStyles.statsBoxContainer}>
              <IconWrapper Icon={StatPrimaryIcon} width={20} height={20} style={homeStyles.statsIcon} />
              <AppText fontFamily={FONTS.medium} fontSize={18} style={homeStyles.statNumber}>
                ${totalEarnings}
              </AppText>
              <AppText fontSize={12}>Total Earnings</AppText>
            </Pressable>
          </View>
        </View>

        <View style={globalStyles.flex1}>
          <View style={homeStyles.sectionLabel}>
            <AppText fontFamily={FONTS.medium} style={globalStyles.flex1} fontSize={16}>
              New Orders
            </AppText>

            <AppText greyText fontFamily={FONTS.medium} fontSize={12} onPress={() => navigation.navigate(ROUTES.ShopNewOrders)}>
              See all
            </AppText>
          </View>

          <View style={globalStyles.inputsGap}>
            {orders &&
              orders
                ?.slice(-3)
                .reverse()
                .map((item, index) => (
                  <OrderActionCard
                    key={index}
                    onPressAccept={item => handleAcceptRejectOrder(item, 'accept')}
                    onPressReject={item => handleAcceptRejectOrder(item, 'reject')}
                    item={item}
                    type={'SHOP_NEW_ORDER'}
                    onPress={handlePressNewOrder}
                    loggedInUserLocation={user?.location}
                    myShopId={user?.shopId}
                  />
                ))}
          </View>

          {orders?.length === 0 ? (
            <View style={homeStyles.noOrderContainer}>
              <AppText>No Order</AppText>
            </View>
          ) : null}
        </View>
      </AppScrollView>
    </Screen>
  );
};

export default ShopOwnerHome;
