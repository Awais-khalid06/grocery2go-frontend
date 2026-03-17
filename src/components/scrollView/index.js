import React from 'react';
import globalStyles from '../../../globalStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const AppScrollView = ({children, style, contentContainerStyle, ...otherProps}) => {
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps={'always'}
      style={style}
      nestedScrollEnabled
      contentContainerStyle={[globalStyles.scrollView, globalStyles.screenPadding, globalStyles.screenPaddingBottom10, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      {...otherProps}>
      {children}
    </KeyboardAwareScrollView>
  );
};

export default AppScrollView;
