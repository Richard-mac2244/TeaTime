import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Stack from './StackNavigator';
import ReviewsStackNavigator from './ReviewsStackNavigator';

import CameraScreen from '../../src/Screens/Camera/CameraScreen';
import ReviewsScreen from '../../src/Screens/Reviews/ReviewsScreen';
import SettingScreen from '../../src/Screens/Setting/SettingScreen';

const BottomTabNavigatorConfig = {
  initialRouteName: 'Home',
  header: null,
  headerMode: 'none',
  tabBarOptions: {
    showLabel: false,
    activeTintColor: 'black',
    inactiveTintColor: '#BFBFBF'
  },
}

const RouteConfigs = {
  Home: {
    screen: Stack,
    navigationOptions:{
          tabBarLabel:'Home',
          tabBarIcon:({tintColor, focused})=>(
              <Icon name={ focused ? "ios-home" : "ios-home"} color={tintColor} size={25}/>
          )
        }
  },
  Reviews: {
    screen: ReviewsStackNavigator,
    navigationOptions:{
          tabBarLabel:'Reviews',
          tabBarIcon:({tintColor, focused})=>(
              <Icon name={ focused ? "ios-create-outline" : "ios-create-outline"} color={tintColor} size={25}/>
          )
        }
  },
  Camera: {
    screen: CameraScreen,
    navigationOptions:{
          tabBarLabel:'Camera',
          tabBarIcon:({tintColor, focused})=>(
              <Icon name={focused ? "ios-camera" : "ios-camera"} color={tintColor} size={27}/>
          )
        }
  },
  Setting: {
    screen: SettingScreen,
    navigationOptions:{
          tabBarLabel:'Setting',
          tabBarIcon:({tintColor, focused})=>(
              <Icon name={focused ? "ios-settings" : "ios-settings" } color={tintColor} size={25}/>
          )
        },
  },
}

const AppNavigator = createBottomTabNavigator(RouteConfigs, BottomTabNavigatorConfig);

export default AppNavigator;
