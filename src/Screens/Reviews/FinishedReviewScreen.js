import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Content, Item, Input } from 'native-base';

class FinishedReviewScreen extends React.Component {
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
        <ConfettiCannon count={300} origin={{x: -10, y: -20}} fadeOut={true} fallSpeed={ 3000 } autoStart={true}/>
        <View style={{alignItems: "center",
                      justifyContent:'center',
                      top: -30,}}>
          <Text style={{marginBottom: 10, color: '#C6125E', fontSize: 20, fontWeight: '500', textAlign: 'center'}}> Congrats! </Text>
          <Text style={{textAlign: 'center'}}> Your review has successfully been posted! </Text>
        </View>
        <View style={{
                      alignItems: "center",
                      justifyContent:'center',
                      textAlign: "center",}}>
          <TouchableWithoutFeedback
            onPress={ () => this.props.navigation.navigate('ReviewsHome', {screen: 'Select Shop'}) }>
            <View style={{ alignItems: 'center', backgroundColor: buttonBackgroundColor, borderRadius: '90', flexDirection: 'row', height: 50, justifyContent: 'center', padding: 10, width: Dimensions.get('window').width/2.3}}>
              <Text style={{ fontWeight: '700', color:'white', fontSize: 20, textAlign: 'center'}}> Done </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
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

export default FinishedReviewScreen
