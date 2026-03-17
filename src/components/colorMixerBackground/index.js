import {ImageBackground} from 'react-native';
import React from 'react';
import {ColoredMaskImage} from '../../assets/images';
import {splashStyles} from '../../screens/auth/styles';

const ColorMixerBackground = ({children}) => {
  return (
    <ImageBackground resizeMode="cover" source={ColoredMaskImage} style={splashStyles.backgroundImage}>
      {children}
    </ImageBackground>
  );
};

export default ColorMixerBackground;
