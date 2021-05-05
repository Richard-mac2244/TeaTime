import React from 'react';
import { ActivityIndicator, Alert, AsyncStorage, FlatList, Button, Dimensions, Keyboard, SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { Avatar, List, ListItem, Rating } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Amplify, { API, Auth, graphqlOperation } from 'aws-amplify';
import { getBobaUser, getBobaShop, listBobaReviews, listBobaShops } from '../../graphql/queries';
import { createBobaReview, updateBobaUser, updateBobaShop } from '../../graphql/mutations';

class ReviewsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: 'white',
      buttonBackgroundColor: '#C6125E',
      hideComponent: false,
      loading: false,
      text: null,
      primaryId: null,
      secondaryId: null,
      bobaShop: {},
      bobaRating: 5,
    },
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount(prevProps, prevState) {
    const { primaryId, secondaryId } = this.props.route.params;

    this.setState({ primaryId: primaryId,
                    secondaryId: secondaryId,
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
          const queryBobaShop = await API.graphql(graphqlOperation(getBobaShop, {id: primaryId, secondaryId: secondaryId}));
          this.setState({ bobaShop: queryBobaShop.data.getBobaShop })

        })
      } catch (error) {
        console.log(error);
      }
    }
  }

  async findNextPageWithinShops(token) {
    const { bobaBoundary } = this.state;
    var bobaShopArr = [];

    const nextBobaShop = await API.graphql({ query: listBobaShops, variables: { token }});
    const bobaList = nextBobaShop.data.listBobaShops.items;
    for(var i = 0; i < bobaList.length; i++) {
      if(( bobaList[i].coordinates[0] <= bobaBoundary.N && bobaList[i].coordinates[0] >= bobaList[i].S ) && ( bobaList[i].coordinates[1] >= bobaBoundary.W && bobaListList[i].coordinates[1] <= bobaBoundary.E )) {
        var bobaInfo = {};

        const R = 6371e3; // metres
        const φ1 = lat * Math.PI/180; // φ, λ in radians
        const φ2 = bobaLat * Math.PI/180;
        const Δφ = (bobaLat-lat) * Math.PI/180;
        const Δλ = (bobaLong-long) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        const d = R * c; // metres
        const mi = (d / 1000) * 0.621371;

        bobaInfo["name"] = bobaList[i].secondaryId;
        bobaInfo["address"] = bobaList[i].address;
        bobaInfo["distance"] = parseFloat(mi.toFixed(2));;

        bobaShopArr.push(bobaInfo);
        console.log('token added')
      }
    }

    this.setState(prevState => ({
      bobaData: [...prevState.bobaData, bobaShopArr]
    }))

    if(nextBobaShop.data.listBobaShops.nextToken !== undefined) {
      this.findNextPageWithinShops(nextBobaShop.data.listBobaShops.nextToken);
    }
    return 'done';
  }

  handleBack() {
    this.setState({ hideComponent: true })
    Alert.alert(
      "Hold On!",
      "Your review is not completed! Press SAVE to save your draft and go back. Press REMOVE to remove your review and go back.",
      [
        {
          text: "Remove",
          onPress: () => this.props.navigation.navigate('ReviewsHome', {screen: 'Select Shop'}),
          style: "destructive"
        },
        { text: "Save", onPress: () => this.props.navigation.navigate('ReviewsHome', {screen: 'Select Shop'}) }
      ]
    );
  }

  handleEmpty() {
    this.setState({ hideComponent: true })
    Alert.alert(
      "Hold On!",
      "Please enter a description for your review!",
      [
        {
          text: "Ok",
          onPress: () => this.setState({ hideComponent: false }),
        }
      ]
    );
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

  onChangeHandler(e){
    e.preventDefault();
    this.setState({input: e.target.value});
  }

  handleChange(text) {
    text = text.trim();
    this.setState({text},
                  () => console.log(this.state.text));
  }

  async handleSubmit(event) {
    const { primaryId, secondaryId, text } = this.state;
    Keyboard.dismiss();

    if(text !== null) {
      try {
        await Auth.currentAuthenticatedUser()
        .then(async(user) => {
          const userId = user.attributes.sub;

          let bobaShopId = secondaryId.replace(/\s+/g, '');
          let partialBobaReviewId = userId + ' ' + bobaShopId;
          let bobaReviewId;
          let count = 0;
          let reviewCreated = false;

          let filter = {
            id: {
              contains: partialBobaReviewId
            }
          }

          const queryBobaReview = await API.graphql({query: listBobaReviews, variables: { filter: filter }});
          const bobaReviewList = queryBobaReview.data.listBobaReviews.items;

          if(bobaReviewList.length !== 0) {
            count = parseInt(this.getReviewIdCount(bobaReviewList)) + 1;
            reviewCreated = this.createBobaReview(count, userId, partialBobaReviewId);
            bobaReviewId = partialBobaReviewId + ' ' + count;
          }
          else {
            reviewCreated = this.createBobaReview(count, userId, partialBobaReviewId);
            bobaReviewId = partialBobaReviewId + ' ' + count;
          }

          if(reviewCreated) {
            this.updateUserReviewList(userId, bobaReviewId);
            this.updateBobaShopReviewList(userId);
            this.props.navigation.navigate('FinishedReview')
          }

        })
      } catch (error) {
        console.log(error);
      }
    }
    else {
      this.handleEmpty();
    }
  }

  async updateUserReviewList(userId, bobaReviewId) {
    try {
      const currentUser = await API.graphql(graphqlOperation(getBobaUser, { id: userId }));
      const currentUserData = currentUser.data.getBobaUser;

      const updateBobaReviewList = currentUserData.review;
      updateBobaReviewList.unshift(bobaReviewId);

      await API.graphql(graphqlOperation(updateBobaUser, { input: {
          authenticated: currentUserData.authenticated,
          confirmed: currentUserData.confirmed,
          email: currentUserData.email,
          favorites: currentUserData.favorites,
          firstName: currentUserData.firstName,
          secondaryId: currentUserData.secondaryId,
          id: currentUserData.id,
          lastName: currentUserData.lastName,
          phoneNumber: currentUserData.phoneNumber,
          review: updateBobaReviewList,
        }
      }))
      console.log('updated user review list!');
      return true;
    } catch(e) {
      console.log('error updating user review', e);
      return false;
    }
  }

  async updateBobaShopReviewList(userId) {
    const { bobaRating, primaryId, secondaryId } = this.state;

    try {
      const queryBobaShop = await API.graphql(graphqlOperation(getBobaShop, {id: primaryId, secondaryId: secondaryId}));
      const currentBobaShopData = queryBobaShop.data.getBobaShop;

      const updateBobaUserReviewList = currentBobaShopData.userReviews;
      updateBobaUserReviewList.unshift(userId);

      let bobaShopReviewCount = currentBobaShopData.reviewsCount + 1;

      await API.graphql(graphqlOperation(updateBobaShop, { input: {
          address: currentBobaShopData.address,
          coordinates: currentBobaShopData.coordinates,
          id: currentBobaShopData.id,
          secondaryId: currentBobaShopData.secondaryId,
          img: currentBobaShopData.img,
          reviewsCount: bobaShopReviewCount,
          userReviews: updateBobaUserReviewList,
          rating: currentBobaShopData.rating + bobaRating,
          weeklyRating: currentBobaShopData.weeklyRating,
        }
      }))
      console.log('updated bobaShop review list!');
      return true;
    } catch(e) {
      console.log('error updating bobaShop review', e);
      return false;
    }
  }

  async createBobaReview(count, userId, partialId) {
    const { bobaRating, secondaryId, text } = this.state;

    let bobaReviewId = partialId + ' ' + count;

    try {
      await API.graphql(graphqlOperation(createBobaReview, { input: {
          id: bobaReviewId,
          bobaShopId: secondaryId,
          bobaUserId: userId,
          rating: bobaRating,
          Description: text,
        }
      }))
      console.log('review created!');
      return true;
    } catch(e) {
      console.log('error creating review', e);
      return false;
    }
  }

  //sort in descending order based on date
  sortBy = function() {
    var toString = Object.prototype.toString,
    parse = function (x) { return x; },
    getItem = function (x) {
      var isObject = x != null && typeof x === "object";
      var isProp = isObject && this.prop in x;
      return this.parser(isProp ? x[this.prop] : x);
    }

    return function sortby ( array, cfg ) {
      if(!(array instanceof Array && array.length)) return [];
      if(toString.call(cfg) !== "[object Object]") cfg = {};
      if(typeof cfg.parser !== "function") cfg.parser = parse;
      cfg.desc = !!cfg.desc ? -1 : 1;
      return array.sort(function(a, b) {
        a = getItem.call(cfg, a);
        b = getItem.call(cfg, b);
        return cfg.desc * (a < b ? -1 : +(a > b));
      });
    };
  }();

  getReviewIdCount(bobaList) {
    var sortedList = this.sortBy(bobaList, {
      prop: "createdOn",
      desc: true,
      parser: function(item) { return new Date(item); }
    })
    console.log(sortedList);
    let lastBobaShop = bobaList[0].id;
    let lastId = lastBobaShop.split(' ');
    let count = lastId[lastId.length - 1];
    return count;
  }

  recordRating(rating) {
    this.setState({ bobaRating: rating },
                    () => console.log('Rating: ' + this.state.bobaRating));
  }

  renderBobaStars() {
    return (
      <Rating style={styles.rating}
        showRating={false}
        startingValue={5}
        imageSize={35}
        onFinishRating={ (rating) => this.recordRating(rating) }/>
    )
  }

  render() {
    const { bobaShop, buttonBackgroundColor, hideComponent, secondaryId } = this.state;

    const submitButton = (
      <TouchableWithoutFeedback
        onPressIn = {() => this.setIsPress()}
        onPressOut={() => this.setIsNotPress()}
        onPress={() => this.handleSubmit()}>
        <View style={{ backgroundColor: buttonBackgroundColor, borderRadius: "55%", justifyContent: 'center', position: 'absolute', top: Dimensions.get('window').height /2.2, width: Dimensions.get('window').width/2, height: 50,}}>
          <Text style={{ color: 'white', fontSize: 17,  fontWeight: '700', textAlign: 'center', }}> Submit </Text>
        </View>
      </TouchableWithoutFeedback>
    )

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
              onPress={ () => this.handleBack() }
            />
            <Text style={styles.textTitle} > {secondaryId} </Text>
          </View>
          {this.renderBobaStars()}
          <TextInput
            autoFocus={true}
            style={styles.input}
            value={this.state.value}
            placeholder="Write your review!"
            placeholderTextColor = "grey"
            onChangeText={(text) => this.handleChange(text)}
            multiline={true}
            underlineColorAndroid='transparent'
            onBlur = { () => this.onBlur() }
            onFocus = { () => this.onFocus() }
           />
           {hideComponent ? null : submitButton}
        </View>
      </SafeAreaView>
    );
  }
}

export default ReviewsScreen;

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
    height: Dimensions.get('window').height/4.2,
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
