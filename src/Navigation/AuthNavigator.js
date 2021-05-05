import { createStackNavigator } from 'react-navigation-stack';

import LoadingScreen from '../Screens/Loading/LoadingScreen';
import PhoneLoginScreen from '../Screens/Login/PhoneLogin/PhoneLoginScreen';
import PasswordLoginScreen from '../Screens/Login/PasswordLogin/PasswordLoginScreen';
import GetStartedScreen from '../Screens/CreateAccount/GetStarted/GetStartedScreen';
import FirstNameScreen from '../Screens/CreateAccount/Name/FirstNameScreen';
import LastNameScreen from '../Screens/CreateAccount/Name/LastNameScreen';
import EmailScreen from '../Screens/CreateAccount/Email/EmailScreen';
import PhoneNumberScreen from '../Screens/CreateAccount/PhoneNumber/PhoneNumberScreen';
import PasswordScreen from '../Screens/CreateAccount/Password/PasswordScreen';
import VerifyScreen from '../Screens/CreateAccount/VerifyPass/VerifyScreen';
import ConfirmationScreen from '../Screens/Confirm/ConfirmationScreen';

const AuthNavigatorConfig =  {
  initialRouteName: 'Load',
  header: null,
  headerMode: 'none',
  defaultNavigationOptions: {
    gestureEnabled: false,
  },
}

const RouteConfigs = {
  Load: LoadingScreen,
  PhoneLogin: PhoneLoginScreen,
  PassLogin: PasswordLoginScreen,
  GetStarted: GetStartedScreen,
  FirstName: FirstNameScreen,
  LastName: LastNameScreen,
  Email: EmailScreen,
  PhoneNumber: PhoneNumberScreen,
  Password: PasswordScreen,
  Verify: VerifyScreen,
  Confirmation: ConfirmationScreen,
}

const AuthNavigator = createStackNavigator(RouteConfigs, AuthNavigatorConfig);

export default AuthNavigator;
