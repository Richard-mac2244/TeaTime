import React, {useRef, useEffect} from 'react';
import { Animated, Button, Dimensions, Keyboard, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';

import ReviewsTextScreen from '../../src/Screens/Reviews/ReviewsTextScreen';
import ReviewsScreen from '../../src/Screens/Reviews/ReviewsScreen';
import SavedReviewsScreen from '../../src/Screens/Reviews/SavedReviewsScreen';
import PostedReviewsScreen from '../../src/Screens/Reviews/PostedReviewsScreen';
import FinishedReviewScreen from '../../src/Screens/Reviews/FinishedReviewScreen';
import ViewPostedReviewsScreen from '../../src/Screens/Reviews/ViewPostedReviewsScreen';

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

const TabNavigator = createMaterialTopTabNavigator();

function TopTabNavigator() {
  return (
    <TabNavigator.Navigator
      tabBarOptions={{
        labelStyle: { fontSize: 12, fontWeight: '500', },
        indicatorStyle: { backgroundColor: '#C6125E' },
    }}>
      < TabNavigator.Screen name="Posted" component={PostedReviewsScreen} />
      < TabNavigator.Screen name="Saved" component={SavedReviewsScreen} />
      < TabNavigator.Screen name="Select Shop" component={ReviewsScreen} />
    </TabNavigator.Navigator>
  );
}

const Stack = createStackNavigator();

function ReviewsStackNavigator() {
  return (
    <SafeAreaView style={{ flex:1, backgroundColor: 'white' }}>
      <View style={styles.title}>
        <NavigationContainer>
          <Stack.Navigator
          initialRouteName="ReviewsHome"
          headerMode="none"
          mode="modal"
          gestureEnabled="false">
            <Stack.Screen name="ReviewsHome" component={TopTabNavigator} />
            <Stack.Screen name="WriteReview" component={ReviewsTextScreen} />
            <Stack.Screen name="FinishedReview" component={FinishedReviewScreen} />
            <Stack.Screen name="ViewPostedReview" component={ViewPostedReviewsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaView>
  );
}

export default ReviewsStackNavigator;

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
})
