import React from 'react';
import {ImageBackground} from 'react-native';
import {ColorFruitsImage} from '../../../../assets/images';
import {splashStyles} from '../../styles';
import {hp, wp} from '../../../../helpers';

const FruitsColorBackgroundWrapper = ({children, style}) => {
  return (
    <ImageBackground resizeMode="cover" source={ColorFruitsImage} style={splashStyles.backgroundImage}>
      {children}
    </ImageBackground>
  );
};

export default FruitsColorBackgroundWrapper;
