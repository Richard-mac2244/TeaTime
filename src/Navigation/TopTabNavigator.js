import * as React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ReviewsScreen from '../../src/Screens/Reviews/ReviewsScreen';
import SettingScreen from '../../src/Screens/Setting/SettingScreen';

function SelectBobaShopScreen() {
  return (
    <View style={styles.textContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => this.props.navigation.navigate('Home')}
      >
        <Icon name = "ios-chevron-back" size = {20} style={{ top: Dimensions.get('window').height/55, marginLeft: Dimensions.get('window').width/30,  marginRight:15, color: 'grey'}}/>
      </TouchableOpacity>
        <TextInput
          autoCompleteType='off'
          placeholder = "Find nearby boba spots!"
          placeholderTextColor = "grey"
          onChangeText={(text) => this.handleChange(text)}
          onSubmitEditing = {this.handleSubmit}
          returnKeyType = 'search'
          style={{flex:2, fontWeight:'400', backgroundColor:'white', height:'100%'}}
        />
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Map')}
        >
        <Icon name = "ios-options" size = {20} style={{ top: Dimensions.get('window').height/55, marginLeft: Dimensions.get('window').width/100,  marginRight:12, color: 'grey'}}/>
      </TouchableOpacity>
      <Text>Select a boba shop!</Text>
    </View>
  );
}

function SavedReviewsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const TabNavigator = createMaterialTopTabNavigator();

function TopTabNavigator() {
  return (
    <SafeAreaView style={{ flex:1, backgroundColor: 'white' }}>
      <View style={styles.title}>
        <NavigationContainer >
          <TabNavigator.Navigator
            tabBarOptions={{
              labelStyle: { fontSize: 12, fontWeight: '500', },
              indicatorStyle: { backgroundColor: '#C6125E' },
              tabStyle: { width: Dimensions.get('window').width/2 },
          }}>
            <TabNavigator.Screen name="Select Shop" component={ReviewsScreen} />
            <TabNavigator.Screen name="Saved Reviews" component={SavedReviewsScreen} />
          </TabNavigator.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaView>
  );
}

export default TopTabNavigator;

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
});
