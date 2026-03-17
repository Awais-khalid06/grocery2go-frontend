import {View, Text} from 'react-native';
import React from 'react';
import {AppButton, Header, Screen} from '../../../components';
import GoogleMap from '../../../components/googleMap';
import {Marker} from 'react-native-maps';
import {locationStyles} from '../styles';
import globalStyles from '../../../../globalStyles';

const OrderTrack = ({navigation}) => {
  return (
    <Screen>
      <Header title={'Order Track'} />
      <View style={[globalStyles.flex1, {zIndex: -1}]}>
        <GoogleMap>
          <Marker
            draggable={true}
            tracksViewChanges={false}
            coordinate={{
              latitude: 48.85552283403529,
              longitude: 2.37035159021616,
              latitudeDelta: 5,
              longitudeDelta: 5,
            }}></Marker>
        </GoogleMap>
      </View>
      <AppButton title={'Back'} containerStyle={locationStyles.doneBtn} onPress={() => navigation.goBack()} />
    </Screen>
  );
};

export default OrderTrack;
