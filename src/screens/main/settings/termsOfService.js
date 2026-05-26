import { StyleSheet, View } from 'react-native';
import React from 'react';
import { AppScrollView, AppText, Header, Screen } from '../../../components';
import { FONTS } from '../../../utils/theme';

const LAST_UPDATED = 'May 26, 2026';

const TERMS_SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    points: [
      'By creating an account, logging in, or using Grocery2Go, you agree to these Terms of Service.',
      'If you do not agree with any part of these terms, you must stop using the app.',
    ],
  },
  {
    title: '2. About Grocery2Go',
    points: [
      'Grocery2Go is a platform that connects Customers, Shop Owners, and Riders for grocery shopping, order delivery, and list-based purchase requests.',
      'We provide technology services to facilitate requests, communication, tracking, payments, and support workflows.',
    ],
  },
  {
    title: '3. Eligibility and Account Responsibility',
    points: [
      'You must provide accurate profile information and keep your account details updated.',
      'You are responsible for all activity under your account, including login credentials and device access.',
      'You must notify support immediately if you suspect unauthorized account use.',
    ],
  },
  {
    title: '4. User Roles and Conduct',
    points: [
      'Customers may browse shops, place orders, request riders, and pay bills through available checkout flows.',
      'Shop Owners are responsible for accurate item listings, pricing, stock updates, and order handling timelines.',
      'Riders are responsible for safe, lawful, and timely pickup/delivery behavior and status updates in the app.',
      'All users must treat others respectfully and must not abuse chat, notifications, ratings, or support channels.',
    ],
  },
  {
    title: '5. Orders, Lists, and Fulfillment',
    points: [
      'Order requests are subject to shop/rider acceptance, product availability, delivery feasibility, and service area limits.',
      'Products may become unavailable after checkout request; in such cases, substitutions, partial fulfillment, or cancellation may apply.',
      'Delivery ETA and tracking updates are estimates and can vary due to traffic, weather, store delays, or operational load.',
    ],
  },
  {
    title: '6. Pricing, Charges, and Payments',
    points: [
      'Prices, taxes, service fees, and delivery charges shown in the app may vary by location, time, shop, and order type.',
      'You authorize Grocery2Go and its payment partners to charge the payment method used at checkout for approved transactions.',
      'Payment processing may involve third-party providers. Payment failures, reversals, or verification holds may delay order processing.',
    ],
  },
  {
    title: '7. Cancellations, Refunds, and Disputes',
    points: [
      'Cancellation eligibility depends on order stage (before acceptance, after acceptance, picked-up, or delivered).',
      'Refund outcomes may vary for full, partial, or failed deliveries based on verification details and policy review.',
      'If you believe a charge is incorrect, raise a support request through the app with order details for review.',
    ],
  },
  {
    title: '8. Ratings, Reviews, and Feedback',
    points: [
      'You may leave ratings and feedback after completed services.',
      'Feedback must be honest, relevant, and non-abusive. We may remove content that violates policy or applicable law.',
      'By submitting feedback, you grant Grocery2Go the right to use it for service improvement and quality monitoring.',
    ],
  },
  {
    title: '9. Prohibited Use',
    points: [
      'You must not use the app for fraud, fake orders, harassment, abuse, illegal goods/services, or payment misuse.',
      'You must not attempt unauthorized API access, reverse engineering, data scraping, or disruption of platform operations.',
      'Violation may result in account suspension, order cancellation, balance hold, or permanent removal from the platform.',
    ],
  },
  {
    title: '10. Availability and Service Changes',
    points: [
      'We may update features, endpoints, pricing logic, operational flows, and service coverage without prior notice.',
      'Temporary downtime may occur due to maintenance, incidents, or third-party dependency issues.',
      'We do not guarantee uninterrupted availability at all times.',
    ],
  },
  {
    title: '11. Intellectual Property',
    points: [
      'All app content, branding, software elements, and platform workflows remain the property of Grocery2Go or its licensors.',
      'You may not copy, reproduce, republish, or commercially exploit any part of the app without written permission.',
    ],
  },
  {
    title: '12. Limitation of Liability',
    points: [
      'To the maximum extent permitted by law, Grocery2Go is not liable for indirect, incidental, or consequential losses.',
      'Platform services are provided on an as-available basis without guarantees of merchant stock accuracy, exact delivery times, or uninterrupted access.',
    ],
  },
  {
    title: '13. Suspension and Termination',
    points: [
      'We may suspend, restrict, or terminate accounts that violate these terms, harm users, or create operational/security risk.',
      'You may stop using the app at any time. Certain records may be retained as required for security, compliance, and dispute handling.',
    ],
  },
  {
    title: '14. Governing Terms Updates',
    points: [
      'These terms may be revised from time to time. Continued use after updates means you accept the revised terms.',
      `Last updated: ${LAST_UPDATED}.`,
    ],
  },
];

const TermsOfService = () => {
  return (
    <Screen>
      <Header title={'Terms Of Service'} />
      <AppScrollView>
        <View style={styles.container}>
          {/* <AppText style={styles.introTitle} fontFamily={FONTS.semiBold} fontSize={14}>
            Grocery2Go Terms of Service
          </AppText>
          <AppText greyText fontSize={12} style={styles.introText}>
            Please read these terms carefully before using the app.
          </AppText> */}

          {TERMS_SECTIONS.map(section => (
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

export default TermsOfService;
