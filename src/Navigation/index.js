import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

const RootNavigator = createSwitchNavigator(
  {
    Auth: AuthNavigator,
    App: AppNavigator,
  },
  {
    initialRouteName: 'Auth',
  }
)

export default createAppContainer(RootNavigator);
