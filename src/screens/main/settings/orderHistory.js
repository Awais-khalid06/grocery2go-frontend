import React, {useCallback, useState} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {FlatListEmptyComponent, Header, Loader, Screen, AppText} from '../../../components';
import {WoodBoxIcon, ChevronIcon} from '../../../assets/icons';
import {COLORS, FONTS} from '../../../utils/theme';
import globalStyles from '../../../../globalStyles';
import {formatOrderPlacedDate} from '../../../helpers';
import {ROUTES} from '../../../utils/constants';
import {useSelector} from 'react-redux';
import {userSelector} from '../../../redux/selectors';
import {useAccountType} from '../../../hooks';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';

const OrderHistory = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(userSelector) || {};
  const {isCustomer, isDriver, isGroceryOwner} = useAccountType();

  const getOrderHistory = useCallback(async () => {
    const onSuccess = response => {
      const safeOrders = Array.isArray(response?.data) ? response.data : Array.isArray(response?.orders) ? response.orders : [];
      setOrders(safeOrders);
    };

    const endpoint = isDriver
      ? `${API.riderCompletedOrders}/${user?._id}`
      : isGroceryOwner
      ? `${API.shopCompletedOrders}/${user?.shopId}`
      : API.userCompletedOrders;

    callApi(API_METHODS.GET, endpoint, null, onSuccess, onAPIError, setIsLoading);
  }, [isDriver, isGroceryOwner, user?._id, user?.shopId]);

  useFocusEffect(
    useCallback(() => {
      getOrderHistory();
    }, [getOrderHistory]),
  );

  const handleOrderPress = item => {
    if (!item?._id) return;
    if (isCustomer && item?.orderType === 'listOrder') {
      navigation.navigate(ROUTES.UserListOrderDetail, {orderId: item._id});
      return;
    }

    if (isDriver && item?.orderType === 'listOrder') {
      navigation.navigate(ROUTES.DriverListOrderDetail, {orderId: item._id});
      return;
    }

    navigation.navigate(ROUTES.OrderDetails, {orderId: item._id});
  };

  const renderOrderCard = ({item}) => {
    const shopDetails = item?.shopDetails || item?.shopDetailWithProduct || [];
    const shopNames = Array.isArray(shopDetails) ? shopDetails.map(shop => shop?.shopTitle || shop?.shopName).filter(Boolean) : [];
    const fallbackLabel = item?.orderType === 'listOrder' ? 'Grocery list' : 'Grocery order';
    const shopLabel =
      shopNames.length > 0
        ? `${shopNames.slice(0, 2).join(', ')}${shopNames.length > 2 ? ` +${shopNames.length - 2} more` : ''}`
        : fallbackLabel;

    const itemsTotal = Number(item?.orderSummary?.itemsTotal || item?.itemsTotal || 0).toFixed(2);
    const deliveryFee = Number(item?.deliveryFee ?? item?.orderSummary?.deliveryFee ?? item?.deliveryCharges ?? 0).toFixed(2);
    const totalPayment = Number(item?.orderSummary?.totalPayment || item?.totalPayment || 0).toFixed(2);

    return (
      <Pressable onPress={() => handleOrderPress(item)} style={({pressed}) => [styles.card, pressed && styles.cardPressed]}>
        <View style={styles.cardHeader}>
          <View style={styles.iconWrapper}>
            <WoodBoxIcon width={24} height={24} />
          </View>

          <View style={globalStyles.flex1}>
            <View style={styles.topRow}>
              <AppText fontFamily={FONTS.semiBold} style={globalStyles.flex1} numberOfLines={1}>
                Order {item?.orderNumber}
              </AppText>
              <View style={styles.statusPill}>
                <AppText fontSize={11} style={styles.statusText}>
                  Completed
                </AppText>
              </View>
            </View>

            <AppText greyText fontSize={12} numberOfLines={1} style={styles.shopText}>
              {shopLabel}
            </AppText>
            <AppText greyText fontSize={11}>
              {formatOrderPlacedDate(item)}
            </AppText>
          </View>

          <ChevronIcon width={18} />
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <AppText fontSize={11} greyText>
              Items Total
            </AppText>
            <AppText fontFamily={FONTS.medium}>${itemsTotal}</AppText>
          </View>

          <View style={styles.summaryItem}>
            <AppText fontSize={11} greyText>
              Delivery Fee
            </AppText>
            <AppText fontFamily={FONTS.medium}>${deliveryFee}</AppText>
          </View>

          <View style={styles.summaryItem}>
            <AppText fontSize={11} greyText>
              Total
            </AppText>
            <AppText primary fontFamily={FONTS.semiBold}>
              ${totalPayment}
            </AppText>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <Screen>
      <Header title={'Order History'} />
      <Loader isLoading={isLoading} />

      <FlatList
        data={orders}
        keyExtractor={item => item?._id?.toString?.() || item?.orderNumber}
        renderItem={renderOrderCard}
        contentContainerStyle={[globalStyles.flexGrow1, globalStyles.screenPadding, globalStyles.inputsGap, globalStyles.screenPaddingBottom10]}
        ListEmptyComponent={<FlatListEmptyComponent label={isLoading ? '' : 'No completed orders yet'} />}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    gap: 14,
    ...globalStyles.boxShadow1,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 45, 8, 0.08)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  shopText: {
    marginTop: 2,
    marginBottom: 4,
  },
  statusPill: {
    backgroundColor: 'rgba(29, 197, 96, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    color: COLORS.green,
    fontFamily: FONTS.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: COLORS.lightblue,
    borderRadius: 14,
    padding: 12,
  },
  summaryItem: {
    flex: 1,
    gap: 4,
  },
});

export default OrderHistory;
