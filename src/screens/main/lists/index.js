import { FlatList, Pressable, View } from "react-native";
import React, { useCallback, useState } from "react";
import { AppText, Header, Loader, Screen } from "../../../components";
import { ChevronIcon, NoListIcon, PlusIcon } from "../../../assets/icons";
import { onAPIError, wp } from "../../../helpers";
import globalStyles from "../../../../globalStyles";
import { listStyles } from "../styles";
import { ROUTES } from "../../../utils/constants";
import { API_METHODS, callApi } from "../../../network/NetworkManger";
import { API } from "../../../network/Environment";
import { FONTS } from "../../../utils/theme";
import { customerListActions } from "../../../redux/slices/customer/customerList";
import { useDispatch, useSelector } from "react-redux";
import { customerListsSelector } from "../../../redux/selectors";
import { useFocusEffect } from "@react-navigation/native";

const Lists = ({ navigation }) => {
  const dispatch = useDispatch();
  const lists = useSelector(customerListsSelector);
  const [isLoading, setIsLoading] = useState(false);

  const getLists = useCallback(() => {
    const onSuccess = (response) => {
      if (response.success) {
        dispatch(customerListActions.setMyLists(response.data));
      }
    };

    callApi(
      API_METHODS.GET,
      API.getUserLists,
      null,
      onSuccess,
      onAPIError,
      setIsLoading
    );
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      getLists();
    }, [getLists])
  );

  const handlePressList = (item) => {
    navigation.navigate(ROUTES.List, {
      productList: item.items || [],
      listId: item._id,
      listTitle: item.listTitle,
    });
  };

  const renderListEmptyComponent = () => {
    return (
      <View style={listStyles.emptyStateCard}>
        <NoListIcon width={wp(34)} height={wp(34)} />
        <AppText style={listStyles.emptyStateTitle}>No saved lists yet</AppText>
        <AppText fontSize={12} style={listStyles.emptyStateSubtitle}>
          Create your first list with the Add List button below.
        </AppText>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={listStyles.pageIntroCard}>
      <AppText style={listStyles.pageIntroTitle}>Saved Lists</AppText>
      <AppText fontSize={12} style={listStyles.pageIntroSubtitle}>
        Tap a list to open it, check the products, or edit it when you need to
        change something.
      </AppText>
    </View>
  );

  return (
    <Screen>
      <Header title={"My Lists"} />
      <Loader isLoading={isLoading} />

      <FlatList
        data={lists}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={getLists}
        refreshing={false}
        renderItem={({ item }) => (
          <List onPress={handlePressList} item={item} />
        )}
        ListEmptyComponent={renderListEmptyComponent}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[
          globalStyles.flexGrow1,
          globalStyles.screenPadding,
          globalStyles.inputsGap,
          { paddingBottom: 120 },
        ]}
      />

      <Pressable
        style={({ pressed }) => [
          listStyles.listFloatingButton,
          pressed && { opacity: 0.9 },
        ]}
        onPress={() => navigation.navigate(ROUTES.AddList)}
      >
        <PlusIcon width={18} height={18} />
        <AppText style={listStyles.listFloatingButtonText}>Add List</AppText>
      </Pressable>
    </Screen>
  );
};

const List = ({ item, onPress }) => {
  const productCount = item?.items?.length || 0;

  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        listStyles.oneListContainer,
        pressed && listStyles.oneListContainerPressed,
      ]}
    >
      <View style={listStyles.oneListHeaderRow}>
        <View style={listStyles.listCountBadge}>
          <AppText style={listStyles.listCountText}>{productCount}</AppText>
        </View>
        <View style={listStyles.listTitleContainer}>
          <AppText fontFamily={FONTS.semiBold} fontSize={15} numberOfLines={1}>
            {item.listTitle}
          </AppText>
          <AppText greyText fontSize={12}>
            {productCount} product{productCount === 1 ? "" : "s"}
          </AppText>
        </View>
        <View style={listStyles.listOpenBadge}>
          <ChevronIcon
            width={16}
            height={16}
            style={{ transform: [{ rotate: "-90deg" }] }}
          />
        </View>
      </View>
      <AppText fontSize={12} style={listStyles.listCardHelperText}>
        Tap to open and manage this list.
      </AppText>
    </Pressable>
  );
};

export default Lists;
