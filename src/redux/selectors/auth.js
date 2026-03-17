export const userSelector = state => state?.auth?.user;
export const accountSelector = state => state?.auth?.accountType;
export const isRememberMeSelector = state => state?.auth?.isRememberMe;
export const rememberedCredentialsSelector = state => state?.auth?.rememberedCredentials;
