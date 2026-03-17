import React from 'react';
import {AirbnbRating} from 'react-native-ratings';
import {StarFilledImage} from '../../assets/images';

const StarRating = ({ratingContainerStyle, starContainerStyle, isDisabled = true, defaultRating = 3, size = 20, starImage = StarFilledImage, onFinishRating = () => {}}) => {
  return (
    <AirbnbRating
      starImage={starImage}
      unSelectedColor={'rgba(171, 183, 183,1)'}
      selectedColor={'rgba(255, 122, 40, 1)'}
      showRating={false}
      ratingCount={5}
      size={size}
      reviewSize={0}
      defaultRating={defaultRating}
      onFinishRating={onFinishRating}
      isDisabled={isDisabled}
      ratingContainerStyle={ratingContainerStyle}
      starContainerStyle={starContainerStyle}
    />
  );
};

export default StarRating;
