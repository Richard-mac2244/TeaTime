import React, {useState} from 'react';
import { Alert, Dimensions, FlatList, Keyboard, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Content, Item, Input } from 'native-base';

const DismissKeyBoard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

class FirstNameScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: 'white',
      buttonBackgroundColor: '#C6125E',
      errorMessage: ' ',
      credentials: [],
    };
    this.handleNameChange = this.handleNameChange.bind(this);
  }


  handleNameChange(text) {
    const { credentials } = this.state;
    var newCredentials = [ ...credentials ];
    newCredentials[0] = text;
    this.setState({ credentials: newCredentials })
  }

  handleSubmit(text) {
    this.signIn();
  }

  signIn() {
    const { errorMessage, credentials } = this.state
    const firstName = credentials[0];
    if(firstName !== null && firstName.length > 0) {
      this.props.navigation.navigate('LastName', {'firstName': credentials});
      this.setState({ errorMessage: 0 });
    }
    else {
      this.setState({ errorMessage: -1 })
    }
  }

  onFocus() {
    this.setState({
      backgroundColor: '#ededed'
    })
  }

  onBlur() {
    this.setState({
      backgroundColor: 'white'
    })
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
    const { backgroundColor, buttonBackgroundColor, errorMessage, } = this.state;

    const input = (
      <Item style={[styles.itemStyle, {backgroundColor: backgroundColor}]}>
        <View><Text style={{fontSize: 40, color:backgroundColor}}>hi</Text></View>
        <Input
          style={{
            fontSize: 17,
            fontWeight: 'bold',
            color: 'black',
            height:45,
            backgroundColor: backgroundColor,
            width: Dimensions.get('window').width/1.5,
            }}
          autoCompleteType='off'
          placeholder="Kevin"
          placeholderTextColor = "grey"
          maxLength={40}
          returnKeyType='done'
          ref='FourthInput'
          onChangeText={(text) => this.handleNameChange(text)}
          onSubmitEditing = {() => this.handleSubmit()}
          onBlur = { () => this.onBlur()}
          onFocus = { () => this.onFocus()}
        />
      </Item>
    )

    const wrongInput = (
      <Item error style={[styles.itemStyle, {backgroundColor: backgroundColor}]}>
        <View><Text style={{fontSize: 40, color:backgroundColor}}>hi</Text></View>
        <Input
          style={{
            fontSize: 17,
            fontWeight: 'bold',
            color: 'black',
            height:45,
            backgroundColor: backgroundColor,
            width: Dimensions.get('window').width/1.5,
            }}
          autoCompleteType='off'
          placeholder="Kevin"
          placeholderTextColor = "grey"
          keyboardType='email-address'
          maxLength={40}
          returnKeyType='done'
          ref='FourthInput'
          onChangeText={(text) => this.handleNameChange(text)}
          onSubmitEditing = {() => this.handleSubmit()}
          onBlur = { () => this.onBlur()}
          onFocus = { () => this.onFocus()}
        />
        <Icon style = {{ color: 'red', fontSize: 25, marginRight: 10 }}name='close-circle' />
      </Item>
    )

    return(
      <DismissKeyBoard>
        <SafeAreaView style={styles.container}>
          <Text style={styles.headerTitle}>Enter First Name</Text>
          <Text style={styles.subHeaderTitle}>First and initials of last name will be displayed.</Text>
          {(errorMessage === -1 ? wrongInput : input)}
          {errorMessage === -1  ? <Text style={{ position: 'absolute', color: 'red', marginTop: "130%", }}> Please enter a valid email </Text> : null}
          <TouchableWithoutFeedback
            onPressIn = {() => this.onPressIn()}
            onPressOut = {() => this.onPressOut()}
            onPress={() => (this.handleSubmit())}>
            <View style={{ backgroundColor: buttonBackgroundColor, borderRadius: "55%", alignSelf: 'flex-end', marginRight: '8%', top:'-3%'}}>
              <Icon name="ios-arrow-forward" style={{fontSize: 40, color:'white', padding: 10, }}/>
            </View>
          </TouchableWithoutFeedback>
          <View style={{position: 'flex-end',}}>
            <Button transparent onPress={() => this.props.navigation.navigate('PhoneLogin')}>
              <Text style={{color:'#42a1f5'}}> Login to Account </Text>
            </Button>
          </View>
        </SafeAreaView>
      </DismissKeyBoard>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 20,
    alignItems: "center",
    justifyContent: 'space-between',
    textAlign: "center",
    backgroundColor: '#fff',
  },
  headerTitle: {
    ...StyleSheet.absoluteFillObject,
    marginLeft: 27,
    marginTop: "20%",
    position: 'absolute',
    color:'black',
    fontWeight: '400',
    fontSize: 27,
    alignSelf: 'flex-start',
  },
  iconStyle: {
    color: 'grey',
    fontSize: 20,
    marginRight: 15,
  },
  itemStyle: {
    top: "42%",
    marginBottom: 10,
    width: Dimensions.get('window').width/1.3,
  },
  subHeaderTitle: {
    ...StyleSheet.absoluteFillObject,
    marginLeft: 27,
    marginTop: "32%",
    position: 'absolute',
    color:'gray',
    fontSize: 14,
    alignSelf: 'flex-start',
  },
});

export default FirstNameScreen
