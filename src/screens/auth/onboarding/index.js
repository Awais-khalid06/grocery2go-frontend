import React, {useRef, useState} from 'react';
import FruitsBackgroundWrapper from '../common/fruitsBackgroundWrapper';
import {AppButton, AppText, PaginateDots} from '../../../components';
import {FlatList, View} from 'react-native';
import {ONBOARDINGS} from '../../../static';
import {onboardingStyles} from '../styles';
import {wp} from '../../../helpers';
import {COLORS} from '../../../utils/theme';
import globalStyles from '../../../../globalStyles';
import {ROUTES} from '../../../utils/constants';

const Onboarding = ({navigation}) => {
  const flatListRef = useRef(null);
  const [activeBoardIndex, setActiveBoardIndex] = useState(0);

  const handleNext = () => {
    let go = activeBoardIndex + 1;
    if (ONBOARDINGS.length > go) {
      flatListRef.current.scrollToIndex({animated: true, index: go});
      setActiveBoardIndex(go);
    } else {
      navigation.navigate(ROUTES.AccountType);
    }
  };

  const handleSkip = () => {
    navigation.navigate(ROUTES.welcome);
  };

  const handleMomentumScrollEnd = event => {
    const index = Math.floor(Math.floor(event.nativeEvent.contentOffset.x) / Math.floor(event.nativeEvent.layoutMeasurement.width));
    setActiveBoardIndex(index);
  };

  return (
    <FruitsBackgroundWrapper>
      <View style={onboardingStyles.contentContainer}>
        <View>
          <FlatList
            contentContainerStyle={onboardingStyles.flatList}
            data={ONBOARDINGS}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => <OnBoard item={item} />}
            horizontal
            pagingEnabled
            onMomentumScrollEnd={handleMomentumScrollEnd}
            ref={flatListRef}
          />
        </View>
        <View style={[globalStyles.screenPadding, onboardingStyles.paginateAndButton]}>
          <PaginateDots activeIndex={activeBoardIndex} color1={COLORS.primary} color2={'#3F4850'} />
          <AppButton title={'Next'} onPress={handleNext} />
        </View>
      </View>
    </FruitsBackgroundWrapper>
  );
};

const OnBoard = ({item}) => {
  const Icon = item.icon;
  return (
    <View style={onboardingStyles.onBoardContainer}>
      <Icon width={wp(90)} height={wp(90)} />
      <View style={onboardingStyles.textContainer}>
        <AppText style={onboardingStyles.headText}>{item.title}</AppText>
        <AppText style={onboardingStyles.headDescription}>{item.description}</AppText>
      </View>
    </View>
  );
};

export default Onboarding;
