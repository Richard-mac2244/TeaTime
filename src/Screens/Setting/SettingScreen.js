import React from 'react';
import { AsyncStorage } from 'react-native';
import { Button, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { Auth } from 'aws-amplify';

class SettingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }


  signOutAsync = async() => {
    try {
        await Auth.signOut();
        this.props.navigation.navigate('PhoneLogin')
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }
  render() {
    return (
      <SafeAreaView style = {styles.title}>
        <Text> This is the setting screen </Text>
        <Button title = "Sign Out" onPress={this.signOutAsync} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  },
});

export default SettingScreen;
