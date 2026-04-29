import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { COLORS, FONTS } from '../../utils/theme';
import { LocationGrayIcon } from '../../assets/icons';
import { StyleSheet } from 'react-native';
import { GOOGLE_API_KEY } from '../../network/Environment';

const GooglePlacesInput = ({
  onSelect,
  region = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 5,
    longitudeDelta: 5,
  },
  placeholder = 'Address',
  textInputProps,
  containerStyle,
  listViewStyle,
  ...otherProps
}) => {
  return (
    <GooglePlacesAutocomplete
      minLength={2}
      debounce={300}
      renderLeftButton={() => <LocationGrayIcon style={styles.searchIcon} height={18} width={18} />}
      renderDescription={row => row.description || row.formatted_address || row.name}
      keepResultsAfterBlur={true}
      listViewDisplayed="auto"
      enablePoweredByContainer={false}
      isRowScrollable={true}
      // currentLocation={true}
      // currentLocationLabel="Current location"
      onFail={error => console.log('GooglePlacesInput onFail:', error)}
      onNotFound={() => console.log('GooglePlacesInput onNotFound')}
      onTimeout={() => console.log('GooglePlacesInput onTimeout')}
      placeholder={placeholder}
      textInputProps={{
        onChangeText: text => console.log('GooglePlacesInput typing:', text),
        style: styles.textInput,
        selectionColor: COLORS.primary,
        placeholderTextColor: COLORS.textGray,
        ...textInputProps,
      }}
      fetchDetails={true}
      timeout={15000}
      onPress={(data, details = null) => {
        console.log('GooglePlacesInput onPress:', {data, details});
        onSelect?.(data, details);
      }}
      query={{
        key: GOOGLE_API_KEY,
        location: `${region.latitude},${region.longitude}`,
        language: 'en',
        types: 'geocode',
      }}
      styles={{
        container: [styles.container, containerStyle],
        // textInput: styles.textInput,
        textInputContainer: styles.textInputContainer,
        listView: [styles.listView, listViewStyle],
        row: {},
        description: styles.listDescription,
      }}
      {...otherProps}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    elevation: 10,
  },
  listView: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    zIndex: 1001,
    backgroundColor: COLORS.white,
    overflow: 'visible',
    paddingRight: 10,
    shadowColor: COLORS.black,
    elevation: 10,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 10,
  },
  textInputContainer: { alignItems: 'center', height: 45 },
  textInput: {
    width: '100%',
    paddingLeft: 38,
    backgroundColor: COLORS.grey5,
    borderWidth: 1,
    borderColor: COLORS.grey2,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 0,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    fontSize: 12,
    height: 45,
  },
  searchIcon: { position: 'absolute', zIndex: 2, marginLeft: 10 },
  listDescription: { color: COLORS.black, fontFamily: FONTS.regular },
});

export default GooglePlacesInput;
