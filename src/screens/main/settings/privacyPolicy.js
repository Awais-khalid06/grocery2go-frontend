import {StyleSheet, View} from 'react-native';
import React from 'react';
import {AppScrollView, AppText, Header, Screen} from '../../../components';
import {FONTS} from '../../../utils/theme';

const LAST_UPDATED = 'May 26, 2026';

const POLICY_SECTIONS = [
  {
    title: '1. Overview',
    points: [
      'This Privacy Policy explains how Grocery2Go collects, uses, stores, and protects your personal information when you use the app.',
      'By using Grocery2Go, you agree to the data practices described in this policy.',
    ],
  },
  {
    title: '2. Information We Collect',
    points: [
      'Account information: name, email address, phone/contact details, user type (Customer, Shop Owner, Rider), and profile image.',
      'Login and security information: authentication tokens, device identifiers, and session data used for secure account access.',
      'Order and activity information: shops viewed, products added, cart details, orders, lists, ratings, and support interactions.',
      'Location information: delivery addresses and location coordinates used for nearby shops, rider assignment, tracking, and delivery flow.',
      'Payment-related information: transaction references and payment status from integrated payment providers. Card details are handled by payment partners according to their policies.',
    ],
  },
  {
    title: '3. How We Use Your Information',
    points: [
      'To create and manage your account and profile.',
      'To process grocery orders, rider requests, list purchases, delivery updates, and service notifications.',
      'To verify payments, prevent fraud, resolve disputes, and maintain platform security.',
      'To improve app performance, service quality, and user experience through analytics and operational insights.',
    ],
  },
  {
    title: '4. Notifications and Communication',
    points: [
      'We may send in-app, push, email, or SMS notifications for order status, account security, OTP verification, and important service announcements.',
      'You can manage certain notification preferences from app settings, but critical security and transactional alerts may still be sent.',
    ],
  },
  {
    title: '5. Data Sharing',
    points: [
      'We share limited required data between Customers, Shop Owners, and Riders to complete orders and deliveries.',
      'We may share data with trusted service providers (such as hosting, messaging, analytics, and payment partners) only as needed for platform operations.',
      'We may disclose information when required by law, legal process, or to protect the safety, rights, and integrity of users and Grocery2Go.',
    ],
  },
  {
    title: '6. Data Retention',
    points: [
      'We retain personal and transactional data for as long as needed to provide services, comply with legal obligations, resolve disputes, and enforce terms.',
      'Retention periods may vary by data type, operational need, and regulatory requirements.',
    ],
  },
  {
    title: '7. Account Security',
    points: [
      'We use reasonable technical and organizational safeguards to protect user information.',
      'No internet-based platform is 100% secure. You are responsible for keeping your login credentials private and using secure devices/networks.',
    ],
  },
  {
    title: '8. Your Rights and Choices',
    points: [
      'You may review and update certain profile details inside the app.',
      'You may request account deletion through the app flow, subject to verification and applicable retention/legal obligations.',
      'You may contact support for data-related questions, corrections, or concerns.',
    ],
  },
  {
    title: '9. Children’s Privacy',
    points: [
      'Grocery2Go is not intended for children under the age required by applicable local law to use such services independently.',
      'If we learn that prohibited child data was provided, we will take reasonable steps to remove it in accordance with law.',
    ],
  },
  {
    title: '10. International and Third-Party Services',
    points: [
      'Some infrastructure or partners may process data in regions outside your city or country, subject to contractual and security controls.',
      'Third-party tools and services integrated in the app may have their own privacy policies.',
    ],
  },
  {
    title: '11. Policy Updates',
    points: [
      'We may update this Privacy Policy from time to time to reflect legal, technical, or product changes.',
      'Continued use of the app after updates means you accept the revised policy.',
      `Last updated: ${LAST_UPDATED}.`,
    ],
  },
];

const PrivacyPolicy = () => {
  return (
    <Screen>
      <Header title={'Privacy Policy'} />
      <AppScrollView>
        <View style={styles.container}>
          {/* <AppText style={styles.introTitle} fontFamily={FONTS.semiBold} fontSize={14}>
            Grocery2Go Privacy Policy
          </AppText>
          <AppText greyText fontSize={12} style={styles.introText}>
            Your privacy matters to us. Please read this policy carefully.
          </AppText> */}

          {POLICY_SECTIONS.map(section => (
            <View key={section.title} style={styles.section}>
              <AppText style={styles.sectionTitle} fontFamily={FONTS.semiBold} fontSize={12}>
                {section.title}
              </AppText>
              {section.points.map(point => (
                <AppText key={point} greyText fontSize={12} style={styles.point}>
                  {'\u2022'} {point}
                </AppText>
              ))}
            </View>
          ))}
        </View>
      </AppScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingBottom: 12,
  },
  introTitle: {
    marginTop: 2,
  },
  introText: {
    lineHeight: 20,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    lineHeight: 18,
  },
  point: {
    lineHeight: 20,
  },
});

export default PrivacyPolicy;
