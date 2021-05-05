import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Content, Item, Input } from 'native-base';

class GetStartedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonBackgroundColor: '#C6125E'
    }
  }

  onPressIn() {
    this.setState({
      buttonBackgroundColor: '#950C46'
    })
  }

  onPressOut() {
    this.setState({
      buttonBackgroundColor: '#C6125E'
    })
  }

  render() {
    const { buttonBackgroundColor } = this.state;
    return(
      <SafeAreaView style={styles.title}>
        <View style={{alignItems: "center",
                      justifyContent:'center',
                      top: -30,}}>
          <Text style={{marginBottom: 10, color: buttonBackgroundColor, fontSize: 20, fontWeight: '500' }}> Create an account with us! </Text>
          <Text> Start finding and reviewing boba </Text>
        </View>
        <View style={{
                      position: 'flex-end',
                      alignItems: "center",
                      justifyContent:'center',
                      textAlign: "center",}}>
          <TouchableWithoutFeedback
            onPress={() => this.props.navigation.navigate('FirstName')}
            onPressIn = {() => this.onPressIn()}
            onPressOut = {() => this.onPressOut()}>
            <View style={{ backgroundColor: buttonBackgroundColor, borderRadius: '10', flexDirection: 'row', height: 65, padding: 10, width: Dimensions.get('window').width/1.1}}>
              <Text style={{ fontWeight: '400', color:'white', fontSize: 25, flex: 1, paddingLeft: 20, textAlign: "center", top: 6,}}> Get Started </Text>
              <Icon name='ios-arrow-forward' style={{ color:'white', fontSize: 35, paddingLeft: 10, top: 5, }} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Button title="Back" onPress={() => this.props.navigation.navigate('PhoneLogin')} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
  },
});

export default GetStartedScreen
