import React, {useState} from 'react';
import Amplify, { API, Auth, graphqlOperation } from 'aws-amplify';
import { getBobaUser } from '../../../graphql/queries';
import { ActivityIndicator, Alert, Dimensions, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Content, Item, Input } from 'native-base';

const DismissKeyBoard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

class PasswordLoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: ' ',
      username: '',
      password: "",
      signingIn: false,
      signInFail: false,
      backgroundColor: 'white',
      buttonBackgroundColor: '#C6125E',

    };
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handlePassSubmit = this.handlePassSubmit.bind(this);
  }

  componentDidMount() {
    const phoneNumber = this.props.navigation.getParam('phoneNumber', null);
    this.setState({username: phoneNumber.toString()},
                  () => console.log(this.state.username))
  }

  handlePassChange(text) {
    this.setState({password: text});
  }

  handlePassSubmit(text) {
    const { password } = this.state
    this.signIn();
  }

  handleNullField() {
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

  goConfirm(msg) {
    const { username } = this.state;

    if(msg === ('User is not confirmed.')) {
      setTimeout(() => {
        this.props.navigation.navigate('Confirmation', { 'loginConfirmCode': username, 'password': password });
      }, 1500)
    }
  }

  async signIn() {
    const { errorMessage, username, password } = this.state
    if(password.length !== 0 && password !== null) {
      try {
        this.setState({signingIn: true})
        const user = await Auth.signIn(username, password);
        this.props.navigation.navigate('Home')
      } catch (error) {
          this.setState({signingIn: false,
                          signInFail: true,
                          errorMessage: error.message},
                        () => this.goConfirm(this.state.errorMessage))
          console.log('Error signing in: ', error.message);
      }
    }
    else {
      this.setState({errorMessage: -1,
                    signInFail: false},
                    () => console.log(this.state.signInFail))
    }
  }

  render() {
    const { backgroundColor, buttonBackgroundColor, errorMessage, password, signingIn, signInFail } = this.state;
    const ArrowIcon = (<Icon name="ios-arrow-forward" style={{fontSize: 39, color:'white', padding: 10, }}/>)
    const Activity = (<ActivityIndicator size="small" color="#fff" style={{ padding: 20.5 }} />)
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
          placeholder="Password"
          placeholderTextColor = "grey"
          maxLength={40}
          returnKeyType='search'
          autoCapitalize='none'
          secureTextEntry={true}
          autoFocus={true}
          ref='FirstInput'
          onChangeText={(val) => this.handlePassChange(val)}
          onSubmitEditing = {this.handlePassSubmit}
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
          placeholder="Password"
          placeholderTextColor = "grey"
          maxLength={40}
          returnKeyType='search'
          autoCapitalize='none'
          secureTextEntry={true}
          autoFocus={true}
          ref='SecondInput'
          onChangeText={(val) => this.handlePassChange(val)}
          onSubmitEditing = {this.handlePassSubmit}
          onBlur = { () => this.onBlur()}
          onFocus = { () => this.onFocus()}
        />
        <Icon style = {{ color: 'red', fontSize: 25, marginRight: 10 }}name='close-circle' />
      </Item>
    )

    return (
      <DismissKeyBoard>
        <SafeAreaView style={styles.container}>
          <View style={styles.headerTitle} >
            <Icon
              name="ios-arrow-back"
              style={{color: 'black',
                fontSize: 25,
                top:4,
                marginRight: 15,
                }}
              onPress={() => this.props.navigation.navigate('PhoneLogin')}
            />
            <Text style={{ color:'black',
            fontWeight: '400',
            fontSize: 27, }}>Enter Password</Text>
          </View>
          {errorMessage === -1  || signInFail ? wrongInput : input}
          {errorMessage === -1  || signInFail ? (signInFail ? <Text style={{ position: 'absolute', color: 'red', marginTop: "85%", }}> {errorMessage} </Text> :
          <Text style={{ position: 'absolute', color: 'red', marginTop: "132%", }}> Please enter a valid password </Text>) : null}
          <TouchableWithoutFeedback
            onPress = {() => this.signIn()}
            onPressIn = {() => this.onPressIn()}
            onPressOut = {() => this.onPressOut()}>
            <View style={{ backgroundColor: buttonBackgroundColor, borderRadius: "55%", alignSelf: 'flex-end', marginRight: '8%', top:'-6%'}}>
              {signingIn ? Activity : ArrowIcon}
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </DismissKeyBoard>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  },
  headerTitle: {
    ...StyleSheet.absoluteFillObject,
    marginLeft: 27,
    marginTop: "20%",
    position: 'absolute',
    alignSelf: 'flex-start',
    flexDirection:'row',
  },
  itemStyle: {
    top: "-40%",
    marginBottom: 10,
    width: Dimensions.get('window').width/1.3,
  },
});

export default PasswordLoginScreen
