import {View, Text, Pressable, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppScrollView, AppText, AppTextInput, Loader, OrderActionCard, Screen} from '../../../components';
import {homeStyles} from '../styles';
import globalStyles from '../../../../globalStyles';
import {ArrowDownPrimaryIcon, BellIcon, ChatGrayIcon, ChatIcon, ChatWhiteIcon, ClockPrimaryIcon, SearchIcon, StatPrimaryIcon, TickPrimaryIcon} from '../../../assets/icons';
import {IconWrapper} from './userHome';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../../../utils/theme';
import {ROUTES, TABS} from '../../../utils/constants';
import {useDispatch, useSelector} from 'react-redux';
import {driverNewOrdersSelector} from '../../../redux/selectors';
import {useDriverOrderActions} from '../../../hooks';
import commonAPI from '../../../network/commonAPI';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';

const DriverHome = () => {
  const dispatch = useDispatch();
  const {handleAcceptRejectOrder, handlePressNewOrder} = useDriverOrderActions();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Offline');
  const orders = useSelector(driverNewOrdersSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({});

  const completedOrders = isLoading ? '--' : stats?.completedOrders;
  const pendingOrders = isLoading ? '--' : stats?.inProgressOrders;
  const totalEarnings = isLoading ? '--' : stats?.totalEarnings?.toString();

  useEffect(() => {
    getOrders();
    getRiderStats();
  }, []);

  const getRiderStats = () => {
    const onSuccess = response => {
      // console.log('STAT:', response);
      setStats(response?.data);
    };

    callApi(API_METHODS.GET, API.riderStats, null, onSuccess, onAPIError);
  };

  const getOrders = () => {
    commonAPI.getDriverNewOrders({dispatch, setIsLoading});
  };

  const handlePullToRefresh = () => {
    getOrders();
    getRiderStats();
  };

  return (
    <Screen>
      <Loader isLoading={isLoading} />
      <View style={[homeStyles.searchContainer, globalStyles.screenPadding]}>
        <AppText fontSize={22} fontFamily={FONTS.medium} style={globalStyles.logoHeaderText}>
          Grocery2Go
        </AppText>
        {/* <AppTextInput textInputContainerStyle={homeStyles.textInputContainerStyle} containerStyle={homeStyles.searchBar} LeftIcon={SearchIcon} placeholder="Search order" /> */}
        <View style={homeStyles.iconsContainer}>
          <IconWrapper Icon={BellIcon} onPress={() => navigation.navigate(ROUTES.Notification)} />
          <IconWrapper Icon={ChatGrayIcon} onPress={() => navigation.navigate(ROUTES.ChatInbox)} />
        </View>
      </View>

      <AppScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={handlePullToRefresh} />}>
        {/* <View style={homeStyles.offileOnlineTabContainer}>
          <View style={[homeStyles.tabText, {backgroundColor: activeTab === 'Offline' ? COLORS.primary : 'transparent'}]}>
            <AppText onPress={() => setActiveTab('Offline')} style={{color: activeTab === 'Offline' ? COLORS.white : COLORS.textGray}} fontFamily={FONTS.medium}>
              Offline
            </AppText>
          </View>

          <View style={[homeStyles.tabText, {backgroundColor: activeTab === 'Online' ? COLORS.primary : 'transparent'}]}>
            <AppText onPress={() => setActiveTab('Online')} style={{color: activeTab === 'Online' ? COLORS.white : COLORS.textGray}} fontFamily={FONTS.medium}>
              Online
            </AppText>
          </View>
        </View> */}
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

            <AppText greyText fontFamily={FONTS.medium} fontSize={12} onPress={() => navigation.navigate(ROUTES.DriverNewOrders)}>
              See all
            </AppText>
          </View>

          <View style={globalStyles.inputsGap}>
            {orders?.length > 0 &&
              orders
                ?.slice(0, 5)
                .map((item, index) => (
                  <OrderActionCard
                    onPress={handlePressNewOrder}
                    key={index}
                    item={item}
                    type={'DRIVER_NEW_ORDER'}
                    isPriceShow={false}
                    onPressAccept={item => handleAcceptRejectOrder(item, 'accept')}
                    onPressReject={item => handleAcceptRejectOrder(item, 'reject')}
                  />
                ))}
          </View>

          {orders?.length === 0 && (
            <View style={homeStyles.noOrderContainer}>
              <AppText>No order</AppText>
            </View>
          )}
        </View>
      </AppScrollView>
    </Screen>
  );
};

export default DriverHome;
