import React from 'react';
import {View, Text, Image, TouchableOpacity, Pressable} from 'react-native';
import {inboxStyles} from '../styles';
import dayjs from 'dayjs';
import {AppText} from '../../../components';

function formatTime(seconds) {
  // Calculate minutes and remaining seconds
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;

  // Format the result with leading zeros
  var formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds.toFixed(0)}`;

  return formattedTime;
}

const Message = ({item, isIam, isAlertShow, onPressMessage}) => {
  const MessageWrapper = isIam ? TouchableOpacity : View;

  const message = item?.message;
  const messageType = item.type;
  const timestamp = `${dayjs(item?.createdAt).format('hh:mm a')}`;
  const post = item.type === 'post' ? item?.post : null;

  if (messageType === 'text') {
    return isIam ? (
      <View style={inboxStyles.myMessageMainContainer}>
        <AppText isGreyText style={inboxStyles.messageTime}>
          {timestamp}
        </AppText>
        <View style={inboxStyles.myMessageContainer}>
          <AppText style={inboxStyles.myMessageText}>{message}</AppText>
        </View>
      </View>
    ) : (
      <View style={inboxStyles.otherMessageMainContainer}>
        <View style={inboxStyles.otherMessageContainer}>
          <AppText style={inboxStyles.otherMessageText}>{message}</AppText>
        </View>
        <AppText isGreyText style={inboxStyles.messageTime}>
          {timestamp}
        </AppText>
      </View>
    );
  } else if (messageType === 'photo') {
    return isIam ? (
      <View style={inboxStyles.myMessageMainContainer}>
        <AppText isGreyText style={inboxStyles.messageTime}>
          {timestamp}
        </AppText>
        <Pressable onPress={() => onPressMessage(message, messageType)}>
          <Image source={{uri: message}} style={inboxStyles.messageImage} />
        </Pressable>
      </View>
    ) : (
      <View style={inboxStyles.otherMessageMainContainer}>
        <Pressable onPress={() => onPressMessage(message, messageType)}>
          <Image source={{uri: message}} style={inboxStyles.messageImage} />
        </Pressable>
        <AppText isGreyText style={inboxStyles.messageTime}>
          {timestamp}
        </AppText>
      </View>
    );
  } else if (messageType === 'alert' && isAlertShow) {
    return (
      <View style={{alignSelf: 'center'}}>
        <Text style={[inboxStyles.alertMsg, {fontSize: 12}]}>{message}</Text>
      </View>
    );
  } else {
    return null;
  }
};

export default Message;
