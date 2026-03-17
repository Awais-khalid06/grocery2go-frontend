import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../utils/theme';
import {isIOS, wp} from '../../helpers';
import globalStyles from '../../../globalStyles';

export const mainCommonStyles = StyleSheet.create({
  flex1: {flex: 1},
  flexGrow1: {flexGrow: 1},
  contentContainer: {paddingHorizontal: '5%', flexGrow: 1, paddingBottom: '3%'},
  itemSeperator: {marginVertical: 10},
  bottomButton: {marginTop: 40},
  paragraphText: {fontSize: 12},
});

export const homeStyles = StyleSheet.create({
  header: {flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'center', maxWidth: '70%'},
  searchContainer: {flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20, marginBottom: 5},
  searchBar: {flex: 1},
  textInputContainerStyle: {height: 40},
  bellWrapper: {backgroundColor: COLORS.grey200, borderRadius: 10, padding: 5},
  iconsContainer: {flexDirection: 'row', alignItems: 'center', gap: 8},
  sectionLabel: {marginTop: 15, marginBottom: 10, flexDirection: 'row', alignItems: 'center'},
  categoriesContainer: {flexDirection: 'row', flexWrap: 'wrap', gap: 20},
  shopsContainer: {maxWidth: wp(100)},
  categoryContainer: {alignItems: 'center', gap: 7, width: '20%'},
  groceriesContainer: {maxWidth: wp(100)},
  groceryContainer: {marginTop: 10},
  groceriesContentContainer: {flexGrow: 1, gap: 10, paddingHorizontal: '5%'},
  shopCard: {width: wp(65)},
  thisWeekContainer: {borderWidth: 1, borderRadius: 100, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderColor: COLORS.primary},
  statsBoxContainer: {borderRadius: 10, backgroundColor: COLORS.white, flex: 1, padding: '4%', ...globalStyles.boxShadow1, minHeight: 140},
  statsIcon: {borderRadius: 100, width: 30, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.grey300},
  statNumber: {marginTop: 15, marginBottom: 10},
  statsContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10},
  offileOnlineTabContainer: {flexDirection: 'row', alignItems: 'center', borderWidth: 1, alignSelf: 'center', padding: 3, borderRadius: 15, gap: 10, marginTop: 15, borderColor: COLORS.primary},
  tabText: {paddingHorizontal: 15, paddingVertical: 7, borderRadius: 12, width: '30%', alignItems: 'center'},
  bottomSheetContainer: {flex: 1, padding: 20},
  noOrderContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  searchListView: {position: 'absolute', zIndex: 1, top: 45},
  notfound: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  icon: {width: 50, height: 50, resizeMode: 'contain'},
});

export const shopDetailStyles = StyleSheet.create({
  image: {width: '100%', height: 240, borderBottomLeftRadius: 20, borderBottomRightRadius: 20},
  shopInfoContainer: {marginVertical: 10},
  rowAndCenter: {flexDirection: 'row', alignItems: 'center'},
  textContent: {gap: 5},
  justifyCenterAndMT15: {justifyContent: 'space-between', marginTop: 10},
  productContainer: {flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginTop: 10, justifyContent: 'space-between'},
  productCard: {maxWidth: wp(48)},
  noProductContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  imageAltLogo: {alignSelf: 'center', opacity: 0.5},
});
export const riderStyles = StyleSheet.create({
  userImage: {width: wp(22), height: wp(22), borderRadius: 100},
  userProfileContainer: {alignSelf: 'center', alignItems: 'center', gap: 10},
  informationContainer: {marginTop: 15, gap: 10, flex: 1},
  specialNoteContainer: {gap: 10},
  reviewCard: {backgroundColor: COLORS.white, padding: '4%', borderRadius: 10},
  ratingsAndReviewContainer: {flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lightblue, padding: '3%', borderRadius: 10, alignSelf: 'center', gap: 10},
  seperatorLine: {height: 1, marginVertical: '5%', alignSelf: 'center'},
  requestButton: {position: 'absolute', bottom: 50},
  centerItems: {alignItems: 'center'},
  noReviewText: {textAlign: 'center'},
  noReviewTextContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export const productDetailStyles = StyleSheet.create({
  imageContainer: {width: '100%', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, ...globalStyles.boxShadow1, backgroundColor: COLORS.lightblue},
  image: {width: wp(100), height: 300, marginBottom: 10},
  counterContainer: {flexDirection: 'row', alignItems: 'center', gap: 10},
  counter: {width: 40, height: 40, borderRadius: 15, borderWidth: 1, borderColor: COLORS.grey2, alignItems: 'center', justifyContent: 'center'},
  counterMainContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5},
  seperatorLine: {marginTop: 20, marginBottom: 15},
  productDetail: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10},
  deleteProductButton: {backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary},
  deleteBtntext: {color: COLORS.primary},
  deleteModalButtons: {flexDirection: 'row', gap: 10, marginTop: 30},
  deleteModalButton: {width: '50%', height: 40},
  deleteModalCenteredText: {textAlign: 'center', marginTop: 10},
  ownerPriceAndQuantity: {marginTop: 10, gap: 5},
  rowItem: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
});

