import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import {isIOS, wp} from '../../helpers';
import {COLORS, FONTS} from '../../utils/theme';

const ChatHeadCard = ({
  onPress,
  nameStyle,
  name,
  lastMessage,
  count = 1,
  timestamp,
  rightContentContainerStyle,
  isActiveShow = true,
  isActive,
  subtitleStyle,
  renderRightComponent,
  isDisablePress,
  containerStyles,
  profilePic,
}) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={isDisablePress} style={containerStyles}>
      <View style={styles.picAndProfileContainer}>
        <View>
          <Image source={profilePic} style={styles.profilePic} />
          {isActiveShow && <View style={[styles.activeDot, {backgroundColor: isActive ? COLORS.green : COLORS.grey5}]} />}
        </View>

        <View style={styles.nameAndLastMsgContainer}>
          <Text style={[styles.username, nameStyle]}>{name}</Text>
          {lastMessage && <Text style={[styles.lastMessage, subtitleStyle]}>{lastMessage}</Text>}
        </View>

        {renderRightComponent ? (
          renderRightComponent()
        ) : (
          <View style={[styles.countAndTimestamp, rightContentContainerStyle]}>
            <View style={[styles.countContainer, {backgroundColor: count > 0 ? COLORS.primary : null}]}>{count > 0 && <Text style={styles.count}>{count}</Text>}</View>

            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: COLORS.grey3,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  picAndProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  username: {
    fontFamily: FONTS.medium,
    color: COLORS.black,
    maxWidth: wp(60),
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  lastMessage: {
    fontFamily: FONTS.regular,
    color: COLORS.black,
    fontSize: 12,
    width: wp(55),
  },

  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 100,
    position: 'absolute',
    top: 2,
    right: 2,
  },

  nameAndLastMsgContainer: {
    flexGrow: 1,
    width: '50%',
  },

  countAndTimestamp: {
    alignItems: 'flex-end',
  },

  countContainer: {
    width: 18,
    height: 18,
    borderRadius: 100,
    paddingTop: isIOS ? 2 : 3,
  },

  count: {
    fontSize: 11,
    color: COLORS.white,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: FONTS.regular,
  },

  timestamp: {
    fontFamily: FONTS.regular,
    color: COLORS.black,
    fontSize: 12,
  },
});

export default ChatHeadCard;
