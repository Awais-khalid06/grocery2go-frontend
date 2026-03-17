import {View, ImageBackground, Pressable, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppButton, AppScrollView, AppText, AppTextInput, Header, Loader, Screen} from '../../../components';
import {FruitPrimaryImage} from '../../../assets/images';
import {helpCenterStyles} from '../styles';
import {ChatWhiteIcon, ChevronIcon, SearchIcon} from '../../../assets/icons';
import globalStyles from '../../../../globalStyles';
import {COLORS, FONTS} from '../../../utils/theme';
import {ROUTES} from '../../../utils/constants';
import {API_METHODS, callApi} from '../../../network/NetworkManger';
import {API} from '../../../network/Environment';
import {onAPIError} from '../../../helpers';

const HelpCenter = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [selectedTab, setSelectedTab] = useState('All');
  const [selectedFaqIndex, setSelectedFaqIndex] = useState(null);
  const TABS = ['All', 'Account', 'Technical', 'Billing', 'Other'];

  useEffect(() => {
    getFaqs();
  }, []);

  const getFaqs = () => {
    const onSuccess = response => {
      // console.log('rES:', JSON.stringify(response));
      setFaqs(response.data.data);
    };

    callApi(API_METHODS.GET, API.faqs, null, onSuccess, onAPIError, setIsLoading);
  };

  return (
    <Screen>
      <Header title={'Help Center'} />
      <Loader isLoading={isLoading} />
      <ImageBackground source={FruitPrimaryImage} style={helpCenterStyles.imageBG}>
        <View style={[globalStyles.screenPadding, helpCenterStyles.imageContent]}>
          <AppText fontSize={28} fontFamily={FONTS.medium} style={helpCenterStyles.whiteText}>
            How can we help?
          </AppText>
          <AppText style={[helpCenterStyles.findAnswer, helpCenterStyles.whiteText]}>Find answers to frequently asked questions.</AppText>
          {/* <AppTextInput placeholder="Search" RightIcon={SearchIcon} containerStyle={{width: '100%'}} /> */}
        </View>
      </ImageBackground>
      <AppScrollView>
        {/* <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={helpCenterStyles.tabScroll} style={helpCenterStyles.tabScrollMain}>
          {TABS.map(tab => (
            <Pressable key={tab} onPress={() => setSelectedTab(tab)} style={{backgroundColor: selectedTab === tab ? COLORS.grey1 : 'transparent', ...helpCenterStyles.tabItem}}>
              <AppText style={{color: selectedTab === tab ? COLORS.black : COLORS.textGray}} fontSize={12} greyText fontFamily={FONTS.medium}>
                {tab}
              </AppText>
            </Pressable>
          ))}
        </ScrollView> */}

        <View style={[globalStyles.inputsGap, {marginTop: 30}]}>
          {faqs?.map?.((item, index) => (
            <Pressable onPress={() => setSelectedFaqIndex(index)} key={index} style={helpCenterStyles.faqItem}>
              <View style={helpCenterStyles.titleAndIcon}>
                <AppText style={globalStyles.flex1} fontFamily={FONTS.medium} fontSize={12}>
                  {item?.question}
                </AppText>
                <ChevronIcon />
              </View>
              {selectedFaqIndex === index && (
                <AppText greyText fontSize={12}>
                  {item?.answer}
                </AppText>
              )}
            </Pressable>
          ))}
        </View>
      </AppScrollView>

      {/* <AppButton onPress={() => navigation.navigate(ROUTES.ChatRoom)} title={'Live Chat'} LeftIcon={<ChatWhiteIcon />} containerStyle={helpCenterStyles.liveChatIcon} /> */}
    </Screen>
  );
};

export default HelpCenter;
