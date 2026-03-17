import {View} from 'react-native';
import React, {useState} from 'react';
import {AppButton, AppScrollView, AppText, AppTextInput, Header, Loader, Screen, StarRating, SuccessModal} from '../../../components';
import {feedbackStyles} from '../styles';
import globalStyles from '../../../../globalStyles';
import commonAPI from '../../../network/commonAPI';

const AddFeedback = ({navigation, route}) => {
  const params = route?.params;
  const riderId = params?.riderId;

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleAddReview = async () => {
    const data = {
      to: riderId, //  Rider ID
      stars: rating,
      comment: reviewText,
    };

    setIsLoading(true);
    const response = await commonAPI.addReview(data);
    setIsLoading(false);

    console.log('Res:', response);
    setSuccessModalVisible(true);

    setTimeout(() => {
      setSuccessModalVisible(false);
      navigation.popToTop();
    }, 2000);
  };

  return (
    <Screen>
      <Header title={'Add Feedback'} />
      <Loader isLoading={isLoading} />
      <AppScrollView>
        <View>
          <AppText style={feedbackStyles.yourReviewText}>{'Your Review'}</AppText>
          <StarRating
            ratingContainerStyle={feedbackStyles.ratingContainer}
            starContainerStyle={feedbackStyles.starContainer}
            isDisabled={false}
            size={30}
            defaultRating={0}
            onFinishRating={setRating}
          />
          <View style={{marginTop: 40}}>
            <AppText style={feedbackStyles.feedbackText}>{'Feedback'}</AppText>
            <AppTextInput
              textInputContainerStyle={feedbackStyles.feedbackInputContainer}
              textInputStyle={feedbackStyles.feedbackInput}
              placeholder={'Add your Feedback'}
              multiline={true}
              onChangeText={setReviewText}
              maxLength={120}
            />
            <AppText greyText style={feedbackStyles.count}>
              {reviewText.length}/120
            </AppText>
          </View>
        </View>
      </AppScrollView>

      <View style={[globalStyles.screenPadding, feedbackStyles.reviewButton]}>
        <AppButton title={'Add Review'} onPress={handleAddReview} disabled={!rating || !reviewText} />
      </View>

      <SuccessModal
        isVisible={successModalVisible}
        setIsVisible={setSuccessModalVisible}
        heading={'Review Added'}
        description={'Lorem ipsum dolor sit amet consectetur. '}
        buttonTitle={'Back To Home'}
        onPressButton={() => navigation.popToTop()}
      />
    </Screen>
  );
};

export default AddFeedback;
