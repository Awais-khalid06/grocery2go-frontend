import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { COLORS, FONTS } from '../../utils/theme';
import { LocationGrayIcon } from '../../assets/icons';
import { StyleSheet } from 'react-native';
import { GOOGLE_API_KEY } from '../../network/Environment';

const GooglePlacesInput = ({
  onSelect,
  region = {
    latitude: 48.85552283403529,
    longitude: 2.37035159021616,
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
      nearbyPlacesAPI="GooglePlacesSearch"
      renderLeftButton={() => <LocationGrayIcon style={styles.searchIcon} height={18} width={18} />}
      renderDescription={row => row.description || row.formatted_address || row.name}
      keepResultsAfterBlur={false}
      listViewDisplayed={false}
      enablePoweredByContainer={false}
      isRowScrollable={true}
      // currentLocation={true}
      // currentLocationLabel="Current location"
      onFail={error => console.error(error)}
      placeholder={placeholder}
      textInputProps={{
        style: styles.textInput,
        selectionColor: COLORS.primary,
        placeholderTextColor: COLORS.textGray,
        ...textInputProps,
      }}
      fetchDetails={true}
      GooglePlacesSearchQuery={{
        rankby: 'distance',
      }}
      onPress={(data, details = null) => onSelect?.(data, details)}
      query={{
        key: GOOGLE_API_KEY,
        location: `${region.latitude}, ${region.longitude}`,
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
  container: { zIndex: 1 },
  listView: {
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    paddingRight: 10,
    shadowColor: COLORS.black,
    elevation: 1,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
