import React, {useState} from 'react';
import Amplify, { API, Auth, graphqlOperation } from 'aws-amplify';
import { ActivityIndicator, Alert, Dimensions, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Content, Item, Input } from 'native-base';

const DismissKeyBoard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

class VerifyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      prePassword: '',
      verifyPassword: ' ',
      backgroundColor: 'white',
      buttonBackgroundColor: '#C6125E',
      credentials: [],
      signInFail: false,
      signingIn: false,
    };
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handlePassSubmit = this.handlePassSubmit.bind(this);
  }

  componentDidMount() {
    const { credentials } = this.state;
    const prePassword = this.props.navigation.getParam('password', null);
    const preCredentials = this.props.navigation.getParam('credentials', null);
    var newCredentials = [...credentials];
    for(var i = 0; i < preCredentials.length; i++) {
      newCredentials.push(preCredentials[i]);
    }
    this.setState({credentials: newCredentials,
                    prePassword: prePassword},
                  () => console.log(this.state.credentials))
  }

  handlePassChange(text) {
    this.setState({verifyPassword: text});
  }

  handlePassSubmit(text) {
    this.setState({ verifyPassword: text });
    this.signUp();
  }

  async signUp() {
    const { credentials, errorMessage, prePassword, verifyPassword } = this.state;
    const name = credentials[0] + ' ' + credentials[1];
    const email = credentials[2];
    const username = credentials[3];
    const phone_number = credentials[3];
    const password = prePassword;

    if(prePassword === verifyPassword) {
      try {
        this.setState({signingUp: true})
        const { user } = await Auth.signUp({
            username,
            password,
            attributes: {
                email,
                name,          // optional
                phone_number,   // optional - E.164 number convention
                // other custom attributes
            }
        });
        this.props.navigation.navigate('Confirmation', {'confirmCode': username, 'password': verifyPassword});
      } catch (error) {
        this.setState({ signingUp: false,
                        signUpFail: true,
                        errorMessage: error.message})
        console.log('error signing up:', error);
      }
    }
    else {
      this.setState({ errorMessage: -1,
                      signingUp: false})
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
    const { backgroundColor, buttonBackgroundColor, errorMessage, password, signingUp, signUpFail } = this.state;

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
          ref='FirstInput'
          onChangeText={(val) => this.handlePassChange(val)}
          onSubmitEditing = {() => this.handlePassSubmit()}
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
          ref='SecondInput'
          onChangeText={(val) => this.handlePassChange(val)}
          onSubmitEditing = {() => this.handlePassSubmit()}
          onBlur = { () => this.onBlur()}
          onFocus = { () => this.onFocus()}
        />
        <Icon style = {{ color: 'red', fontSize: 25, marginRight: 10 }}name='close-circle' />
      </Item>
    )

    return(
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
              onPress={() => this.props.navigation.navigate('Password')}
            />
            <Text style={{ color:'black', fontWeight: '400', fontSize: 27, }}>Verify Password</Text>
            <Text style={styles.subHeaderTitle}> Password must match </Text>
          </View>
          {errorMessage === -1 || errorMessage.length > 1 ? wrongInput : input}
          {errorMessage === -1  || signUpFail ? (signUpFail ? <Text style={{ position: 'absolute', color: 'red', textAlign: 'center', width: Dimensions.get('window').width/1.3,
          marginTop: "75%" }}> {errorMessage} </Text> :
          <Text style={{ position: 'absolute', color: 'red', marginTop: "75%", }}> Passwords do not match </Text>) : null}
          <TouchableWithoutFeedback
            onPress = {() => this.signUp()}
            onPressIn = {() => this.onPressIn()}
            onPressOut = {() => this.onPressOut()}>
            <View style={{ backgroundColor: buttonBackgroundColor, borderRadius: "55%", alignSelf: 'flex-end', marginRight: '8%', top:'-3%'}}>
              {signingUp ? Activity : ArrowIcon}
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
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
    top: "42%",
    marginBottom: 10,
    width: Dimensions.get('window').width/1.3,
  },
  subHeaderTitle: {
    ...StyleSheet.absoluteFillObject,
    marginTop: "13%",
    position: 'absolute',
    color:'gray',
    fontSize: 14,
    alignSelf: 'flex-start',
    width: Dimensions.get('window').width/1.1,
  },
});

export default VerifyScreen
