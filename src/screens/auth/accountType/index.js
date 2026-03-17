import {View} from 'react-native';
import React, {useState} from 'react';
import FruitsColorBackgroundWrapper from '../common/fruitsColorBackgroundWrapper';
import {AppButton, AppScrollView, AppText, IconCard} from '../../../components';
import {LogoIcon} from '../../../assets/icons';
import {wp} from '../../../helpers';
import {accountTypeStyles} from '../styles';
import {ACCOUNT_TYPE, ACCOUNT_TYPE_DATA} from '../../../static';
import {FONTS} from '../../../utils/theme';
import {ROUTES} from '../../../utils/constants';
import {useDispatch} from 'react-redux';
import {authActions} from '../../../redux/slices/auth';

const AccountType = ({navigation}) => {
  const [selected, setSelected] = useState(null);
  const dispatch = useDispatch();

  const handleContinue = () => {
    let accountType = ACCOUNT_TYPE.CUSTOMER;
    if (selected === 'Grocery owner') accountType = ACCOUNT_TYPE.GROCERY_OWNER;
    else if (selected === 'Goer (Driver)') accountType = ACCOUNT_TYPE.DRIVER;

    dispatch(authActions.setAccountType(accountType));
    navigation.navigate(ROUTES.SignUp);
  };

  return (
    <FruitsColorBackgroundWrapper>
      <AppScrollView>
        <LogoIcon width={wp(45)} style={accountTypeStyles.logo} />

        <View style={accountTypeStyles.content}>
          <AppText fontFamily={FONTS.medium} fontSize={18} primary>
            Choose An Account Type
          </AppText>
          <View style={accountTypeStyles.accountsContainer}>
            {ACCOUNT_TYPE_DATA.map((account, index) => (
              <IconCard isSelected={selected === account.title} key={index} item={account} onPress={() => setSelected(account.title)} />
            ))}
          </View>
        </View>

        <AppButton title={'Continue'} disabled={!selected} onPress={handleContinue} />
      </AppScrollView>
    </FruitsColorBackgroundWrapper>
  );
};

export default AccountType;
