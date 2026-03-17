import React from 'react';
import {ImageBackground} from 'react-native';
import {FruitsImage} from '../../../../assets/images';
import {splashStyles} from '../../styles';
import {hp, wp} from '../../../../helpers';

const FruitsBackgroundWrapper = ({children, style}) => {
  return (
    <ImageBackground source={FruitsImage} style={[splashStyles.backgroundImage, style]} height={hp(100)} width={wp(100)}>
      {children}
    </ImageBackground>
  );
};

export default FruitsBackgroundWrapper;
