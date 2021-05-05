import React from 'react';
import { Alert,Dimensions, FlatList, Keyboard, Modal, StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Content, Item, Input } from 'native-base';
import data from './data'

const DismissKeyBoard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const defaultFlag = data.filter(
  obj => obj.name === 'United States'
  )[0].flag

// Default render of country code
const defaultCode = data.filter(
  obj => obj.name === 'United States'
)[0].dial_code


class PhoneLoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      flag: defaultFlag,
      modalVisible: false,
      phoneNumber: defaultCode,
      backgroundColor: 'white',
      buttonBackgroundColor: '#C6125E',
    }
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
  }

  showModal() {
    this.setState({ modalVisible: true })
    // console.log('Shown')
  }
  hideModal() {
    this.setState({ modalVisible: false })
    // refocus on phone Input after selecting country and/or closing Modal
    this.refs.FourthInput._root.focus()
    // console.log('Hidden')
  }

  async getCountry(country) {
    const countryData = await data
    try {
      const countryCode = await countryData.filter(
        obj => obj.name === country
      )[0].dial_code
      const countryFlag = await countryData.filter(
        obj => obj.name === country
      )[0].flag
      // Set data from user choice of country
      this.setState({ phoneNumber: countryCode, flag: countryFlag })
      await this.hideModal()
    }
    catch (err) {
      console.log(err)
    }
  }

  handleNullFields() {
    Alert.alert("Please enter a valid phone number.")
  }

  handleUserChange(text) {

    if (this.state.phoneNumber===''){
      // render UK phone code by default when Modal is not open
      this.onChangeText('phoneNumber', defaultCode + text)
    } else {
      // render country code based on users choice with Modal
      this.onChangeText('phoneNumber', text)
    }
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  handlePassChange(text) {
    this.setState({password: text});
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

  async signInPhone() {
    const { phoneNumber } = this.state
    try {
      this.props.navigation.navigate('PassLogin', {'phoneNumber': phoneNumber})
    } catch (error) {
        console.log('Error signing in: ', error);
    }
  }

  async queryData() {
    try {
      await Auth.currentAuthenticatedUser()
      .then(async(user) => {
        const userData = await API.graphql(graphqlOperation(getBobaUser, { id: user.attributes.phone_number}))
        console.log(userData);
      })
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { backgroundColor, buttonBackgroundColor, flag, phoneNumber } = this.state
    const countryData = data
    return(
      <DismissKeyBoard>
        <SafeAreaView style={styles.container}>
          <Text style={styles.headerTitle}>Enter Phone Number</Text>
          <Item style={[styles.itemStyle, {backgroundColor: backgroundColor}]}>
            {/* country flag */}
            <View><Text style={{fontSize: 40}}>{flag}</Text></View>
            {/* open modal */}
            <Icon
              name="chevron-down"
              style={[styles.iconStyle, { marginLeft: 15}]}
              onPress={() => this.showModal()}
            />
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
              placeholder = "+14320984"
              placeholderTextColor = "grey"
              maxLength={40}
              keyboardType="phone-pad"
              autoFocus={true}
              returnKeyType='done'
              autoCapitalize='none'
              ref='FourthInput'
              value={this.state.phoneNumber}
              onChangeText={(val) => {
                if (this.state.phoneNumber===''){
                  // render UK phone code by default when Modal is not open
                  this.onChangeText('phoneNumber', defaultCode + val)
                } else {
                  // render country code based on users choice with Modal
                  this.onChangeText('phoneNumber', val)
                }}
              }
              onBlur = { () => this.onBlur()}
              onFocus = { () => this.onFocus()}
            />
            {/* Modal for country code and flag */}
            <Modal
              animationType="slide" // fade
              transparent={false}
              visible={this.state.modalVisible}>
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, paddingTop: 50, backgroundColor: 'white' }}>
                  <Icon name="close-sharp" style={{color: 'black',
                    fontSize: 24,
                    marginLeft: 20,
                    }} onPress={() => this.hideModal()}/>
                  <Text style={{marginBottom: "3%", marginLeft: 20, marginTop: "2%", color:'black', fontWeight: '400', fontSize: 30, textAlign: 'left', }}> Select a Country </Text>
                  <FlatList
                    data={countryData}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: "20%", paddingTop: "3%", paddingLeft: "7%", paddingRight: "7%", }}
                    renderItem={
                      ({ item }) =>
                        <TouchableWithoutFeedback
                          onPress={() => this.getCountry(item.name)}>
                          <View
                            style={
                              [
                                styles.countryStyle,
                                {
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between'
                                }
                              ]
                            }>
                            <Text style={{fontSize: 45}}>
                              {item.flag}
                            </Text>
                            <Text style={{fontSize: 20, color: 'black'}}>
                              {item.name} ({item.dial_code})
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                    }
                  />
                </View>
              </View>
            </Modal>
          </Item>
          <View style={{position: 'absolute',
                        marginTop:'90%'}}>
            <Button transparent onPress={() => this.props.navigation.navigate('GetStarted')}>
              <Text style={{color:'#42a1f5'}}> Create Account </Text>
            </Button>
          </View>
          <TouchableWithoutFeedback
            onPressIn = {() => this.onPressIn()}
            onPressOut = {() => this.onPressOut()}
            onPress={() => (this.state.phoneNumber.length >= 12 ? this.signInPhone() : this.handleNullFields())}>
            <View style={{ backgroundColor: buttonBackgroundColor, borderRadius: "55%", alignSelf: 'flex-end', marginRight: '8%', top:'-6%'}}>
              <Icon name="ios-arrow-forward" style={{fontSize: 40, color:'white', padding: 10, }}/>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </DismissKeyBoard>
    )
  }
}


const styles = StyleSheet.create({
  closeButtonStyle: {
    padding: 12,
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'black',
  },
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
    color:'black',
    fontWeight: '400',
    fontSize: 27,
    alignSelf: 'flex-start',
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
  itemStyle: {
    top: "-40%",
    marginBottom: 10,
    width: Dimensions.get('window').width/1.3,
  },
  iconStyle: {
    color: 'grey',
    fontSize: 20,
    marginRight: 15,
  },
  textContainer: {
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
  textInputStyle: {
    borderRadius: 8,
    fontWeight:'400',
    paddingLeft: 6,
    width: Dimensions.get('window').width/1.5,
    height: 50,
    backgroundColor:'white',
    alignItems: 'center',
    shadowOffset:{
      width:0.7,
      height:3
    },
    shadowColor:'grey',
    shadowOpacity:0.4,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 40,
  },
});

export default PhoneLoginScreen;
