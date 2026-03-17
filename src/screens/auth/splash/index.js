import React, {useEffect} from 'react';
import {LogoIcon} from '../../../assets/icons';
import FruitsBackgroundWrapper from '../common/fruitsBackgroundWrapper';
import {ROUTES, STACKS} from '../../../utils/constants';
import {View} from 'react-native';
import {splashStyles} from '../styles';
import {useSelector} from 'react-redux';
import {userSelector} from '../../../redux/selectors';
import {requestNotificationPermission} from '../../../helpers';

const Splash = ({navigation}) => {
  const user = useSelector(userSelector);

  useEffect(() => {
    requestNotificationPermission();
    setTimeout(() => {
      if (user) navigation.replace(STACKS.Main);
      else navigation.replace(ROUTES.Onboarding);
    }, 3000);
  }, []);

  return (
    <FruitsBackgroundWrapper>
      <View style={splashStyles.logo}>
        <LogoIcon width={'70%'} height={'70%'} />
      </View>
    </FruitsBackgroundWrapper>
  );
};

export default Splash;
