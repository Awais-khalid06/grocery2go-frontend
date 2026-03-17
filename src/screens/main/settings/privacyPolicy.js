import {View, Text} from 'react-native';
import React from 'react';
import {AppScrollView, AppText, Header, Screen} from '../../../components';

const PrivacyPolicy = () => {
  return (
    <Screen>
      <Header title={'Privacy Policy'} />
      <AppScrollView>
        <AppText greyText fontSize={12}>
          Welcome to [Your App Name]! These terms and conditions outline the rules and regulations for the use of [Your Company Name]'s mobile application, located at [Your App's Website or Contact
          Information]. By accessing this mobile application, we assume you accept these terms and conditions. Do not continue to use [Your App Name] if you do not agree to take all of the terms and
          conditions stated on this page. The following terminology applies to these Terms and Conditions, Privacy Statement, and Disclaimer Notice and all Agreements: "Client," "You," and "Your"
          refers to you, the person logged on this mobile application and compliant to the Company's terms and conditions. "The Company," "Ourselves," "We," "Our," and "Us," refers to our Company.
          "Party," "Parties," or "Us," refers to both the Client and ourselves. All terms refer to the offer, acceptance, and consideration of payment necessary to undertake the process of our
          assistance to the Client in the most appropriate manner for the express purpose of meeting the Client's needs in respect to provision of the Company's stated services, in accordance with and
          subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and
          therefore as referring to the same.
        </AppText>
      </AppScrollView>
    </Screen>
  );
};

export default PrivacyPolicy;
