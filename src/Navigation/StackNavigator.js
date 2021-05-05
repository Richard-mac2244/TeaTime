import React, {useRef, useEffect} from 'react';
import { Animated, Button, Dimensions, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
import { createStackNavigator, HeaderStyleInterpolators } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import SearchScreen from '../../src/Screens/Search/SearchScreen';
import SearchShopScreen from '../../src/Screens/Search/SearchShop/SearchShopScreen';
import HomeScreen from '../../src/Screens/Home/HomeScreen';
import MapScreen from '../../src/Screens/Map/MapScreen';
import DescriptionScreen from '../../src/Screens/Description/DescriptionScreen';

const StackNavigatorConfig = {
  initialRouteName: 'Home',
  headerMode:'screen',
}

const RouteConfigs = {
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
      gestureEnabled: false,
    }),
  },
  Search: {
    screen: SearchScreen,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
      gestureEnabled: false,
    }),
  },
  Shop: {
    screen: SearchShopScreen,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
      gestureEnabled: true,
    }),
  },
  Map: {
    screen: MapScreen,
    navigationOptions: ({ navigation }) => ({
        header: () => {
          return (
            <View style={styles.textContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
              >
                <Icon name = "ios-chevron-back" size = {20} style={{ top: Dimensions.get('window').height/55, marginLeft: Dimensions.get('window').width/30,  marginRight:15, color: 'grey'}}/>
              </TouchableOpacity>
                <TextInput
                  placeholder = "Find nearby boba spots!"
                  placeholderTextColor = "grey"
                  onFocus = {() => navigation.navigate('Search')}
                  style={{flex:1, fontWeight:'400', backgroundColor:'transparent', }}
                />
              <TouchableOpacity
                onPress={() => navigation.navigate('Map')}
                >
                <Icon name = "ios-options" size = {20} style={{ top: Dimensions.get('window').height/55, marginLeft: Dimensions.get('window').width/100,  marginRight:12, color: 'grey'}}/>
              </TouchableOpacity>
            </View>
          );
      },
    }),
  },
  Description: {
    screen: DescriptionScreen,

  },
}

const StackNavigator = createStackNavigator(RouteConfigs, StackNavigatorConfig);

StackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let mode = 'card';
  if (navigation.state.index > 0 && navigation.state.index < 3) {
    tabBarVisible = false;
  }

  if(navigation.state.index === 1) {
    mode = 'modal';
  }

  return {
    mode,
    tabBarVisible,
  };
};

export default StackNavigator;

const styles = StyleSheet.create({
  textContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection:'row',
    backgroundColor:'#C6125E',
    marginHorizontal: 25,
    shadowOffset:{
      width:0.7,
      height:3
    },
    shadowColor:'grey',
    shadowOpacity:0.4,
    position:'absolute',
    top: Dimensions.get('window').height/12,
    width: Dimensions.get('window').width/1.2,
    borderRadius: 13,
    height: 50,
  },
  textContainerPressed: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection:'row',
    backgroundColor:'#950C46',
    marginHorizontal: 25,
    shadowOffset:{
      width:0.7,
      height:3
    },
    shadowColor:'grey',
    shadowOpacity:0.4,
    position:'absolute',
    top: Dimensions.get('window').height/12,
    width: Dimensions.get('window').width/1.2,
    borderRadius: 13,
    height: 50,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    top: Dimensions.get('window').height/4,
  },
})
