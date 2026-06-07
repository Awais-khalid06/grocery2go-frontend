import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import WebView from "react-native-webview";
import {
  AppButton,
  AppText,
  Header,
  Loader,
  Screen,
  ShowMessage,
} from "../../../components";
import { API, BASE_URL } from "../../../network/Environment";
import { API_METHODS, callApi } from "../../../network/NetworkManger";
import { addBankStyles } from "../styles";
import { ROUTES, STACKS } from "../../../utils/constants";
import { onAPIError } from "../../../helpers";
import { CloseRedCircleIcon } from "../../../assets/icons";
import { useAccountType } from "../../../hooks";
import { FONTS } from "../../../utils/theme";

const AddBank = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stripeLink, setStripeLink] = useState("");
  const [urlLink, setUrlLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isDriver, isGroceryOwner } = useAccountType();
  const desiredURL = `${BASE_URL}user/stripe/verify-onboarding`;

  useEffect(() => {
    getConnectData();
  }, []);

  const getReadableErrorMessage = (error) => {
    return (
      error?.message ||
      error?.data?.message ||
      error?.errorType ||
      "Unable to create your bank setup right now. Please try again."
    );
  };

  const showScreenError = (error) => {
    const nextMessage = getReadableErrorMessage(error);
    setErrorMessage(nextMessage);
    setStripeLink("");
    setUrlLink("");
  };

  useEffect(() => {
    if (urlLink.includes(desiredURL)) {
      verifyAccount();
    }
  }, [urlLink, desiredURL]);

  const verifyAccount = async () => {
    const onSuccess = (response) => {
      if (response?.status === 200) {
        if (
          response?.message ===
          "Could not verify your details. Please refer to the link and submit your information again!"
        ) {
          ShowMessage("Having issue with verification");
          setStripeLink(response?.data.accountUrl?.url);
        } else {
          ShowMessage("Account added successfull");
          navigation.replace(STACKS.Main);
        }
      }
    };

    const onError = (error) => {
      onAPIError(error);
      showScreenError(error);
    };

    callApi(
      API_METHODS.GET,
      API.verfyStripeOnboarding,
      null,
      onSuccess,
      onError,
      setIsLoading
    );
  };

  const getConnectData = () => {
    const onSuccess = (response) => {
      console.log("getConnectData response: ", response);
      if (response?.status === 200 || response?.status == "success") {
        const accountUrl = response?.data?.accountUrl?.url;
        if (accountUrl) {
          setErrorMessage("");
          setUrlLink("");
          setStripeLink(accountUrl);
        } else {
          showScreenError({
            message: "Stripe setup link is unavailable. Please try again.",
          });
        }
      } else {
        showScreenError(response);
        console.log("getConnectData response: ", response);
      }
    };

    const onError = (error) => {
      onAPIError(error);
      showScreenError(error);
    };

    callApi(
      API_METHODS.GET,
      API.createStripeAccount,
      null,
      onSuccess,
      onError,
      setIsLoading
    );
  };

  const handleRetry = () => {
    setErrorMessage("");
    setStripeLink("");
    setUrlLink("");
    getConnectData();
  };

  const handleFixCountry = () => {
    setErrorMessage("");
    setStripeLink("");
    setUrlLink("");

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    if (isGroceryOwner) {
      navigation.navigate(ROUTES.CompleteProfile, {
        screenType: "EDIT_PROFILE",
      });
      return;
    }

    navigation.navigate(ROUTES.CompleteProfile);
  };

  return (
    <Screen>
      {stripeLink?.length > 0 ? null : <Header title={"Add Bank"} />}
      <Loader isLoading={isLoading} />

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={addBankStyles.fg1}
      >
        <View style={addBankStyles.wrapper}>
          {errorMessage ? (
            <View style={addBankStyles.errorContainer}>
              <View style={addBankStyles.errorIconContainer}>
                <CloseRedCircleIcon width={72} height={72} />
              </View>

              <AppText
                fontFamily={FONTS.semiBold}
                fontSize={18}
                style={addBankStyles.errorTitle}
              >
                Bank setup failed
              </AppText>
              <AppText
                fontSize={12}
                greyText
                style={addBankStyles.errorMessage}
                numberOfLines={6}
              >
                {errorMessage}
              </AppText>
              <AppText fontSize={12} greyText style={addBankStyles.errorHint}>
                {isDriver
                  ? "Please go back, update your profile country and address, then select a matching location."
                  : "Please go back, update your shop country and address, then select a matching location."}
              </AppText>

              <View style={addBankStyles.errorActions}>
                <AppButton
                  title={"Update Country"}
                  onPress={handleFixCountry}
                />
                <AppButton
                  title={"Try Again"}
                  transparentButton
                  containerStyle={addBankStyles.secondaryButton}
                  style={addBankStyles.secondaryButtonInner}
                  textStyle={addBankStyles.secondaryButtonText}
                  onPress={handleRetry}
                />
              </View>
            </View>
          ) : null}
          {stripeLink?.length > 0 && (
            <WebView
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              source={{ uri: stripeLink }}
              onNavigationStateChange={(data) => {
                console.log("onNavigationStateChange data:", data);
                setUrlLink(data?.url);
              }}
              style={addBankStyles.webviewStyle}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
};

export default AddBank;
