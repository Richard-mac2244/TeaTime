import React, {useState} from 'react';
import Amplify, { API, Auth, graphqlOperation } from 'aws-amplify';
import { ActivityIndicator, Alert, Dimensions, FlatList, Keyboard, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Content, Item, Input } from 'native-base';
import { getBobaUser } from '../../graphql/queries';
import { createBobaUser } from '../../graphql/mutations';

const DismissKeyBoard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

class ConfirmationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: 'white',
      buttonBackgroundColor: '#C6125E',
      confirmationCode: '',
      errorMessage: '',
      password: null,
      username: '',
      signingIn: false,
      signInFail: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { username } = this.state;
    const signUpUserName = this.props.navigation.getParam('confirmCode', null);
    const loginUsername = this.props.navigation.getParam('loginConfirmCode', null);
    const pass = this.props.navigation.getParam('password', null);

    if(signUpUserName !== null) {
      this.setState({ username: signUpUserName,
                      password: pass },
                    () => console.log('signup path: ' + this.state.username))
    }
    else {
      this.setState({ username: loginUsername,
                      password: pass },
                    () => console.log('login path: ' + this.state.username))
    }
  }

  handleChange(text) {
    this.setState({ confirmationCode: text })
  }

  handleSubmit(text) {
    this.signIn();
  }

  async signIn() {
    const { confirmationCode, errorMessage, username, password } = this.state

    var code = confirmationCode;

    if(code !== null && code.length > 0) {
      try {
        this.setState({signingIn: true})
        let confirmedUser = this.confirmUserSignUp(username, code, password);

        this.props.navigation.navigate('Home')
      } catch (error) {
        this.setState({signingIn: false,
                        signInFail: true,
                        errorMessage: error.message},)
        console.log('error confirming sign up', error);
      }
    }
    else {
      this.setState({ errorMessage: -1,
                      signing: false,})
    }
  }

  async confirmUserSignUp(username, code, password) {
    let confirm = await Auth.confirmSignUp(username, code);
    let signIn = await Auth.signIn(username, password);

    try {
      await Auth.currentAuthenticatedUser()
      .then(async(user) => {
        const queryBobaUser = await API.graphql(graphqlOperation(getBobaUser, {id: user.attributes.sub}))

        if( queryBobaUser.data.getBobaUser === null ) {
          this.createBobaUser(user.attributes);
        }
        else {
          console.log('user has been created!');
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  async createBobaUser(attributes) {
    let nameArr = attributes.name.split(' ');
    let secondId = nameArr[0].charAt(0).toLowerCase()+nameArr[1]+attributes.sub;
    let count = 0;
    try {
      await API.graphql(graphqlOperation(createBobaUser, { input: {
          authenticated: attributes.email_verified,
          confirmed: attributes.email_verified,
          email: attributes.email.toLowerCase(),
          favorites: [],
          firstName: nameArr[0],
          secondaryId: nameArr[0].charAt(0).toLowerCase()+nameArr[1]+attributes.sub,
          id: attributes.sub,
          lastName: nameArr[1],
          phoneNumber: attributes.phone_number,
          review: [],
        }
      }))
      console.log('user created!');
    } catch(e) {
      console.log('error creating user', e);
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
    const { backgroundColor, buttonBackgroundColor, errorMessage, signingIn, signInFail } = this.state;

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
          placeholder="1234"
          placeholderTextColor = "grey"
          maxLength={40}
          returnKeyType='done'
          ref='FourthInput'
          onChangeText={(text) => this.handleChange(text)}
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
          placeholder="1234"
          placeholderTextColor = "grey"
          keyboardType='email-address'
          maxLength={40}
          returnKeyType='done'
          ref='FourthInput'
          onChangeText={(text) => this.handleChange(text)}
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
          <Text style={styles.headerTitle}>Enter Confirmation Code</Text>
          <Text style={styles.subHeaderTitle}>Confirmation code has been sent to email </Text>
          {errorMessage === -1  || signInFail ? wrongInput : input}
          {errorMessage === -1  || signInFail ? (signInFail ? <Text style={{ position: 'absolute', color: 'red', marginTop: "75%", width: Dimensions.get('window').width/1.3 }}> {errorMessage} </Text> :
          <Text style={{ position: 'absolute', color: 'red', marginTop: "75%", }}> Please enter a valid code </Text>) : null}
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
              {signingIn ? Activity : ArrowIcon}
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

export default ConfirmationScreen
