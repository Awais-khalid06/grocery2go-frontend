import {View, FlatList, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppText, Loader, Screen} from '../../../components';
import {NoListIcon, PlusIcon} from '../../../assets/icons';
import {onAPIError, wp} from '../../../helpers';
import globalStyles from '../../../../globalStyles';
import {listStyles} from '../styles';
import {ROUTES} from '../../../utils/constants';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {FONTS} from '../../../utils/theme';
import {customerListActions} from '../../../redux/slices/customer/customerList';
import {useDispatch, useSelector} from 'react-redux';
import {customerListsSelector} from '../../../redux/selectors';

const Lists = ({navigation}) => {
  const dispatch = useDispatch();
  const lists = useSelector(customerListsSelector);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getLists();
  }, []);

  const getLists = () => {
    const onSuccess = response => {
      if (response.success) {
        dispatch(customerListActions.setMyLists(response.data));
      }
    };

    callApi(API_METHODS.GET, API.getUserLists, null, onSuccess, onAPIError, setIsLoading);
  };

  const handlePressList = item => {
    navigation.navigate(ROUTES.List, {productList: item.items, listId: item._id});
  };

  const renderListEmptyComponent = () => {
    return (
      <View style={listStyles.emptyComponent}>
        <NoListIcon width={wp(40)} height={wp(40)} />
      </View>
    );
  };

  return (
    <Screen>
      <Loader isLoading={isLoading} />

      <FlatList
        data={lists}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={getLists}
        refreshing={false}
        renderItem={({item, index}) => <List onPress={handlePressList} item={item} />}
        ListEmptyComponent={renderListEmptyComponent}
        contentContainerStyle={[globalStyles.flexGrow1, globalStyles.screenPadding, globalStyles.inputsGap]}
      />

      <Pressable style={listStyles.addContainer} onPress={() => navigation.navigate(ROUTES.AddList)}>
        <PlusIcon />
      </Pressable>
    </Screen>
  );
};

const List = ({item, onPress}) => {
  return (
    <Pressable onPress={() => onPress(item)} style={listStyles.oneListContainer}>
      <AppText fontFamily={FONTS.medium}>{item.listTitle}</AppText>
      <AppText greyText fontSize={12}>
        {item.items.length} product(s) in list
      </AppText>
    </Pressable>
  );
};

export default Lists;
