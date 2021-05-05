import React, {useState} from 'react';
import { Alert, Dimensions, FlatList, Keyboard, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
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

class PhoneNumberScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: 'white',
      buttonBackgroundColor: '#C6125E',
      errorMessage: ' ',
      flag: defaultFlag,
      modalVisible: false,
      phoneNumber: defaultCode,
      credentials: [],
    };
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
  }

  componentDidMount() {
    const { credentials } = this.state;
    const email = this.props.navigation.getParam('email', null);
    var newCredentials = [...credentials];
    for(var i = 0; i < email.length; i++) {
      newCredentials.push(email[i]);
    }
    this.setState({credentials: newCredentials},
                  () => console.log(this.state.credentials))
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

  handlePhoneChange(key, value) {
    const { credentials } = this.state;
    var newCredentials = [ ... credentials ];
    newCredentials[3] = value
    this.setState({
      [key]: value,
      credentials: newCredentials,
    })
  }

  handleSubmit(text) {
    this.signIn();
  }

  signIn() {
    const { credentials, errorMessage, phoneNumber } = this.state
    console.log(credentials);
    if(phoneNumber.length >= 12 && phoneNumber.length !== 0 && phoneNumber !== null) {
      this.props.navigation.navigate('Password', {'phoneUsername': credentials});
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
    const { backgroundColor, buttonBackgroundColor, errorMessage, flag } = this.state;
    const countryData = data

    const modal = (
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
    )
    const input = (
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
          placeholder="+14320984"
          placeholderTextColor = "grey"
          maxLength={40}
          keyboardType="phone-pad"
          returnKeyType='done'
          ref='FourthInput'
          value={this.state.phoneNumber}
          onChangeText={(val) => {
            if (this.state.phoneNumber===''){
              // render UK phone code by default when Modal is not open
              this.handlePhoneChange('phoneNumber', defaultCode + val)
            } else {
              // render country code based on users choice with Modal
              this.handlePhoneChange('phoneNumber', val)
            }}
          }
          onSubmitEditing = {this.handlePhoneSubmit}
          onBlur = { () => this.onBlur()}
          onFocus = { () => this.onFocus()}
        />
        {modal}
      </Item>
    )

    const wrongInput = (
      <Item error style={[styles.itemStyle, {backgroundColor: backgroundColor}]}>
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
          placeholder="+14320984"
          placeholderTextColor = "grey"
          maxLength={40}
          keyboardType="phone-pad"
          returnKeyType='done'
          ref='FourthInput'
          value={this.state.phoneNumber}
          onChangeText={(val) => {
            if (this.state.phoneNumber===''){
              // render UK phone code by default when Modal is not open
              this.handlePhoneChange('phoneNumber', defaultCode + val)
            } else {
              // render country code based on users choice with Modal
              this.handlePhoneChange('phoneNumber', val)
            }}
          }
          onBlur = { () => this.onBlur()}
          onFocus = { () => this.onFocus()}
        />
        {modal}
        <Icon style = {{ color: 'red', fontSize: 25, marginRight: 10 }}name='close-circle' />
      </Item>
    )

    return(
      <DismissKeyBoard>
        <SafeAreaView style={styles.container}>
          <View style={styles.headerTitle}>
            <Icon
              name="ios-arrow-back"
              style={{color: 'black',
                fontSize: 25,
                top:4,
                marginRight: 15,
                }}
              onPress={() => this.props.navigation.navigate('Email')}
            />
            <Text style={{ color:'black', fontWeight: '400', fontSize: 27, }}>Enter Phone Number</Text>
          </View>
          <Text style={styles.subHeaderTitle}>This phone number will be used to login.</Text>
          {(errorMessage === -1 ? wrongInput : input)}
          {errorMessage === -1  ? <Text style={{ position: 'absolute', color: 'red', marginTop: "75%", }}> Please enter a valid password </Text> : null}
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
    justifyContent: "space-between",
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
    flexDirection:'row',
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

export default PhoneNumberScreen
