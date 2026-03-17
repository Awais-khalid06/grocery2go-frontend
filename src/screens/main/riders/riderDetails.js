import {View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AddressVerificationModal, AppButton, AppScrollView, AppText, Header, Loader, Screen, SeperatorLine, StarRating, UserCard} from '../../../components';
import {ChatIcon} from '../../../assets/icons';
import {riderStyles} from '../styles';
import {FONTS} from '../../../utils/theme';
import globalStyles from '../../../../globalStyles';
import {ROUTES} from '../../../utils/constants';
import commonAPI from '../../../network/commonAPI';
import {getUserFullName} from '../../../helpers';
import {useSelector} from 'react-redux';
import {userSelector} from '../../../redux/selectors';

const RiderDetails = ({navigation, route}) => {
  const user = useSelector(userSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressVerificationModalShow, setIsAddressVerificationModalShow] = useState(false);
  const [data, setData] = useState({});
  const params = route.params;
  const riderId = params?.riderId;
  const listId = params?.listId;
  const paramLocation = params?.location;

  const rider = data?.rider;
  const riderName = getUserFullName(rider?.firstName, rider?.lastName);
  const ratings = data?.ratings || [];
  const totalRatings = ratings?.length;
  const averageRatings = data?.averageRating;

  useEffect(() => {
    getRiderDetail();
  }, [riderId]);

  const getRiderDetail = async () => {
    setIsLoading(true);
    const response = await commonAPI.getRiderDetail(riderId);
    // console.log('RES: ', JSON.stringify(response));
    setIsLoading(false);

    if (response.success) {
      setData(response.data);
    }
  };

  const handleRequest = () => {
    setIsAddressVerificationModalShow(true);
  };

  const requestRider = () => {
    let endLocation;
    if (paramLocation) endLocation = paramLocation;
    else endLocation = user?.location;

    const data = {
      endLocation,
      riderId: rider._id,
      listId,
    };

    commonAPI.requestRider(data);
  };

  const handlePressChatIcon = () => {
    const riderId = rider?._id;
    if (!riderId) return;

    navigation.navigate(ROUTES.ChatRoom, {inboxId: riderId});
  };

  if (isLoading) {
    return (
      <Screen>
        <Header title={'Rider Detail'} RightIcon={<ChatIcon width={27} height={27} />} />
        <Loader isLoading={isLoading} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title={'Rider Detail'} RightIcon={<ChatIcon width={27} height={27} />} onPressRightIcon={handlePressChatIcon} />

      <AppScrollView contentContainerStyle={{paddingBottom: 100}}>
        <View style={riderStyles.userProfileContainer}>
          {rider?.image && <Image source={{uri: rider?.image}} style={riderStyles.userImage} />}
          <View style={riderStyles.centerItems}>
            <AppText fontFamily={FONTS.medium}> {riderName}</AppText>
            {/* <AppText fontSize={12} greyText></AppText> */}
          </View>
        </View>

        {/* <View style={riderStyles.informationContainer}>
          <AppText fontFamily={FONTS.medium} fontSize={16}>
            Rider Information
          </AppText>
          <View style={riderStyles.specialNoteContainer}>
            <AppText>Special Note</AppText>
            <AppText fontSize={12} greyText>
              Lorem ipsum dolor sit amet consectetur. Tincidunt lectus nibh eu sagittis tempus sit parturient vulputate. Etiam sagittis ut nunc sagittis diam vel tortor penatibus a.
            </AppText>
          </View>
        </View> */}

        <View style={riderStyles.informationContainer}>
          <AppText fontFamily={FONTS.medium} fontSize={16}>
            Reviews
          </AppText>

          {ratings.length > 0 ? (
            <View style={riderStyles.reviewCard}>
              <View style={riderStyles.ratingsAndReviewContainer}>
                <StarRating defaultRating={averageRatings} size={12} />
                <AppText fontSize={12} greyText>
                  {totalRatings} Reviews
                </AppText>
              </View>
              <SeperatorLine style={riderStyles.seperatorLine} />
              {ratings.map((item, index) => (
                <UserCard type="Review" key={index} item={item} />
              ))}
            </View>
          ) : (
            <View style={riderStyles.noReviewTextContainer}>
              <AppText style={riderStyles.noReviewText}>No Review Yet</AppText>
            </View>
          )}
        </View>
      </AppScrollView>

      <View style={[globalStyles.screenPadding, riderStyles.requestButton]}>
        <AppButton title={'Request'} onPress={handleRequest} />
      </View>

      <AddressVerificationModal
        isVisible={isAddressVerificationModalShow}
        setIsVisible={setIsAddressVerificationModalShow}
        onPressChange={() => {
          setIsAddressVerificationModalShow(false);
          navigation.navigate(ROUTES.EditAddress, {prevScreen: 'RIDER_DETAIL'});
        }}
        onPressContinue={() => {
          requestRider();
          setIsAddressVerificationModalShow(false);
        }}
      />
    </Screen>
  );
};

export default RiderDetails;
