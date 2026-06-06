import React from 'react';
import {ImageBackground} from 'react-native';
import {ColorFruitsImage} from '../../../../assets/images';
import {splashStyles} from '../../styles';

const FruitsColorBackgroundWrapper = ({children, style}) => {
  return (
    <ImageBackground resizeMode="cover" source={ColorFruitsImage} style={[splashStyles.backgroundImage, style]}>
      {children}
    </ImageBackground>
  );
};

export default FruitsColorBackgroundWrapper;
