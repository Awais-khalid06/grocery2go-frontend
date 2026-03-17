import {View, Image, Pressable, KeyboardAvoidingView, FlatList} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {AppText, AppTextInput, FlatListEmptyComponent, Header, Loader, Screen, SeperatorLine} from '../../../components';
import {chatRoomStyles, chatStyles} from '../styles';
import {ArrowIcon, SendGreenIcon} from '../../../assets/icons';
import {COLORS} from '../../../utils/theme';
import globalStyles from '../../../../globalStyles';
import {useSelector} from 'react-redux';
import {userSelector} from '../../../redux/selectors';
import useSocket from '../../../hooks/useSocket';
import {getUserFullName, isIOS} from '../../../helpers';
import Message from './message';
import {SafeAreaView} from 'react-native-safe-area-context';

const ChatRoom = ({navigation, route}) => {
  const params = route?.params;
  const user = useSelector(userSelector) || {};
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [receiverUser, setReceiverUser] = useState(null);
  const [message, setMessage] = useState({type: '', msg: ''});

  const socket = useSocket();

  const sendMessageEvent = 'send-message';
  const roomJoinEvent = 'join-room';
  const leaveRoomEvent = 'leave-room';
  const messagesListener = 'messages';
  const myId = user?._id;
  const inboxId = params?.inboxId;

  console.log('MyID:', myId);
  console.log('InboxID:', inboxId);
  // console.log('RECEIVER USER:', receiverUser);

  useEffect(() => {
    socket.emit(roomJoinEvent, {userId: myId, inbox: inboxId}, error => console.log(error));

    socket.on(messagesListener, response => {
      // console.log('MESSAGES: ', response);
      setIsLoading(false);

      setMessages(prev => [...response.messages, ...prev]);

      if (!receiverUser && response?.receiver?._id !== myId) {
        setReceiverUser(response.receiver);
      }
    });

    return () => {
      socket.removeAllListeners(messagesListener);
      socket.emit(leaveRoomEvent, {user: myId, inbox: inboxId}, error => console.log(error));
    };
  }, []);

  const handleOnChangeMessageText = text => {
    setMessage({type: 'text', msg: text});
  };

  const handleSendMesssage = async () => {
    const formatedMsg = message.msg.trim();
    messageEmitter('text', formatedMsg);
    setMessage({type: '', msg: ''});
  };

  const messageEmitter = (messageType, messageText) => {
    const data = {
      userId: myId,
      to: inboxId,
      message: messageText,
      messageType,
    };

    console.log('Send Message Emitter Called', data);
    socket.emit(sendMessageEvent, data, error => console.log(error));
  };

  const getIsIam = useCallback(
    item => {
      return item?.sender._id == myId;
    },
    [myId],
  );

  const renderUserPicAndName = () => {
    const receiverImage = receiverUser?.image;
    const receiverName = getUserFullName(receiverUser?.firstName, receiverUser?.lastName);

    return (
      <View style={chatStyles.userContainer}>
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowIcon />
        </Pressable>
        {receiverImage && <Image source={{uri: receiverImage}} style={chatStyles.image} />}

        <View style={chatStyles.gap3}>
          <AppText style={chatStyles.username}>{receiverName}</AppText>
        </View>
      </View>
    );
  };

  const Wrapper = isIOS ? SafeAreaView : Screen;
  const inputValue = message?.type == 'text' ? message.msg : '';

  return (
    <Wrapper style={[globalStyles.flex1]}>
      <Header LeftIcon={renderUserPicAndName} onPressLeftIcon={() => {}} />
      <Loader isLoading={isLoading} />

      <KeyboardAvoidingView behavior={isIOS ? 'padding' : ''} style={chatRoomStyles.wrapper}>
        <FlatList
          data={messages}
          inverted={messages?.length > 0}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={chatRoomStyles.seperator} />}
          style={chatRoomStyles.flatList}
          contentContainerStyle={chatRoomStyles.flatListContentContainer}
          ListEmptyComponent={() => <FlatListEmptyComponent label={isLoading ? '' : 'Write your first message'} />}
          renderItem={({item, index}) => <Message item={item} isIam={getIsIam(item)} isAlertShow={false} />}
          showsVerticalScrollIndicator={false}
        />

        <View style={chatStyles.inputContainer}>
          <View style={chatStyles.input}>
            <AppTextInput
              placeholder={'Type a message'}
              textInputStyle={chatStyles.textInput}
              onChangeText={handleOnChangeMessageText}
              textInputContainerStyle={{backgroundColor: COLORS.white, borderWidth: 0}}
              value={inputValue}
            />
          </View>

          <SendButton onPress={handleSendMesssage} disabled={!inputValue} />
        </View>
        <SafeAreaView edges={[]} />
      </KeyboardAvoidingView>
    </Wrapper>
  );
};

const SendButton = ({onPress, disabled}) => {
  return (
    <Pressable style={[chatStyles.sendButton, {opacity: disabled ? 0.6 : 1}]} onPress={onPress} disabled={disabled}>
      <SendGreenIcon width={20} height={20} />
    </Pressable>
  );
};

export default ChatRoom;
