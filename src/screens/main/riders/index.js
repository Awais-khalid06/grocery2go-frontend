import {View, Text, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FlatListEmptyComponent, Header, Loader, Screen, UserCard} from '../../../components';
import {RIDERS} from '../../../static';
import globalStyles from '../../../../globalStyles';
import {ROUTES} from '../../../utils/constants';
import commonAPI from '../../../network/commonAPI';
import {useSelector} from 'react-redux';
import {userSelector} from '../../../redux/selectors';

const Riders = ({navigation, route}) => {
  const params = route.params;
  const user = useSelector(userSelector);
  const [riders, setRiders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const myLocation = user?.location;
  const listId = params?.listId;
  const paramLocation = params?.location;

  useEffect(() => {
    getRidersList();
  }, []);

  const getRidersList = async () => {
    setIsLoading(true);
    const response = await commonAPI.getAllRiders();
    setIsLoading(false);

    // console.log('AA:', JSON.stringify(response));

    if (response.success) {
      setRiders(response.data);
    }
  };

  const handleRequestRider = item => {
    let endLocation;
    if (paramLocation) endLocation = paramLocation;
    else endLocation = user?.location;

    const riderId = item.rider._id;

    const data = {endLocation, riderId, listId};
    commonAPI.requestRider(data);
  };

  const handlePressRiderCard = item => {
    const riderId = item?.rider?._id;
    navigation.navigate(ROUTES.RiderDetails, {riderId, listId});
  };

  return (
    <Screen>
      <Header title={'Select Rider'} />
      <Loader isLoading={isLoading} />

      <FlatList
        data={riders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => <UserCard onPressRequest={handleRequestRider} item={item} onPress={handlePressRiderCard} type="Rider" currentUserLocation={myLocation} />}
        contentContainerStyle={[globalStyles.screenPadding, globalStyles.flexGrow1, globalStyles.inputsGap]}
        ListEmptyComponent={<FlatListEmptyComponent label={'No rider'} />}
      />
    </Screen>
  );
};

export default Riders;