export const favoriteStyles = StyleSheet.create({
  tabContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'center', gap: 15},
  tab: {padding: 10, width: '44%', alignItems: 'center', height: 40},
  activeTab: {borderBottomWidth: 2, borderColor: COLORS.primary},
  marginTop15: {marginTop: 15},
  productContentContainer: {gap: 15},
});
export const cartStyles = StyleSheet.create({
  checkoutCard: {flexDirection: 'row', backgroundColor: COLORS.white, padding: 15, borderRadius: 10, justifyContent: 'space-between', alignItems: 'center'},
  checkoutCardButton: {width: '40%'},
  checkoutCardFooter: {flexGrow: 1, justifyContent: 'flex-end'},
  deliveryModalContainer: {backgroundColor: COLORS.white, width: '80%', padding: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 10},
  modalContent: {alignItems: 'center', gap: 5},
  modalbuttons: {alignItems: 'center', gap: 15, marginTop: 30},
  modalContinueBtn: {height: 40, width: '80%'},
  orderSummaryContainer: {backgroundColor: COLORS.white, padding: 15, gap: 12, borderRadius: 10},
  listItem: {flexDirection: 'row', justifyContent: 'space-between'},
  deliveryTime: {marginTop: 15},
});

export const locationStyles = StyleSheet.create({
  slideruserImage: {width: 35, height: 35, borderRadius: 100},
  sliderusername: {color: COLORS.white, fontFamily: FONTS.semiBold},
  currentLocationContainer: {flexDirection: 'row', marginTop: 60, gap: 10, alignItems: 'center', maxWidth: '80%'},
  selectionLocationMapText: {fontFamily: FONTS.medium, color: 'rgba(18, 111, 207, 1)'},
  greyCircle: {backgroundColor: COLORS.grey2, padding: 10, borderRadius: 100},
  currentLocation: {position: 'absolute', bottom: 120, right: 20},
  doneBtn: {position: 'absolute', bottom: 40, width: '90%', alignSelf: 'center'},
  mapLocationHeaderContainer: {flexDirection: 'row', alignItems: 'center', gap: 10},
  selectedImage: {width: '100%', height: '100%', borderRadius: 15},
  selectedImageContainer: {width: '100%', height: 150},
  imageCross: {position: 'absolute', right: 10, top: 10},
  cameraAndPublishBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 30,
    alignSelf: 'center',
  },
  topSearchContainer: {position: 'absolute', alignSelf: 'center', zIndex: 1},
});
export const orderAcceptStyles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center', ...globalStyles.screenPadding},
  contentText: {alignItems: 'center', marginVertical: 70, width: '70%', gap: 10},
  buttonsContainer: {alignItems: 'center', gap: 25},
});
export const orderDetailStyles = StyleSheet.create({
  image: {width: 50, height: 50, borderRadius: 100, marginEnd: '3%'},
  riderImage: {width: 35, height: 35, resizeMode: 'contain', borderRadius: 100, marginEnd: '3%'},
  locationContainer: {flexDirection: 'row', alignItems: 'center', gap: 3},
  headerContainer: {flexDirection: 'row', alignItems: 'center'},
  headContainer: {width: '100%', backgroundColor: COLORS.white, padding: '4%', borderRadius: 10},
  contentText: {gap: 3, flex: 1},
  rowItem: {flexDirection: 'row', justifyContent: 'space-between'},
  rowElement: {flexDirection: 'row', alignItems: 'center', gap: 3},
  blueText: {color: '#0EA0E8'},
  footerButtonContainer: {marginTop: 20, gap: 15},
  textCenter: {textAlign: 'center'},
  marginTopBottom: {marginTop: 15, marginBottom: 20},
  button: {width: '45%', height: 40, textAlign: 'center', textAlignVertical: 'center'},
  buttonsContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20},
  orderSummary: {marginTop: 15, gap: 10},
  distanceItem: {flexDirection: 'row', alignItems: 'center', gap: 10},
  distanceDotsBar: {height: 40, borderLeftWidth: 1, marginStart: 20, borderStyle: isIOS ? undefined : 'dotted', borderColor: COLORS.primary},
  billItemContainer: {backgroundColor: COLORS.white, flexDirection: 'row', justifyContent: 'space-between', borderRadius: 10, overflow: 'hidden'},
  billItemContainer1: {backgroundColor: COLORS.white, width: '50%', padding: 10, gap: 15},
  billItemContainer2: {backgroundColor: 'rgba(255, 45, 8, 0.25)', width: '40%', alignItems: 'flex-end', padding: 10, gap: 15},
  billItem: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  rowButton: {width: '45%', height: 40, textAlign: 'center', textAlignVertical: 'center'},
  rowButtonsContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20},
  orderStatusContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15},
  infoRow: {flexDirection: 'row', gap: 5},
  shopButton: {width: '30%', height: 30},
  marginTop20: {marginTop: 20},
});

