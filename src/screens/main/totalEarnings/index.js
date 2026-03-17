import {FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {EarningCard, FlatListEmptyComponent, Header, Loader, Screen} from '../../../components';
import globalStyles from '../../../../globalStyles';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {useSelector} from 'react-redux';
import {userSelector} from '../../../redux/selectors';
import {onAPIError} from '../../../helpers';
import {useAccountType} from '../../../hooks';

const TotalEarnings = () => {
  const {isDriver} = useAccountType();
  const user = useSelector(userSelector);
  const [earnings, setEarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTotalEarnings();
  }, []);

  const getTotalEarnings = () => {
    const shopId = user?.shopId;
    const userId = user?._id;
    const apiEndpoint = isDriver ? `${API.getRiderEarningHistory}/${userId}` : `${API.getShopEarningHistory}/${shopId}`;

    const onSuccess = response => {
      console.log('RES: ', JSON.stringify(response));
      setEarnings(isDriver ? response?.data : response.data?.earnings);
    };

    callApi(API_METHODS.GET, apiEndpoint, null, onSuccess, onAPIError, setIsLoading);
  };

  return (
    <Screen>
      <Header title={'Total Earnings'} />
      <Loader isLoading={isLoading} />
      <FlatList
        data={earnings}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => <EarningCard item={item} />}
        ListEmptyComponent={<FlatListEmptyComponent label={isLoading ? '' : 'No Earning'} />}
        contentContainerStyle={[globalStyles.flexGrow1, globalStyles.screenPadding, globalStyles.inputsGap, globalStyles.screenPaddingBottom10]}
      />
    </Screen>
  );
};

export default TotalEarnings;
