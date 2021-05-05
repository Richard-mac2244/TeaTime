import React from 'react';
import { ActivityIndicator, Alert, AsyncStorage, FlatList, Button, Dimensions, Keyboard, SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { Avatar, List, ListItem, Rating } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Amplify, { API, Auth, graphqlOperation } from 'aws-amplify';
import { getBobaUser, getBobaShop, getBobaReview, listBobaReviews, listBobaShops } from '../../graphql/queries';
import { createBobaReview, updateBobaUser, updateBobaShop } from '../../graphql/mutations';

class ViewPostedReviewsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: 'white',
      buttonBackgroundColor: '#C6125E',
      bobaRating: null,
      bobaReviewId: null,
      hideComponent: false,
      loading: false,
      text: null,
      bobaReview: {},
    }
  }

  async componentDidMount(prevProps, prevState) {
    const { bobaReviewId, rating } = this.props.route.params;

    this.setState({ bobaReviewId: bobaReviewId,
                    bobaRating: rating,
                    loading: true,})

    if(prevState != this.state.loading){
      try {
        await Auth.currentAuthenticatedUser()
        .then(async(user) => {
          let filter = {
            address: {
              contains: 'Sacramento'
            }
          }
          const queryBobaReview = await API.graphql(graphqlOperation(getBobaReview, { id: bobaReviewId }));
          console.log(queryBobaReview);
          this.setState({ bobaReview: queryBobaReview.data.getBobaReview })

        })
      } catch (error) {
        console.log(error);
      }
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

  setIsPress() {
    this.setState({ buttonBackgroundColor: '#950C46'})
  }

  setIsNotPress() {
    this.setState({ buttonBackgroundColor: '#C6125E'})
  }

  renderBobaStars(rating) {
    return (
      <Rating style={styles.rating}
        readonly
        showRating={false}
        startingValue={rating}
        imageSize={35}/>
    )
  }

  render() {
    const { bobaRating, bobaReview } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.title}>
          <View style={styles.headerTitle} >
            <Icon
              name="ios-arrow-back"
              style={{color: 'black',
                fontSize: 25,
                top:4,
                marginRight: 15,
                }}
              onPress={ () => this.props.navigation.navigate('ReviewsHome', {screen: 'Posted'}) }
            />
            <Text style={styles.textTitle} > {bobaReview.bobaShopId} </Text>
          </View>
          {this.renderBobaStars(bobaReview.rating)}
          <View style={styles.input}>
            <Text> {bobaReview.Description} </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default ViewPostedReviewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
  },
  headerTitle: {
    top: 10,
    alignSelf: 'flex-start',
    left: 20,
  },
  input: {
    alignSelf: 'center',
    height: Dimensions.get('window').height/3.8,
    top: 50,
    padding: 10,
    width: Dimensions.get('window').width/1.1,

  },
  rating: {
    top: 30,
    left: -75,
  },
  title: {
    flex: 1,
    alignItems: 'center',
    fontSize: 20,
    backgroundColor: 'white',
  },
  textContainer: {
    alignSelf: 'center',
    flexDirection:'row',
    backgroundColor:'white',
    marginHorizontal: 25,
    shadowOffset:{
      width:0.7,
      height:2
    },
    shadowColor:'grey',
    shadowOpacity:0.3,
    position: 'absolute',
    top: Dimensions.get('window').height/50,
    width: Dimensions.get('window').width/1.2,
    borderRadius: 12,
    height: 40,
  },
  textTitle: {
    marginTop: 20,
    fontWeight: '900',
    fontSize: 25,
    textAlign: 'left',
  }
});