export const listStyles = StyleSheet.create({
  emptyComponent: {alignSelf: 'center', flex: 1, justifyContent: 'center'},
  addContainer: {
    width: wp(15),
    height: wp(15),
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    ...globalStyles.boxShadow1,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addListHeaderInputContainer: {gap: 5},
  addListHeaderQuantityInput: {flexDirection: 'row', alignItems: 'center', gap: 10},
  addButton: {height: 40, width: '25%'},
  productsContainer: {marginTop: 30, gap: 20, flex: 1},
  productCounter: {borderWidth: 1, borderRadius: 5, borderColor: COLORS.grey2, width: '7%', paddingVertical: 10, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center'},
  productItem: {flexDirection: 'row', alignItems: 'center', gap: 5},
  dotMenuListContainer: {position: 'absolute', backgroundColor: COLORS.white, padding: 10, borderRadius: 10, right: 10, top: 45},
  dropdownItemContainer: {flexDirection: 'row', alignItems: 'center', gap: 5},
  listItem: {flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, padding: 12, borderColor: COLORS.grey1},
  listItemLeftContent: {flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1},
  allLists: {backgroundColor: COLORS.white, borderRadius: 10, padding: 15, ...globalStyles.boxShadow1, gap: 12},
  listPaddingAndBorder: {borderBottomWidth: 1, padding: 10, width: wp(25), borderColor: COLORS.grey1},
  bottomSheetContainer: {alignItems: 'center', flex: 1, justifyContent: 'center'},
  redText: {color: COLORS.red, fontFamily: FONTS.medium},
  oneListContainer: {backgroundColor: COLORS.white, width: '100%', borderRadius: 10, padding: 10, gap: 3},
});

export const feedbackStyles = StyleSheet.create({
  starContainer: {width: '100%', gap: 5},
  ratingContainer: {width: '100%', marginTop: 30},
  reviewButton: {marginBottom: 20, marginTop: 10},
  yourReviewText: {fontFamily: FONTS.semiBold, fontSize: 18},
  feedbackText: {fontFamily: FONTS.medium},
  feedbackInput: {textAlignVertical: 'top', fontSize: 12},
  feedbackInputContainer: {marginTop: 10, height: 120},
  count: {fontSize: 12, marginTop: 10},
});

export const navigateStyles = StyleSheet.create({
  bottonButton: {position: 'absolute', bottom: 40, alignSelf: 'center', width: '90%'},
});
export const tipStyles = StyleSheet.create({
  item: {backgroundColor: COLORS.white, padding: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 10},
  itemsContainer: {gap: 12, marginTop: 20, flex: 1},
});
export const productStyles = StyleSheet.create({
  container: {width: '100%', borderWidth: 1, borderColor: COLORS.primary, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', height: 150, borderRadius: 12},
  uploadContainer: {gap: 10, marginBottom: 20},
  dropdownStyle: {borderWidth: 1, borderColor: COLORS.grey2, minHeight: 45, borderRadius: 10},
  dropdownPlaceholder: {color: COLORS.textGray},
  dropdownContainerStyle: {borderWidth: 1, borderColor: COLORS.grey2},
  dropdownText: {fontFamily: FONTS.regular, fontSize: 12},
  uploadContentContainer: {alignItems: 'center', gap: 10},
  imagesContainer: {flexDirection: 'row', gap: 10, flexWrap: 'wrap'},
  imagesMainContainer: {width: '100%', borderWidth: 1, borderColor: COLORS.primary, borderStyle: 'dashed', height: 150, borderRadius: 12, padding: 10},
  image: {width: 50, height: 50, borderRadius: 10},
  uploadimageIcon: {alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.primary},
  crossIconImage: {backgroundColor: COLORS.primary, borderRadius: 100, padding: 3, position: 'absolute', right: 4, top: 4},
});

export const notificationStyles = StyleSheet.create({
  container: {
    width: '100%',
    ...globalStyles.boxShadow1,
    padding: '4%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    borderRadius: 15,
  },
  leftContainer: {width: 90, height: 90},
  image: {width: '100%', height: '100%', borderRadius: 10},
  title: {fontFamily: FONTS.medium, marginBottom: 7},
  centeredContainer: {maxWidth: '65%'},
  listContainer: {marginTop: 15},
});

export const settingsStyles = StyleSheet.create({
  profilePic: {width: 100, height: 100, borderRadius: 100, backgroundColor: COLORS.grey1},
  personnameText: {color: COLORS.black, marginTop: 6, fontFamily: FONTS.medium},
  usernameText: {fontSize: 12, color: COLORS.grey4, marginTop: isIOS ? 10 : 5},
  profileContainer: {alignItems: 'center', marginTop: 20, marginBottom: 15},
  cardHeadContainer: {flexDirection: 'row', borderWidth: 1, padding: 10, borderRadius: 20, borderColor: COLORS.primary, alignItems: 'center', justifyContent: 'center'},
  cardTitle: {fontFamily: FONTS.semiBold, marginVertical: 10, fontSize: 15},
  planChevron: {alignSelf: 'center'},
  optionsContainer: {marginTop: 20},
  marginTop10: {marginTop: 20},
  deleteAccountText: {color: COLORS.red, fontFamily: FONTS.medium},
  notificationItemContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  logoutButtonContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%'},
});

export const profileStyles = StyleSheet.create({
  cameraIcon: {position: 'absolute', bottom: 5, right: 5},
  avatarContainer: {alignSelf: 'center', marginTop: 20, marginBottom: 10, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 100},
  image: {width: 100, height: 100, borderRadius: 100},
  profileCreatedTitle: {fontFamily: FONTS.semiBold, fontSize: 18, marginVertical: 20},
  profileCreatedDesc: {textAlign: 'center', width: '75%'},
  timeContainer: {
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.grey2,
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export const deleteAccountStyles = StyleSheet.create({
  deleteAccountText: {fontFamily: FONTS.medium, color: COLORS.red},
  inputLabel: {fontFamily: FONTS.semiBold, marginBottom: 10, marginTop: 20},
});

export const helpCenterStyles = StyleSheet.create({
  imageBG: {width: '100%', height: 230, resizeMode: 'contain', justifyContent: 'center'},
  imageContent: {alignItems: 'center'},
  findAnswer: {marginTop: 15, marginBottom: 35},
  whiteText: {color: COLORS.white},
  tabScrollMain: {marginTop: 15, maxHeight: 40},
  tabScroll: {gap: 20, alignItems: 'center'},
  faqItem: {backgroundColor: COLORS.white, padding: 15, gap: 10, borderRadius: 10},
  titleAndIcon: {flexDirection: 'row', alignItems: 'center'},
  liveChatIcon: {height: 45, width: '40%', position: 'absolute', bottom: 20, right: 20},
  tabItem: {padding: 12, borderRadius: 10},
});

export const walletStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  wrapper: {
    flex: 1,
    width: '100%',
  },
  fg1: {
    flexGrow: 1,
  },
  h2: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textGray,
    textAlign: 'center',
  },
  webviewStyle: {
    flex: 1,
    width: wp(100),
  },
});

export const chatRoomStyles = StyleSheet.create({
  flexGrow: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: '4%',
  },

  seperator: {marginVertical: 10},

  flatList: {
    marginTop: 20,
  },

  flatListContentContainer: {
    flexGrow: 1,
    // paddingTop: 50,
  },

  micIconContainer: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.grey3,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    right: 15,
    bottom: 15,
    position: 'absolute',
  },
  micIcon: {width: 22, height: 22},
});

export const chatStyles = StyleSheet.create({
  image: {width: 40, height: 40, borderRadius: 100},
  myMessageContainer: {backgroundColor: COLORS.primary, padding: 10, borderRadius: 10, borderBottomRightRadius: 0, maxWidth: '90%'},
  otherMessageContainer: {backgroundColor: COLORS.white, padding: 10, borderRadius: 10, borderTopLeftRadius: 0},
  myMessageText: {color: COLORS.white},
  otherMessageText: {},

  myMessageMainContainer: {flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', maxWidth: '80%', gap: 10},
  otherMessageMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '70%',
    gap: 10,
  },
  messageTime: {fontSize: 12},
  chatHeading: {flexDirection: 'row', gap: 10, alignItems: 'center'},
  chatHeadingText: {fontSize: 12},
  inputContainer: {flexDirection: 'row', alignItems: 'center', marginVertical: '3%'},
  input: {flexGrow: 1, ...globalStyles.boxShadow1, borderRadius: 14, marginEnd: 5},
  textInput: {backgroundColor: COLORS.white},
  messageImage: {width: 100, height: 100, borderRadius: 15},
  username: {fontFamily: FONTS.semiBold},
  userContainer: {flexDirection: 'row', alignItems: 'center', gap: 15},
  gap3: {gap: 3},
  sendButton: {width: 50, height: 50, borderRadius: 100, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center'},
});

export const inboxStyles = StyleSheet.create({
  image: {width: 40, height: 40, borderRadius: 100},
  myMessageContainer: {backgroundColor: COLORS.primary, padding: 10, borderRadius: 10, borderBottomRightRadius: 0, maxWidth: '90%'},
  otherMessageContainer: {backgroundColor: COLORS.white, padding: 10, borderRadius: 10, borderTopLeftRadius: 0},
  myMessageText: {color: COLORS.white},
  otherMessageText: {},

  myMessageMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    maxWidth: '80%',
    gap: 10,
  },
  otherMessageMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '70%',
    gap: 10,
  },
  messageTime: {fontSize: 12},
  chatHeading: {flexDirection: 'row', gap: 10, alignItems: 'center'},
  chatHeadingText: {fontSize: 12},
  inputContainer: {flexDirection: 'row', alignItems: 'center', ...globalStyles.screenPadding},
  input: {flexGrow: 1, ...globalStyles.boxShadow1, borderRadius: 14, marginEnd: 5},
  textInput: {backgroundColor: COLORS.white},
  messageImage: {width: 100, height: 100, borderRadius: 15},
  audioLeftContainer: {
    alignSelf: 'flex-start',
  },
  audioRightContainer: {
    alignSelf: 'flex-end',
  },
  alertMsg: {
    color: COLORS.grey5,
    fontFamily: FONTS.regular,
  },
  mySharePostContainer: {
    minWidth: 140,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    gap: 10,
    padding: 5,
    alignSelf: 'flex-end',
    backgroundColor: COLORS.black,
  },
  otherSharePostContainer: {
    minWidth: 140,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    gap: 10,
    padding: 5,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.grey1,
  },
  postLoader: {width: 30, height: 30},
  postOpenText: {fontSize: 10, fontFamily: FONTS.regular, includeFontPadding: false, color: COLORS.white},
  postText: {color: COLORS.white, includeFontPadding: false, fontFamily: FONTS.medium, fontSize: 12},
});
