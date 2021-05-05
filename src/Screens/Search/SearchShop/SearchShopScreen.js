import React from 'react';
import { ActivityIndicator, Alert, Animated, AsyncStorage, FlatList, Button, Dimensions, ImageBackground, Keyboard, SafeAreaView, ScrollView, StyleSheet, View, TextInput, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { Avatar, List, ListItem, Rating } from 'react-native-elements';
import { Container, Header, Content, CheckBox, Text, Body } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Amplify, { API, Auth, graphqlOperation } from 'aws-amplify';
import { getBobaUser, getBobaReview, getBobaShop } from '../../../graphql/queries';

class SearchShopScreen extends React.Component {
  animation = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.state = {
      bobaShop: {},
      bobaRating: null,
      bobaUserList: [],
      buttonBackgroundColor: '#C6125E',
      distance: null,
      loadDetails: true,
      loading: false,
      primaryId: null,
      secondaryId: null,
      userReviews: [],
    }
  }

  async componentDidMount(prevProps, prevState) {
     setTimeout( () => {
      this.setTimePassed();
    },1200);

    const primaryId = this.props.navigation.getParam('primaryId', null);
    const secondaryId= this.props.navigation.getParam('secondaryId', null);
    const distance = this.props.navigation.getParam('distance', null);

    this.setState({ primaryId: primaryId,
                    secondaryId: secondaryId,
                    distance: distance,
                    loading: true,})

    if(prevState != this.state.loading){
      try {
        await Auth.currentAuthenticatedUser()
        .then(async(user) => {
          const queryBobaShop = await API.graphql(graphqlOperation(getBobaShop, { id: primaryId, secondaryId: secondaryId }));
          const bobaShopDetails = queryBobaShop.data.getBobaShop;

          let bobaUserArr;

          if( bobaShopDetails.userReviews.length !== 1 ) {
            bobaUserArr = this.addUniqueUsers(bobaShopDetails.userReviews);
          }

          let bobaReviews;
          if( bobaUserArr !== null && bobaUserArr !== undefined && bobaUserArr.length > 0) {
            bobaReviews = await this.getAllBobaUserReviews(bobaUserArr, secondaryId);
          }

          let retrievedBobaReviews;
          if(bobaReviews !== null && bobaUserArr !== undefined && bobaReviews.length > 0) {
            retrievedBobaReviews = await this.retrieveAllBobaReviews(bobaReviews);
          }

          this.setState({ bobaShop: bobaShopDetails,
                          bobaUserList: bobaShopDetails.userReviews,
                          bobaRating: bobaShopDetails.rating,
                          userReviews: retrievedBobaReviews},
                        () => console.log(this.state.userReviews));

        })
      } catch (error) {
        console.log(error);
      }
    }
  }

  setTimePassed() {
    this.setState({ loadDetails: false });
  }

  async retrieveAllBobaReviews(revs) {
    let bobaReviewData = [];

    for(let i = 0; i < revs.length; i++) {
      try {
        let adjustedRevData = {};
        const queryBobaReview = await API.graphql(graphqlOperation(getBobaReview, { id: revs[i] }));
        adjustedRevData = queryBobaReview.data.getBobaReview;
        let userId = adjustedRevData.bobaUserId;
        const queryBobaUser = await API.graphql(graphqlOperation(getBobaUser, { id: userId }));
        let firstName = queryBobaUser.data.getBobaUser.firstName;
        adjustedRevData['firstName'] = firstName;
        bobaReviewData.push(adjustedRevData);
      }
      catch(e) {
        console.log(e);
      }
    }

    return bobaReviewData;

  }

  getAllBobaUserReviews = async(bobaUsers, shopId) => {
    let userReviewForBobaShop = [];
    let trimShopId = shopId.replace(/\s+/g, '');

    for(let i = 0; i < bobaUsers.length; i++) {
      try {
        const queryBobaUserReviews = await API.graphql(graphqlOperation(getBobaUser, { id: bobaUsers[i] }));
        let currUserBobaReviews = queryBobaUserReviews.data.getBobaUser.review;
        let currUserReviewForBobaShop = this.getBobaShopReviews(currUserBobaReviews, trimShopId);

        userReviewForBobaShop = userReviewForBobaShop.concat(currUserReviewForBobaShop);
      }
      catch(e) {
        console.log(e);
      }
    }

    return userReviewForBobaShop;
  }

  getBobaShopReviews(reviewList, shopId) {
    let bobaReviews = [];

    for( let j = 0; j < reviewList.length; j++) {
      let splitStr = reviewList[j].split(' ');
      if( splitStr[1] === shopId ) {
        bobaReviews.push(reviewList[j]);
      }
    }

    return bobaReviews;
  }

  addUniqueUsers(bobaUsers) {
    let bobaUserArr = [];

    for(let i = 0; i < bobaUsers.length; i++) {
      if(!bobaUserArr.includes(bobaUsers[i]) && bobaUsers[i] !== 'adminUser') {
        bobaUserArr.push(bobaUsers[i]);
      }
    }

    return bobaUserArr;
  }

  renderDate = (date) => {
    var d = new Date(date.substring(0, date.indexOf('T')));
    var str = d.toString();
    var dateArr = str.split(' ');
    var returnDate = dateArr[0] + ' ' + dateArr[1] + ' ' + dateArr[2] + ', ' + dateArr[3];
    return(
      <Text style={{ color: 'grey',}}> Created On: {returnDate} </Text>
    )
  }

  renderRating = () => {
    const { bobaShop, bobaRating, bobaUserList } = this.state;
    let bobaUserArrLen = bobaUserList.length - 1;
    let bobaStars;

    if(bobaUserArrLen === -1 || bobaUserArrLen === 0) {
      bobaUserArrLen = 0;
      bobaStars = 0;
    }
    else {
      bobaStars = bobaRating / bobaUserArrLen;
    }

    return (
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 15}}>
        {this.renderBobaStars(bobaStars)}
        {bobaUserArrLen === 1 ? <Text> {bobaUserArrLen} Review </Text> : <Text> {bobaUserArrLen} Reviews </Text>}
      </View>
    )
  }

  renderBobaStars(rating) {
    return (
      <Rating style={{marginRight: 10,}}
        readonly
        showRating={false}
        startingValue={rating}
        imageSize={20}/>
    )
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  renderUserReviews = (index, item) => {
    return (
      <View key={index} style={{marginBottom: 10,  marginLeft: 13, marginTop: 15, flexDirection: 'column', alignItems:'flex-start'}}>
        {this.renderBobaStars(item.rating)}
        <View style={{flexDirection: 'row', marginTop: 5, }}>
          <Text style={{ fontWeight: 'bold', }}>{item.firstName}</Text>
          {this.renderDate(item.createdOn)}
        </View>
        <Text style={{marginTop: 2 }}> {item.Description} </Text>
      </View>
    )
  }

  renderBobaShopDetails = () => {
    const { bobaShop, bobaUserList, distance, userReviews } = this.state;
    let bobaUserArrLen = bobaUserList.length - 1;
    return (
      <View style={{}}>
        <Text style={{ color: 'black', fontSize: 35, fontWeight: '700', marginLeft: 10, textAlign: 'left', }} > { bobaShop.secondaryId } </Text>
        <View style={styles.horizontalLine}/>
        {this.renderRating()}
        <View style={styles.horizontalLine}/>
        <Text style={{ textAlign: 'left', marginLeft: 11,  }} >{ bobaShop.address } </Text>
        <Text style={{ textAlign: 'left', marginLeft: 11, fontWeight: '700' }} > { distance } mi </Text>
        <View style={styles.horizontalLine}/>
        {bobaUserArrLen === 1 ? <Text style={{ textAlign: 'left', marginBottom: 6, marginLeft: 11, fontWeight: '700', fontSize: 25}} > (0) Reviews </Text> : <Text style={{ textAlign: 'left', marginBottom: 6, marginLeft: 11, fontWeight: '700', fontSize: 25}} > ({bobaUserArrLen}) Reviews </Text>}
        {userReviews !== undefined && userReviews !== null && userReviews.length > 0 ? (userReviews.map((item, index) => this.renderUserReviews(index, item))) : null}
      </View>
    )
  }

  render() {
    const { bobaShop, bobaUserList, buttonBackgroundColor, loadDetails } = this.state;

    let bobaUserArrLen = bobaUserList.length - 1;

    let renderDetails;

    if(loadDetails) {
      renderDetails = (
        <View style={styles.title}>
          <ActivityIndicator size="large" color="" />
        </View>
      )
    }
    else {
      renderDetails = (
        <View style={styles.container}>
          <ScrollView style={styles.scrollContainer}
            alwaysBounceVertical={false}
            bounces={false}>
            <View style={styles.backgroundImage}>
              <ImageBackground source={require('../../../Images/homeBoba_2.jpg')} style={styles.image}/>
            </View>
            {this.renderBobaShopDetails()}
          </ScrollView>
          <View style={styles.footer}>
            <TouchableWithoutFeedback
              onPress={ () => this.props.navigation.navigate('Reviews', {screen: 'ReviewsHome'}) }>
              <View style={{ alignItems: 'center', backgroundColor: buttonBackgroundColor, borderRadius: "55%", justifyContent: 'center', marginBottom: 12, width: Dimensions.get('window').width/1.7, height: 50,}}>
                <Text style={{ color: 'white', fontSize: 16,  fontWeight: '700', textAlign: 'center', }}> Write a Review! </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        {renderDetails}
      </View>
    );
  }
}

export default SearchShopScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    marginBottom: 20,
    width: '100%',
    height: Dimensions.get('window').height / 3 ,
    shadowOffset:{
      width:0.7,
      height:3
    },
    shadowColor:'grey',
    shadowOpacity:0.4,
  },
  container: {
    flex:1,
    flexDirection:'column',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  footer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopColor: '#CED0CE',
    borderTopWidth: 1,
    height: 80,
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  horizontalLine: {
    alignSelf: 'center',
    borderBottomColor: '#CED0CE',
    borderBottomWidth: 1.3,
    marginTop: 12,
    marginBottom: 12,
    opacity: 0.5,
    width: Dimensions.get('window').width/1.1,
  },
  image: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  scrollContainer: {
    flex: 1,
  },
  title: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
