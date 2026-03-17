import React from 'react';
import MapView, {PROVIDER_GOOGLE, PROVIDER_DEFAULT} from 'react-native-maps';
import {hp, isIOS} from '../../helpers';
import {StyleSheet} from 'react-native';

const GoogleMap = ({
  region = {
    latitude: 48.85552283403529,
    longitude: 2.37035159021616,
    latitudeDelta: 5,
    longitudeDelta: 5,
  },
  ...otherProps
}) => {
  return (
    <MapView
      zoomControlEnabled={false}
      zoomEnabled={true}
      zoomTapEnabled={true}
      style={styles.map}
      userLocationPriority="high"
      provider={isIOS ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
      initialRegion={region}
      region={region}
      {...otherProps}
    />
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default GoogleMap;
