import {View, Pressable} from 'react-native';
import React, {useState} from 'react';
import {AppButton, AppScrollView, AppText, Header, Loader, Screen} from '../../../components';
import {EditPencilIcon, MenuDotsIcon, RemoveIcon} from '../../../assets/icons';
import {listStyles} from '../styles';
import globalStyles from '../../../../globalStyles';
import {ROUTES} from '../../../utils/constants';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';
import {useDispatch} from 'react-redux';
import {customerListActions} from '../../../redux/slices/customer/customerList';

const List = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [dotMenuShow, setDotMenuShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const params = route?.params;
  const productList = params?.productList;
  const listId = params?.listId;

  const handleDeleteList = () => {
    setDotMenuShow(false);

    const onSuccess = response => {
      if (response.success) {
        dispatch(customerListActions.removeList(listId));
        navigation.goBack();
      }
    };

    callApi(API_METHODS.DELETE, `${API.list}/${listId}`, null, onSuccess, onAPIError, setIsLoading);
  };

  return (
    <Screen>
      <Loader isLoading={isLoading} />

      <View style={{zIndex: 1}}>
        <Header LeftIcon={() => null} RightIcon={MenuDotsIcon} onPressRightIcon={() => setDotMenuShow(p => !p)} />
        {dotMenuShow && (
          <View style={listStyles.dotMenuListContainer}>
            <Pressable
              onPress={() => {
                setDotMenuShow(false);
                navigation.navigate(ROUTES.AddList, {isEditMode: true, listId});
              }}
              style={[listStyles.dropdownItemContainer, listStyles.listPaddingAndBorder]}>
              <EditPencilIcon width={15} height={15} />
              <AppText>Edit</AppText>
            </Pressable>
            <Pressable onPress={handleDeleteList} style={[listStyles.dropdownItemContainer, listStyles.listPaddingAndBorder]}>
              <RemoveIcon width={15} height={15} />
              <AppText>Delete</AppText>
            </Pressable>
          </View>
        )}
      </View>

      <AppScrollView contentContainerStyle={{zIndex: -1}}>
        <View style={globalStyles.flex1}>
          <View style={[listStyles.allLists]}>
            {productList.map((item, index) => (
              <View key={index} style={listStyles.listItem}>
                <View style={listStyles.listItemLeftContent}>
                  <AppText>{index + 1}</AppText>
                  <AppText greyText fontSize={12}>
                    {item?.productName}
                  </AppText>
                </View>
                <AppText fontSize={12} greyText>
                  {item.quantity}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        <AppButton title={'Select Rider'} containerStyle={globalStyles.bottomButton} onPress={() => navigation.navigate(ROUTES.Riders, {listId})} />
      </AppScrollView>
    </Screen>
  );
};

export default List;
