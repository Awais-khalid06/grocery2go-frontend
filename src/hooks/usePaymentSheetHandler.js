import {usePaymentSheet} from '@stripe/stripe-react-native';
import {useCallback} from 'react';
import {Alert} from 'react-native';

const usePaymentSheetHandler = () => {
  const {presentPaymentSheet, initPaymentSheet} = usePaymentSheet();

  const isPaymentSheetCanceled = error => {
    const code = error?.code || '';
    const message = error?.message || '';

    return code === 'Canceled' || code === 'CanceledError' || /cancel/i.test(message);
  };

  // Your reusable function
  const initializeAndPresentPaymentSheet = useCallback(
    async (data, onSuccessPayment) => {
      try {
        console.log('[PaymentSheet] init started', {
          hasCustomerId: !!data?.customerId,
          hasClientSecret: !!data?.clientSecret,
          hasPaymentIntentId: !!data?.paymentIntentId,
          hasOrderId: !!data?.orderId,
        });

        // Initialize Payment Sheet
        const {error} = await initPaymentSheet({
          customerId: data?.customerId,
          paymentIntentClientSecret: data?.clientSecret,
          merchantDisplayName: 'Grocery2Go App',
          allowsDelayedPaymentMethods: true,
          returnURL: 'stripe-example://stripe-redirect',
        });

        if (error) {
          console.log('[PaymentSheet] init failed', error);
          Alert.alert(`Error code: ${error.code}`, error.message);
          return {success: false, stage: 'init', error}; // Early return if initialization fails
        }

        console.log('[PaymentSheet] init success');

        // Present the Payment Sheet
        console.log('[PaymentSheet] calling presentPaymentSheet...');
        const presentStartTime = Date.now();
        const pendingTimer = setTimeout(() => {
          console.log('[PaymentSheet] presentPaymentSheet still pending after 15s');
        }, 15000);

        const presentResult = await presentPaymentSheet();
        clearTimeout(pendingTimer);
        const {error: presentError} = presentResult || {};
        console.log('[PaymentSheet] presentPaymentSheet resolved', {
          durationMs: Date.now() - presentStartTime,
          hasError: !!presentError,
          presentResult,
        });

        if (presentError) {
          console.log('[PaymentSheet] present failed', presentError);
          const isCanceled = isPaymentSheetCanceled(presentError);

          if (!isCanceled) {
            Alert.alert(`Error code: ${presentError.code}`, presentError.message);
          }

          return {success: false, stage: 'present', error: presentError, isCanceled}; // Early return if presentation fails
        }

        console.log('[PaymentSheet] present success, calling onSuccessPayment callback');
        await onSuccessPayment?.();
        console.log('[PaymentSheet] onSuccessPayment callback completed');
        return {success: true};
      } catch (error) {
        console.error('[PaymentSheet] unexpected error in payment flow:', error);
        return {success: false, stage: 'unexpected', error};
      }
    },
    [initPaymentSheet, presentPaymentSheet], // Dependency array
  );

  return initializeAndPresentPaymentSheet;
};

export default usePaymentSheetHandler;
