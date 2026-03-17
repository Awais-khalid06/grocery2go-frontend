import {View, Text, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ChatHeadCard, FlatListEmptyComponent, Header, Loader, Screen} from '../../../components';
import useSocket from '../../../hooks/useSocket';
import {useIsFocused} from '@react-navigation/native';
import {userSelector} from '../../../redux/selectors';
import {useSelector} from 'react-redux';
import globalStyles from '../../../../globalStyles';
import {getUserFullName} from '../../../helpers';
import dayjs from 'dayjs';
import {ROUTES} from '../../../utils/constants';

const ChatInbox = ({navigation}) => {
  const socket = useSocket();
  const isScreenFocused = useIsFocused();
  const user = useSelector(userSelector) || {};
  const [heads, setHeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (isScreenFocused) {
      socket.emit('get-inboxes', {userId: user._id}, error => console.log(error));

      socket.on('inboxes', response => {
        setIsLoading(false);
        // console.log('RES >>>> ', response);
        setHeads(response.inboxes);
      });

      socket.emit('get-online-users', {userId: user._id}, error => console.log(error));

      socket.on('online-users', response => {
        if (response.success) {
          setActiveUsers(response?.data?.users);
        }
      });
    }

    return () => {
      socket.removeAllListeners(['inboxes', 'online-users']);
    };
  }, [isScreenFocused]);

  const handlePressHead = head => {
    const inboxId = head?.users.find(u => u?._id !== user?._id);
    navigation.navigate(ROUTES.ChatRoom, {inboxId});
  };

  return (
    <Screen>
      <Header title={'Chat'} />
      <Loader isLoading={isLoading} />

      <FlatList
        data={heads}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={[globalStyles.flexGrow1, globalStyles.screenPadding, globalStyles.inputsGap, globalStyles.screenPaddingBottom10]}
        ItemSeparatorComponent={() => <View style={{marginVertical: 10}} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<FlatListEmptyComponent label={isLoading ? '' : 'No Chat'} />}
        renderItem={({item, index}) => {
          const receiverUser = item?.users.find(u => u?._id !== user?._id);
          let username = getUserFullName(receiverUser?.firstName, receiverUser?.lastName);
          let lastMessage = item.LastMessage;

          if (item.type === 'photo') {
            lastMessage = 'Image';
          } else if (item.type === 'audio') {
            lastMessage = 'Audio';
          }

          return (
            <ChatHeadCard
              rightContentContainerStyle={{flexDirection: 'column'}}
              isActive={activeUsers.find(u => u._id === receiverUser?._id)}
              timestamp={dayjs(item.updatedAt).format('hh:mm a')}
              profilePic={{uri: receiverUser?.image}}
              name={username}
              lastMessage={lastMessage}
              count={item.newMessages}
              onPress={() => handlePressHead(item)}
            />
          );
        }}
      />
    </Screen>
  );
};

export default ChatInbox;
