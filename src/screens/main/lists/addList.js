import {View, Pressable} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppButton, AppScrollView, AppText, AppTextInput, Header, Loader, Screen} from '../../../components';
import {listStyles} from '../styles';
import {MenuDotsIcon, RemoveIcon} from '../../../assets/icons';
import globalStyles from '../../../../globalStyles';
import {ROUTES} from '../../../utils/constants';
import BottomSheet from '../../../components/bottomSheet';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';

const AddList = ({navigation, route}) => {
  const bottomSheetRef = useRef();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [listName, setListName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([{id: 1, productName: '', quantity: ''}]);

  const params = route.params;
  const isEditMode = params?.isEditMode;
  const listId = params?.listId;

  useEffect(() => {
    if (isEditMode && listId) {
      getListDetail();
    }
  }, [isEditMode, listId]);

  const getListDetail = () => {
    const onSuccess = response => {
      if (response.success) {
        setListName(response.data.data.listTitle);
        setProducts(response.data.data.items);
      }
    };

    callApi(API_METHODS.GET, `${API.list}/${listId}`, null, onSuccess, onAPIError, setIsLoading);
  };

  const handleDeleteItem = item => {
    products.map(p => (p.isDropdownShow = false));
    setProducts([...products]);
  };

  const handleDotsPress = item => {
    bottomSheetRef.current.open();
    setSelectedProduct(item);
  };

  const handlePressDelete = () => {
    bottomSheetRef.current.close();
    if (selectedProduct) setProducts(products.filter(i => i.id !== selectedProduct.id));
  };

  const handlePressAdd = () => {
    setProducts(prev => [...prev, {id: prev.length + 1, productName: '', quantity: ''}]);
  };

  const handleChangeText = (text, fieldName, index) => {
    if (fieldName === 'quantity') products[index].quantity = text;
    else products[index].productName = text;

    setProducts([...products]);
  };

  const handleDone = () => {
    if (isEditMode && listId) updateList();
    else createList();
  };

  const updateList = async () => {
    const onSuccess = response => {
      if (response.success) {
        navigation.popToTop();
      }
    };

    const data = {items: products, listTitle: listName};
    await callApi(API_METHODS.PATCH, `${API.list}/${listId}`, data, onSuccess, onAPIError, setIsLoading);
  };

  const createList = async () => {
    const onSuccess = response => {
      if (response.success) {
        navigation.navigate(ROUTES.List, {productList: products, listId: response?.data?._id});
      }
    };

    const data = {items: products, listTitle: listName};
    await callApi(API_METHODS.POST, API.createList, data, onSuccess, onAPIError, setIsLoading);
  };

  const getDoneButtonDisableStatus = () => {
    return !listName || products.some(product => !product.productName || !product.quantity);
  };

  return (
    <Screen>
      <Header title={'Add List'} />
      <Loader isLoading={isLoading} />

      <AppScrollView>
        <View style={listStyles.addListHeaderInputContainer}>
          <AppTextInput placeholder="List Name" onChangeText={setListName} value={listName} />
          <AppTextInput placeholder="Product Name" value={products[0].productName} onChangeText={text => handleChangeText(text, 'name', 0)} />
          <View style={listStyles.addListHeaderQuantityInput}>
            <AppTextInput
              placeholder="Quantity"
              value={products[0].quantity}
              containerStyle={{width: '70%', flex: 1}}
              onChangeText={text => handleChangeText(text, 'quantity', 0)}
              // keyboardType={'number-pad'}
            />
            <AppButton title={'Add'} containerStyle={listStyles.addButton} onPress={handlePressAdd} />
          </View>
        </View>

        <View style={listStyles.productsContainer}>
          {products.slice(1).map((item, index) => (
            <View key={index}>
              <View style={[listStyles.productItem, {zIndex: index - 1}]}>
                <View style={listStyles.productCounter}>
                  <AppText>{index + 2}</AppText>
                </View>
                <AppTextInput placeholder="Product Name" containerStyle={{width: '60%'}} value={item.productName} onChangeText={text => handleChangeText(text, 'name', index + 1)} />
                <AppTextInput
                  placeholder="Quantity"
                  containerStyle={{width: '25%'}}
                  value={item.quantity}
                  onChangeText={text => handleChangeText(text, 'quantity', index + 1)}
                  // keyboardType={'number-pad'}
                />
                <Pressable onPress={() => handleDotsPress(item)}>
                  <MenuDotsIcon width={20} height={20} />
                </Pressable>
              </View>
              {item.isDropdownShow && (
                <Pressable onPress={() => handleDeleteItem(item)} style={[listStyles.dotMenuListContainer, listStyles.dropdownItemContainer, {zIndex: index + 1}]}>
                  <RemoveIcon width={15} height={15} />
                  <AppText>Delete</AppText>
                </Pressable>
              )}
            </View>
          ))}
        </View>

        <AppButton title={'Done'} containerStyle={globalStyles.bottomButton} onPress={handleDone} disabled={getDoneButtonDisableStatus()} />
      </AppScrollView>

      <BottomSheet ref={bottomSheetRef}>
        <View style={listStyles.bottomSheetContainer}>
          <AppText style={listStyles.redText} onPress={handlePressDelete}>
            Delete
          </AppText>
        </View>
      </BottomSheet>
    </Screen>
  );
};

export default AddList;
