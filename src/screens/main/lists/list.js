import { Pressable, View } from "react-native";
import React, { useState } from "react";
import {
  AppButton,
  AppScrollView,
  AppText,
  Header,
  Loader,
  Screen,
} from "../../../components";
import {
  EditPencilIcon,
  MenuDotsIcon,
  RemoveIcon,
} from "../../../assets/icons";
import { FONTS } from "../../../utils/theme";
import { listStyles } from "../styles";
import globalStyles from "../../../../globalStyles";
import { ROUTES } from "../../../utils/constants";
import { API_METHODS, callApi } from "../../../network/NetworkManger";
import { API } from "../../../network/Environment";
import { onAPIError } from "../../../helpers";
import { useDispatch } from "react-redux";
import { customerListActions } from "../../../redux/slices/customer/customerList";

const List = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [dotMenuShow, setDotMenuShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const params = route?.params;
  const productList = params?.productList || [];
  const listId = params?.listId;
  const listTitle = params?.listTitle;

  const handleDeleteList = () => {
    setDotMenuShow(false);

    const onSuccess = (response) => {
      if (response.success) {
        dispatch(customerListActions.removeList(listId));
        navigation.goBack();
      }
    };

    callApi(
      API_METHODS.DELETE,
      `${API.list}/${listId}`,
      null,
      onSuccess,
      onAPIError,
      setIsLoading
    );
  };

  return (
    <Screen>
      <Loader isLoading={isLoading} />

      <View style={{ zIndex: 1 }}>
        <Header
          title={listTitle || "List Details"}
          RightIcon={MenuDotsIcon}
          onPressRightIcon={() => setDotMenuShow((p) => !p)}
        />
        {dotMenuShow && (
          <View style={listStyles.dotMenuListContainer}>
            <Pressable
              onPress={() => {
                setDotMenuShow(false);
                navigation.navigate(ROUTES.AddList, {
                  isEditMode: true,
                  listId,
                });
              }}
              style={[
                listStyles.dropdownItemContainer,
                listStyles.listPaddingAndBorder,
              ]}
            >
              <EditPencilIcon width={15} height={15} />
              <AppText>Edit</AppText>
            </Pressable>
            <Pressable
              onPress={handleDeleteList}
              style={[
                listStyles.dropdownItemContainer,
                listStyles.listPaddingAndBorder,
              ]}
            >
              <RemoveIcon width={15} height={15} />
              <AppText>Delete</AppText>
            </Pressable>
          </View>
        )}
      </View>

      <AppScrollView contentContainerStyle={{ zIndex: -1 }}>
        <View style={globalStyles.inputsGap}>
          <View style={listStyles.listDetailSummaryCard}>
            <View style={listStyles.listDetailHeaderRow}>
              <View style={listStyles.listDetailTitleContainer}>
                <AppText
                  fontFamily={FONTS.semiBold}
                  fontSize={18}
                  numberOfLines={1}
                >
                  {listTitle || "Saved List"}
                </AppText>
                <AppText
                  greyText
                  fontSize={12}
                  style={listStyles.listCardHelperText}
                >
                  Review the products here before assigning a rider.
                </AppText>
              </View>
              <View style={listStyles.listDetailMetaPill}>
                <AppText style={listStyles.listDetailMetaPillText}>
                  {productList.length} item{productList.length === 1 ? "" : "s"}
                </AppText>
              </View>
            </View>

            <View style={listStyles.listDetailMetaRow}>
              <View style={listStyles.listDetailMetaPillMuted}>
                <AppText style={listStyles.listDetailMetaPillMutedText}>
                  Edit from menu
                </AppText>
              </View>
              <View style={listStyles.listDetailMetaPillMuted}>
                <AppText style={listStyles.listDetailMetaPillMutedText}>
                  Select rider when ready
                </AppText>
              </View>
            </View>
          </View>

          {productList.length > 0 ? (
            <View style={listStyles.detailListContainer}>
              {productList.map((item, index) => (
                <View
                  key={`${item?._id || item?.id || index}`}
                  style={listStyles.detailListRow}
                >
                  <View style={listStyles.detailListIndexBadge}>
                    <AppText style={listStyles.detailListIndexText}>
                      {index + 1}
                    </AppText>
                  </View>

                  <View style={listStyles.detailListContent}>
                    <AppText
                      fontFamily={FONTS.medium}
                      fontSize={12}
                      numberOfLines={1}
                    >
                      {item?.productName}
                    </AppText>
                    <AppText greyText fontSize={12} numberOfLines={1}>
                      Saved product
                    </AppText>
                  </View>

                  <View style={listStyles.detailQuantityPill}>
                    <AppText
                      style={listStyles.detailQuantityText}
                      numberOfLines={1}
                    >
                      {item.quantity}
                    </AppText>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={listStyles.emptyStateCard}>
              <AppText style={listStyles.emptyStateTitle}>
                No products in this list
              </AppText>
              <AppText fontSize={12} style={listStyles.emptyStateSubtitle}>
                Edit the list from the menu and add items first.
              </AppText>
            </View>
          )}

          <AppText fontSize={12} style={listStyles.detailFooterHint}>
            Once the list looks right, assign a rider to start shopping.
          </AppText>

          <AppButton
            title={"Select Rider"}
            containerStyle={globalStyles.bottomButton}
            disabled={productList.length === 0}
            onPress={() =>
              navigation.navigate(ROUTES.Riders, { listId, listTitle })
            }
          />
        </View>
      </AppScrollView>
    </Screen>
  );
};

export default List;
