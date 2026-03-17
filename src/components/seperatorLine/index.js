import {View, StyleSheet} from 'react-native';
import React from 'react';

const SeperatorLine = ({style}) => {
  return <View style={[styles.container, style]} />;
};

const styles = StyleSheet.create({
  container: {
    height: 1.2,
    backgroundColor: 'rgba(226, 226, 226, 1)',
    width: '100%',
  },
});

export default SeperatorLine;
