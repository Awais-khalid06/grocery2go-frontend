import {View, Pressable, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppButton, AppScrollView, AppText, AppTextInput, Header, Loader, Screen, ShowMessage} from '../../../components';
import {FONTS} from '../../../utils/theme';
import {CrossGrayIcon, UploadPrimaryIcon} from '../../../assets/icons';
import {productStyles} from '../styles';
import globalStyles from '../../../../globalStyles';
import DropDownPicker from 'react-native-dropdown-picker';
import {imagePickerFromGallery, onAPIError, uploadImageToS3} from '../../../helpers';
import {addProductValidations} from '../../../utils/validations';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {useDispatch, useSelector} from 'react-redux';
import {productCategoriesSelector} from '../../../redux/selectors';
import commonAPI from '../../../network/commonAPI';

const AddProduct = ({navigation, route}) => {
  const user = useSelector(state => state?.auth.accessToken);
  const dispatch = useDispatch();
  const params = route.params;
  const isEditMode = params?.screenType === 'EDIT_MODE';
  const shopId = params?.shopId;
  const productId = params?.productId;

  const productCategoriesCache = useSelector(productCategoriesSelector);
  const [isLoading, setIsLoading] = useState(false);

  const [productCategoriesItems, setProductCategoriesItems] = useState([]);
  const [productCategoriesOpen, setProductCategoriesOpen] = useState(false);
  const [productCategoriesValue, setProductCategoriesValue] = useState(null);

  const [unitTypeItems, setUnitTypeItems] = useState([
    {label: 'Weight (e.g., pounds, kilograms)', value: 'weight'},
    {label: 'Volume (e.g., ounces, liters)', value: 'volume'},
    {label: 'Quantity (e.g., number of units)', value: 'quantity'},
  ]);
  const [unitTypeDropdownOpen, setUnitTypeDropdownOpen] = useState(false);
  const [unitTypeValue, setUnitTypeValue] = useState(null);

  const [formData, setFormData] = useState({
    productImages: [],
    productName: '',
    price: '',
    salesTax: '',
    volume: '0',
    manufacturedBy: '',
    quantity: '0',
    description: '',
  });

  const productImages = formData.productImages;
  const PRODUCT_IMAGES_COUNT = 5;

  useEffect(() => {
    if (productCategoriesCache.length == 0) getCategories();
    if (isEditMode && params?.item) {
      console.log('EDIT_PRODUCT_ROUTE_ITEM:', params.item);
      prefillProductFields(params.item, 'route-item');
    }
    if (isEditMode && productId) getProductDetail();
  }, [isEditMode, productId, productCategoriesCache, params?.item]);

  useEffect(() => {
    setProductCategoriesItems(productCategoriesCache);
  }, [productCategoriesCache]);

  const getProductDetail = async () => {
    setIsLoading(true);
    const response = await commonAPI.getOneProductDetail(productId);
    setIsLoading(false);

    if (response.success) {
      console.log('EDIT_PRODUCT_DETAIL_RESPONSE:', response);
      prefillProductFields(response.data, 'api-detail');
    } else {
      console.log('EDIT_PRODUCT_DETAIL_ERROR_RESPONSE:', response);
    }
  };

  const inferUnitTypeValue = product => {
    const explicitUnit = product?.unitTypeValue || product?.unitType;
    if (explicitUnit && ['weight', 'volume', 'quantity'].includes(explicitUnit)) {
      return explicitUnit;
    }

    const quantity = Number(product?.quantity || 0);
    const volume = Number(product?.volume || 0);

    if (quantity > 0) return 'quantity';
    if (volume > 0) return 'volume';
    return null;
  };

  const getCategoryValue = product => {
    if (Array.isArray(product?.categoryName)) return product.categoryName?.[0]?.categoryName || null;
    if (typeof product?.categoryName === 'string') return product.categoryName;
    return null;
  };

  const prefillProductFields = (product, source = 'unknown') => {
    if (!product) return;

    const mappedUnitType = inferUnitTypeValue(product);
    const mappedCategory = getCategoryValue(product);

    setFormData({
      productImages: Array.isArray(product?.productImages) ? product.productImages.map(img => ({uri: img, s3Url: true})) : [],
      productName: product?.productName || '',
      price: product?.price?.toString?.() || '',
      salesTax: product?.salesTax?.toString?.() || '',
      volume: product?.volume?.toString?.() || '0',
      manufacturedBy: product?.manufacturedBy || '',
      quantity: product?.quantity?.toString?.() || '0',
      description: product?.description || '',
    });

    setProductCategoriesValue(mappedCategory);
    setUnitTypeValue(mappedUnitType);

    console.log(`EDIT_PRODUCT_PREFILL_${source.toUpperCase()}:`, {
      productId: product?._id,
      category: mappedCategory,
      unitTypeValue: mappedUnitType,
      quantity: product?.quantity,
      volume: product?.volume,
      rawProduct: product,
    });
  };

  const getCategories = async () => {
    commonAPI.getProductCategories(dispatch);
  };

  const handleChangeText = (value, type) => {
    setFormData(prev => ({...prev, [type]: value}));
  };

  const handleAddProduct = async () => {
    if (isEditMode && !productId) {
      ShowMessage('Product ID missing for update');
      console.log('UPDATE_PRODUCT_ABORTED_MISSING_PRODUCT_ID:', {params});
      return;
    }

    const data = {...formData, shopType: 'shop', categoryName: productCategoriesValue, unitTypeValue};
    const isValidate = addProductValidations(data);
    if (!isValidate) return;

    setIsLoading(true);
    let images = [];
    try {
      images = await Promise.all(
        productImages.map(async img => {
          if (img.fileName) {
            return await uploadImageToS3(formatedS3Files(img));
          }

          return img.uri;
        }),
      );
    } catch (error) {
      setIsLoading(false);
      ShowMessage(error?.message || 'Unable to upload product images.');
      console.log('Add product image upload error:', error);
      return;
    }

    let formatedData = {productImages: images};

    if (isEditMode) {
      formatedData = {
        productId: productId,
        categoryName: productCategoriesValue,
        productDetails: {...data, ...formatedData},
      };
      console.log('UPDATE_PRODUCT_PAYLOAD:', formatedData);
      const response = await commonAPI.updateProductAPI(formatedData);
      console.log('UPDATE_PRODUCT_RESPONSE:', response);
      setIsLoading(false);
      if (response?.success) {
        ShowMessage('Product updated successfully');
        navigation.goBack();
      }
    } else {
      formatedData = {...data, ...formatedData, shopId};
      const response = await addProductAPI(formatedData);
      setIsLoading(false);
      if (response?.success) {
        ShowMessage('Product added successfully');
        navigation.goBack();
      }
    }
  };

  const formatedS3Files = file => {
    return {
      uri: file.uri,
      name: file.fileName,
      type: file.type,
    };
  };

  const addProductAPI = async data => {
    let apiResponse = {};
    const onSuccess = response => {
      apiResponse = response;
    };
    const onError = error => {
      apiResponse = error;
      onAPIError(error);
    };
    await callApi(API_METHODS.POST, API.productCreate, data, onSuccess, onError);
    return apiResponse;
  };

  const handleUploadImagePress = async () => {
    const assets = await imagePickerFromGallery({selectionLimit: PRODUCT_IMAGES_COUNT - productImages.length});
    setFormData(prev => ({...prev, productImages: [...prev.productImages, ...assets]}));
  };

  const handleRemoveImage = img => {
    setFormData(prev => ({...prev, productImages: productImages.filter(i => i.uri !== img.uri)}));
  };

  return (
    <Screen>
      <Header title={'Add Product'} />
      <Loader isLoading={isLoading} />
      <AppScrollView>
        <View style={productStyles.uploadContainer}>
          <AppText fontFamily={FONTS.medium}>Upload Product Images</AppText>

          {productImages.length > 0 ? (
            <View style={productStyles.imagesMainContainer}>
              <View style={productStyles.imagesContainer}>
                {productImages.map((img, index) => (
                  <View key={index}>
                    <Image source={{uri: img.uri}} style={productStyles.image} />
                    <Pressable style={productStyles.crossIconImage} onPress={() => handleRemoveImage(img)}>
                      <CrossGrayIcon width={10} height={10} />
                    </Pressable>
                  </View>
                ))}
                <Pressable
                  style={[productStyles.image, productStyles.uploadimageIcon, {opacity: PRODUCT_IMAGES_COUNT === productImages.length ? 0.5 : 1}]}
                  onPress={handleUploadImagePress}
                  disabled={PRODUCT_IMAGES_COUNT === productImages.length}>
                  <UploadPrimaryIcon width={20} height={20} />
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable onPress={handleUploadImagePress} style={productStyles.container}>
              <View style={productStyles.uploadContentContainer}>
                <UploadPrimaryIcon />
                <AppText primary>Upload Images upto 5</AppText>
              </View>
            </Pressable>
          )}
        </View>
        <View style={globalStyles.inputsGap}>
          <AppTextInput placeholder="Product Name" onChangeText={text => handleChangeText(text, 'productName')} value={formData.productName} />
          <AppTextInput placeholder="Price" onChangeText={text => handleChangeText(text, 'price')} keyboardType={'number-pad'} value={formData.price} />
          <AppTextInput placeholder="Sales Tax %" onChangeText={text => handleChangeText(text, 'salesTax')} keyboardType={'number-pad'} value={formData.salesTax} />

          <DropDownPicker
            zIndex={10}
            zIndexInverse={2}
            props={{activeOpacity: 0.5}}
            placeholder="Product Category"
            open={productCategoriesOpen}
            value={productCategoriesValue}
            items={productCategoriesItems}
            setOpen={setProductCategoriesOpen}
            setValue={setProductCategoriesValue}
            setItems={setProductCategoriesItems}
            style={productStyles.dropdownStyle}
            placeholderStyle={productStyles.dropdownPlaceholder}
            dropDownContainerStyle={productStyles.dropdownContainerStyle}
            textStyle={productStyles.dropdownText}
            dropDownDirection="BOTTOM"
          />

          <DropDownPicker
            props={{activeOpacity: 0.5}}
            zIndex={9}
            zIndexInverse={1}
            placeholder="Unit"
            open={unitTypeDropdownOpen}
            value={unitTypeValue}
            items={unitTypeItems}
            setOpen={setUnitTypeDropdownOpen}
            setValue={setUnitTypeValue}
            setItems={setUnitTypeItems}
            style={productStyles.dropdownStyle}
            placeholderStyle={productStyles.dropdownPlaceholder}
            dropDownContainerStyle={productStyles.dropdownContainerStyle}
            textStyle={productStyles.dropdownText}
            dropDownDirection="BOTTOM"
          />

          {unitTypeValue == 'weight' && <AppTextInput placeholder="Weight" keyboardType={'numeric'} onChangeText={text => handleChangeText(text, 'volume')} value={formData.volume} />}
          {unitTypeValue == 'volume' && <AppTextInput placeholder="Volume" keyboardType={'numeric'} onChangeText={text => handleChangeText(text, 'volume')} value={formData.volume} />}
          {unitTypeValue == 'quantity' && <AppTextInput placeholder="Quantity" onChangeText={text => handleChangeText(text, 'quantity')} keyboardType={'number-pad'} value={formData.quantity} />}

          <AppTextInput placeholder="Manufactured By" onChangeText={text => handleChangeText(text, 'manufacturedBy')} value={formData.manufacturedBy} />
          <View style={globalStyles.inputsGap}>
            <AppText fontFamily={FONTS.medium}>Description</AppText>
            <AppTextInput
              placeholder="write description here"
              textAlignVertical="top"
              multiline={true}
              textInputContainerStyle={{height: 100}}
              onChangeText={text => handleChangeText(text, 'description')}
              value={formData.description}
            />
          </View>
        </View>

        <AppButton title={isEditMode ? 'Update Product' : 'Add Product'} onPress={handleAddProduct} containerStyle={[globalStyles.bottomButton, {marginTop: 50}]} />
      </AppScrollView>
    </Screen>
  );
};

export default AddProduct;
