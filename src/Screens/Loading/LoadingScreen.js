import React from 'react';
import Amplify, { API, Auth, graphqlOperation } from 'aws-amplify';
import { getBobaUser, getBobaShop } from '../../graphql/queries';
import { createBobaShop, updateBobaShop } from '../../graphql/mutations';
import { ActivityIndicator, Alert, Dimensions, ImageBackground, Keyboard, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import loadingBoba1 from '../../Images/loading_boba.jpg';

class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bobaData: [],
      loading: false,
      latitude: null,
      longitude: null,
    }
  }

  async componentDidMount(prevState, prevProp) {
    setTimeout(() => {
      this.signIn();
    }, 3000)

  }

  async signIn() {
    try {
      await Auth.currentAuthenticatedUser()
      .then(async(user) => {
        const userData = await API.graphql(graphqlOperation(getBobaUser, { id: user.attributes.phone_number}))
        this.props.navigation.navigate('Home')
      })
    } catch (error) {
      this.props.navigation.navigate('PhoneLogin')
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.title}>
        <ImageBackground source={require('../../Images/loading_boba.jpg')} style={styles.image}>
          <Text style={{marginTop: 85, marginLeft: 30, color:"black", fontWeight: '900', fontSize: 60, textAlign: 'left', }}> It's{'\n'}Tea{'\n'}Time </Text>
        </ImageBackground>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
  },
  title: {
    flex: 1,
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
});

export default LoadingScreen;
