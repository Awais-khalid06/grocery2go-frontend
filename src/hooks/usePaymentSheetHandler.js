import {usePaymentSheet} from '@stripe/stripe-react-native';
import {useCallback} from 'react';
import {Alert} from 'react-native';

const usePaymentSheetHandler = () => {
  const {presentPaymentSheet, initPaymentSheet} = usePaymentSheet();

  // Your reusable function
  const initializeAndPresentPaymentSheet = useCallback(
    async (data, onSuccessPayment) => {
      try {
        // Initialize Payment Sheet
        const {error} = await initPaymentSheet({
          customerId: data?.customerId,
          paymentIntentClientSecret: data?.clientSecret,
          merchantDisplayName: 'Grocery2Go App',
          allowsDelayedPaymentMethods: true,
          returnURL: 'stripe-example://stripe-redirect',
        });

        if (error) {
          Alert.alert(`Error code: ${error.code}`, error.message);
          return null; // Early return if initialization fails
        }

        // Present the Payment Sheet
        const {error: presentError} = await presentPaymentSheet();

        if (presentError) {
          Alert.alert(`Error code: ${presentError.code}`, presentError.message);
          return null; // Early return if presentation fails
        }

        onSuccessPayment?.();
      } catch (error) {
        console.error('Error in payment flow:', error);
      }
    },
    [initPaymentSheet, presentPaymentSheet], // Dependency array
  );

  return initializeAndPresentPaymentSheet;
};

export default usePaymentSheetHandler;
