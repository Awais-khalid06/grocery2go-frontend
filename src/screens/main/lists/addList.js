import { Pressable, View } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AppButton,
  AppScrollView,
  AppText,
  AppTextInput,
  Header,
  Loader,
  Screen,
} from "../../../components";
import { RemoveIcon } from "../../../assets/icons";
import { COLORS } from "../../../utils/theme";
import { listStyles } from "../styles";
import globalStyles from "../../../../globalStyles";
import { ROUTES } from "../../../utils/constants";
import BottomSheet from "../../../components/bottomSheet";
import { API_METHODS, callApi } from "../../../network/NetworkManger";
import { API } from "../../../network/Environment";
import { onAPIError } from "../../../helpers";

const AddList = ({ navigation, route }) => {
  const bottomSheetRef = useRef();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [listName, setListName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([
    { id: 1, productName: "", quantity: "" },
  ]);

  const params = route.params;
  const isEditMode = params?.isEditMode;
  const listId = params?.listId;
  const screenTitle = isEditMode ? "Edit List" : "Add List";

  useEffect(() => {
    if (isEditMode && listId) {
      getListDetail();
    }
  }, [isEditMode, listId]);

  const getListDetail = () => {
    const onSuccess = (response) => {
      if (response.success) {
        setListName(response.data.data.listTitle);
        const safeItems = Array.isArray(response.data.data.items)
          ? response.data.data.items
          : [];
        setProducts(
          safeItems.length > 0
            ? safeItems.map((item, index) => ({
                ...item,
                id: item?.id ?? item?._id ?? index + 1,
              }))
            : [{ id: 1, productName: "", quantity: "" }]
        );
      }
    };

    callApi(
      API_METHODS.GET,
      `${API.list}/${listId}`,
      null,
      onSuccess,
      onAPIError,
      setIsLoading
    );
  };

  const getProductKey = (item) => String(item?.id ?? item?._id ?? "");

  const handleDotsPress = (item) => {
    bottomSheetRef.current.open();
    setSelectedProduct(item);
  };

  const handlePressDelete = () => {
    bottomSheetRef.current.close();
    if (selectedProduct) {
      setProducts((prev) => {
        const nextProducts = prev.filter(
          (i) => getProductKey(i) !== getProductKey(selectedProduct)
        );
        return nextProducts.length > 0
          ? nextProducts
          : [{ id: 1, productName: "", quantity: "" }];
      });
      setSelectedProduct(null);
    }
  };

  const handlePressAdd = () => {
    setProducts((prev) => [
      ...prev,
      { id: Date.now(), productName: "", quantity: "" },
    ]);
  };

  const handleChangeText = (text, fieldName, index) => {
    setProducts((prev) => {
      const nextProducts = [...prev];
      nextProducts[index] = {
        ...nextProducts[index],
        [fieldName === "quantity" ? "quantity" : "productName"]: text,
      };
      return nextProducts;
    });
  };

  const handleDone = () => {
    if (isEditMode && listId) updateList();
    else createList();
  };

  const updateList = async () => {
    const onSuccess = (response) => {
      if (response.success) {
        navigation.popToTop();
      }
    };

    const data = { items: products, listTitle: listName };
    await callApi(
      API_METHODS.PATCH,
      `${API.list}/${listId}`,
      data,
      onSuccess,
      onAPIError,
      setIsLoading
    );
  };

  const createList = async () => {
    const onSuccess = (response) => {
      if (response.success) {
        navigation.navigate(ROUTES.List, {
          productList: products,
          listId: response?.data?._id,
          listTitle: listName,
        });
      }
    };

    const data = { items: products, listTitle: listName };
    await callApi(
      API_METHODS.POST,
      API.createList,
      data,
      onSuccess,
      onAPIError,
      setIsLoading
    );
  };

  const isTopProductComplete = useMemo(() => {
    const topProduct = products?.[0] || {};
    return Boolean(
      String(topProduct?.productName || "").trim() &&
        String(topProduct?.quantity || "").trim()
    );
  }, [products]);

  const getDoneButtonDisableStatus = () => {
    return (
      !String(listName || "").trim() ||
      products.some(
        (product) =>
          !String(product?.productName || "").trim() ||
          !String(product?.quantity || "").trim()
      )
    );
  };

  return (
    <Screen>
      <Header title={screenTitle} />
      <Loader isLoading={isLoading} />

      <AppScrollView>
        <View style={globalStyles.inputsGap}>
          <View style={listStyles.formCard}>
            <View style={listStyles.formSectionHeader}>
              <AppText style={listStyles.formSectionTitle}>
                {isEditMode ? "Update your list" : "Create a new list"}
              </AppText>
              <AppText fontSize={12} style={listStyles.formSectionSubtitle}>
                Give the list a clear name so it is easy to find later.
              </AppText>
            </View>
            <AppTextInput
              label="List name"
              placeholder="Weekly groceries"
              onChangeText={setListName}
              value={listName}
            />
          </View>

          <View style={listStyles.formCard}>
            <View style={listStyles.formSectionHeader}>
              <AppText style={listStyles.formSectionTitle}>Products</AppText>
              <AppText fontSize={12} style={listStyles.formSectionSubtitle}>
                Fill the first row, then press add to create the next item.
              </AppText>
            </View>

            <View style={listStyles.builderCard}>
              <AppTextInput
                label="Product name"
                placeholder="Milk"
                value={products[0]?.productName}
                onChangeText={(text) => handleChangeText(text, "name", 0)}
              />
              <AppTextInput
                label="Quantity"
                placeholder="1 pack"
                value={products[0]?.quantity}
                onChangeText={(text) => handleChangeText(text, "quantity", 0)}
              />
              <AppButton
                title={"Add Product"}
                containerStyle={listStyles.builderButton}
                textStyle={listStyles.builderButtonText}
                onPress={handlePressAdd}
                disabled={!isTopProductComplete}
              />
            </View>

            <View style={listStyles.productsContainer}>
              {products.slice(1).map((item, index) => (
                <View
                  key={getProductKey(item) || index}
                  style={listStyles.productRowCard}
                >
                  <View style={listStyles.productRowHeader}>
                    <View style={listStyles.detailListIndexBadge}>
                      <AppText style={listStyles.detailListIndexText}>
                        {index + 2}
                      </AppText>
                    </View>
                    <Pressable
                      onPress={() => handleDotsPress(item)}
                      style={listStyles.productDeleteButton}
                    >
                      <RemoveIcon width={15} height={15} />
                    </Pressable>
                  </View>

                  <View style={listStyles.productRowFields}>
                    <AppTextInput
                      placeholder="Product name"
                      containerStyle={listStyles.productRowField}
                      value={item.productName}
                      onChangeText={(text) =>
                        handleChangeText(text, "name", index + 1)
                      }
                    />
                    <AppTextInput
                      placeholder="Quantity"
                      containerStyle={listStyles.productRowQuantityField}
                      value={item.quantity}
                      onChangeText={(text) =>
                        handleChangeText(text, "quantity", index + 1)
                      }
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          <AppButton
            title={isEditMode ? "Update List" : "Save List"}
            containerStyle={globalStyles.bottomButton}
            onPress={handleDone}
            disabled={getDoneButtonDisableStatus()}
          />
        </View>
      </AppScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        height={260}
        onClose={() => setSelectedProduct(null)}
      >
        <View style={listStyles.deleteSheetContainer}>
          <AppText style={listStyles.deleteSheetTitle}>Remove item?</AppText>
          <AppText style={listStyles.deleteSheetText} fontSize={12}>
            {selectedProduct?.productName
              ? `Delete "${selectedProduct.productName}" from this list.`
              : "This item will be removed from the list."}
          </AppText>
          <View style={listStyles.deleteSheetActions}>
            <AppButton
              title={"Cancel"}
              transparentButton={true}
              containerStyle={[
                listStyles.deleteSheetButton,
                { borderWidth: 1, borderColor: COLORS.grey2 },
              ]}
              textStyle={listStyles.deleteSheetButtonText}
              onPress={() => {
                bottomSheetRef.current.close();
                setSelectedProduct(null);
              }}
            />
            <AppButton
              title={"Delete"}
              transparentButton={true}
              containerStyle={[
                listStyles.deleteSheetButton,
                { borderWidth: 1, borderColor: COLORS.red },
              ]}
              textStyle={[
                listStyles.deleteSheetButtonText,
                { color: COLORS.red },
              ]}
              onPress={handlePressDelete}
            />
          </View>
        </View>
      </BottomSheet>
    </Screen>
  );
};

export default AddList;
