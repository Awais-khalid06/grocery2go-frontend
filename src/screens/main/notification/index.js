import {FlatList, Pressable, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppText, FlatListEmptyComponent, Header, Loader, Screen} from '../../../components';
import {mainCommonStyles, notificationStyles} from '../styles';
import {BlueCircleIcon, GreenCircleIcon, RedCircleIcon} from '../../../assets/icons';
import globalStyles from '../../../../globalStyles';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';

const DATA = [
  {
    image: BlueCircleIcon,
    title: 'Grocery item added',
    subtitle: 'Lorem ipsum dolor sit amet, consectet adipiscing elit, sed do eiusmod tempor.',
    count: 2,
    isActive: true,
    timestamp: '11:00 AM',
  },
  {
    image: RedCircleIcon,
    title: 'item out of stock',
    subtitle: 'Lorem ipsum dolor sit amet, consectet adipiscing elit, sed do eiusmod tempor.',
    count: 5,
    isActive: false,
    timestamp: '01:00 AM',
  },

  {image: GreenCircleIcon, title: 'New Order #1234567', subtitle: 'Lorem ipsum dolor sit amet, consectet adipiscing elit, sed do eiusmod tempor.', count: 2, isActive: false, timestamp: '11:00 AM'},
  {image: GreenCircleIcon, title: 'New Order #1234567', subtitle: 'Lorem ipsum dolor sit amet, consectet adipiscing elit, sed do eiusmod tempor.', count: 2, isActive: false, timestamp: '11:00 AM'},
];

const NOTIFICATIONS = [
  {
    title: 'Today, March 20 2023',
    data: DATA,
  },
  {
    title: 'Yesterday, March 19 2023',
    data: DATA,
  },
];

const Notification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = () => {
    const onSuccess = response => {
      setNotifications(response?.data?.pageData);
      // console.log('RES:', JSON.stringify(response));
    };
    callApi(API_METHODS.GET, API.notifications, null, onSuccess, onAPIError, setIsLoading);
  };

  return (
    <Screen>
      <Header title="Notification" />
      <Loader isLoading={isLoading} />

      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={mainCommonStyles.itemSeperator} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<FlatListEmptyComponent label={isLoading ? '' : 'No Notification'} />}
        contentContainerStyle={[mainCommonStyles.flexGrow1, globalStyles.screenPadding]}
        // SectionSeparatorComponent={() => <View style={mainCommonStyles.itemSeperator} />}
        renderItem={({item}) => <DetailCard item={item} />}
        // renderSectionHeader={({section: {title}}) => <AppText style={{marginTop: title == 'Yesterday, March 19 2023' ? 30 : 0, fontFamily: FONTS.medium}}>{title}</AppText>}
        style={notificationStyles.listContainer}
      />
    </Screen>
  );
};

const DetailCard = ({item}) => {
  return (
    <Pressable style={notificationStyles.container}>
      <BlueCircleIcon width={60} height={60} />

      <View style={notificationStyles.centeredContainer}>
        <AppText style={notificationStyles.title}>{item?.title}</AppText>
        <AppText style={[mainCommonStyles.paragraphText, notificationStyles.subtitle]}>{item?.data}</AppText>
      </View>

      <View style={notificationStyles.rightContainer}></View>
    </Pressable>
  );
};

export default Notification;
