import React, { useRef, useEffect } from 'react';
import { Animated, Button, Dimensions, Image, ImageBackground, Keyboard, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Body, Container, Content, Card, CardItem, Header, Left } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { Rating } from 'react-native-elements';
import Amplify, { API, Auth, graphqlOperation } from 'aws-amplify';
import { getBobaUser, listBobaShops } from '../../graphql/queries';
import { withOAuth, Authenticator, SignIn } from 'aws-amplify-react-native';

import homeBoba0 from '../../Images/homeBoba.png';
import homeBoba1 from '../../Images/homeBoba_2.jpg';

const DismissKeyBoard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

class HomeScreen extends React.Component {
  scrollY = new Animated.Value(0);
  constructor(props) {
    super(props);
    this.state = {
      buttonBackgroundColor: '#C6125E',
      discoverBobaList: [],
      inset: 0,
      loading: false,
      latitude: null,
      longitude: null,
      popularBobaList: [],
      yOffset: new Animated.Value(0),
    }
  }

  async componentDidMount(prevProps, prevState) {
    if(prevState === this.state.buttonBackgroundColor) {
      this.setState({ buttonBackgroundColor: '#C6125E' })
    }
    var lat;
    var long;
    let coord = navigator.geolocation.getCurrentPosition(
      positions => {
        if(prevState != this.state.loading) {
          lat = JSON.stringify(positions.coords.latitude);
          long = JSON.stringify(positions.coords.longitude);
          this.setState({ loading: true,
                          latitude: JSON.stringify(positions.coords.latitude),
                          longitude: JSON.stringify(positions.coords.longitude)},
                          () => console.log(this.state.latitude + ' ' + this.state.longitude));
        }
        else {
          console.log("location set")
        }
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    if(prevState != this.state.loading){
      try {
        await Auth.currentAuthenticatedUser()
        .then(async(user) => {

          const queryBobaShop = await API.graphql(graphqlOperation(listBobaShops))
          const listBobaShop = queryBobaShop.data.listBobaShops.items;

          var closestShopList = this.findClosestShops(listBobaShop, lat, long);
          var sortedList = this.quickSort(closestShopList, 0, closestShopList.length - 1);

          var randomShopList = this.findRandomShops(closestShopList);

          this.setState({ popularBobaList: sortedList.slice(0,5),
                          discoverBobaList: randomShopList, });
        })
      } catch (error) {
        console.log(error);
      }
    }
  }

  findRandomShops(bobaShops) {
    var limit = bobaShops.length;

    var randomList = [];
    var dupNum = [];

    while(randomList.length !== 5) {
      var random = Math.floor(Math.random() * Math.floor(limit));
      if(!dupNum.includes(random)) {
        dupNum.push(random);
        randomList.push(bobaShops[random]);
        limit--;
      }
    }

    return randomList;
  }

  findClosestShops(bobaShops, lat, long) {
    var closestShop = [];

    for(var i = 0; i < bobaShops.length; i++) {
      var bobaLat = bobaShops[i].coordinates[0];
      var bobaLong = bobaShops[i].coordinates[1];
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

      closestShop.push(bobaShops[i]);
    }

    return closestShop;
  }

  swap(bobaShops, leftInd, rightInd) {
    var temp = bobaShops[leftInd];
    bobaShops[leftInd] = bobaShops[rightInd];
    bobaShops[rightInd] = temp;
  }

  partition(bobaShops, leftInd, rightInd) {
    var pivot = bobaShops[Math.floor((rightInd + leftInd) / 2)].rating,
      i = leftInd,
      j = rightInd;

    while( i <= j ) {

      while(bobaShops[i].rating > pivot) {
        i++;
      }

      while(bobaShops[j].rating < pivot) {
        j--;
      }

      if(i <= j) {
        this.swap(bobaShops, i, j);
        i++;
        j--;
      }
    }

    return i;
  }

  quickSort(bobaShops, leftInd, rightInd) {
    var index;

    if(bobaShops.length > 1) {
      index = this.partition(bobaShops, leftInd, rightInd);

      if(leftInd < index - 1) {
        this.quickSort(bobaShops, leftInd, index - 1);
      }

      if(index < rightInd) {
        this.quickSort(bobaShops, index, rightInd);
      }
    }

    return bobaShops;
  }

  setIsPress() {
    this.setState({ buttonBackgroundColor: '#C6125E'})
  }

  setIsNotPress() {
    this.setState({ buttonBackgroundColor: '#950C46'})
  }

  navigateColor() {
    const { latitude, longitude } = this.state;
    this.setState({ buttonBackgroundColor: '#C6125E'});
    this.props.navigation.navigate('Search', {'latitude': latitude, 'longitude': longitude });
  }

  navigateReviews() {
    const { latitude, longitude } = this.state;
    this.props.navigation.navigate('Reviews', {'latitude': latitude, 'longitude': longitude });
  }

  getHeaderOpacity() {
    return(
      this.scrollY.interpolate({
        inputRange: [0, 107.5, 215],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp',
        useNativeDriver: true,
      })
    )
  }
  getButtonTopPosition() {
    return(
      this.scrollY.interpolate({
        inputRange: [0, 107.5, 215],
        outputRange: [0, -107.5, Platform.OS === 'ios' ? -215 : -120],
        extrapolate: 'clamp',
        useNativeDriver: true,
      })
    )
  }

  getImageTopPosition() {
    return(
      this.scrollY.interpolate({
        inputRange: [-1000, -750, -500, 0, 80, Dimensions.get('window').height / 2.3 + 150],
        outputRange: [-800, -600, -400, 0, 4.5, Platform.OS === 'ios' ? 8 : 10],
        extrapolate: 'clamp',
        useNativeDriver: true,
      })
    )
  }

  getImageOpacity() {
    return(
      this.scrollY.interpolate({
        inputRange:[0, 40, 80, Dimensions.get('window').height / 2.3 - 65],
        outputRange: [1, 0.7, 0.5, 0],
        extrapolate: 'clamp',
        useNativeDriver: true,
      })
    )
  }

  getImageScale() {
    return(
      this.scrollY.interpolate({
        inputRange: [-3000, -2000, -1000, 0],
        outputRange: [7, 5, 3, 1],
        extrapolate: 'clamp',
        useNativeDriver: true,
      })
    )
  }

  renderBobaStars(bobaShopItem) {
    let userReviewCount = bobaShopItem.userReviews.length - 1;
    let rating = 0;
    if(userReviewCount !== 0) {
      let rating = bobaShopItem.rating / userReviewCount;
    }
    return (
      <Rating readonly showRating={false} fractions={1} startingValue={rating} imageSize={15}/>
    )
  }

  renderPopularShopCards = (index, item) => {
    return (
      <Card transparent key={index.toString()} style={{width: 300, marginRight: 15, marginLeft: 15}}>
        <CardItem header>
         <Text style={styles.cardHeader} >{item.secondaryId}</Text>
        </CardItem>
        <CardItem>
          <Body style={{ flexDirection: 'row' }}>
            {this.renderBobaStars(item)}
            {item.reviewsCount === 1 ? <Text style={{ marginLeft: 10}}> {item.reviewsCount} Review </Text>:
                                        <Text style={{ marginLeft: 10}}> {item.reviewsCount} Reviews</Text>}
          </Body>
        </CardItem>
      </Card>
    )
  }

  renderDiscoverShopCards = (index, item) => {
    return (
      <Card transparent key={index.toString()} style={{width: 300, marginRight: 15, marginLeft: 15,}}>
        <CardItem header button>
         <Text style={styles.cardHeader} >{item.secondaryId}</Text>
        </CardItem>
        <CardItem>
          <Body style={{ flexDirection: 'row' }}>
            {this.renderBobaStars(item)}
            {item.reviewsCount === 1 ? <Text style={{ marginLeft: 10}}> {item.reviewsCount} Review </Text>:
                                        <Text style={{ marginLeft: 10}}> {item.reviewsCount} Reviews</Text>}
          </Body>
        </CardItem>
      </Card>
    )
  }

  render() {
    const { discoverBobaList, popularBobaList, buttonBackgroundColor, latitude, longitude } = this.state;
    const bobaImgs = ["../../Images/homeBoba_2.jpg", "../../Images/homeBoba.png"];

    const translateYConst = this.getImageTopPosition();

    const backgroundImageOpacity = this.getImageOpacity();

    const translateYButton = this.getButtonTopPosition();

    const headerOpacity = this.getHeaderOpacity();

    const imageScale = this.getImageScale();

    return (
      <View style={styles.title}>
        <StatusBar/>
        <Animated.View style={[styles.header, {
          opacity: headerOpacity,
        }]}>
        </Animated.View>
        <Animated.View style={[styles.buttonContainer, {
          alignSelf: 'center',
          transform: [
            {translateY: translateYButton},
          ]
        }]}>
        <Animated.View style={{ alignSelf:'flex-start', position: 'absolute', opacity: backgroundImageOpacity,}}>
          <Text style={{marginTop: -130, marginLeft: -155, color:"white", fontWeight: '900', fontSize: 45, textAlign: 'left', }}> It's{'\n'}Tea{'\n'}Time </Text>
        </Animated.View>
          <TouchableWithoutFeedback
            onPressIn = {() => this.setIsPress()}
            onPressOut={() => this.setIsNotPress()}
            onPress={() => this.navigateColor()}>
            <View style={[styles.textContainer, {backgroundColor: buttonBackgroundColor,}]}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight:'700', backgroundColor:'transparent'}}>
                  Find Boba Nearby!
                </Text>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>

        <ScrollView
          bouncesZoom={true}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: { y: this.scrollY },
              },
            }
            ],
            {useNativeDriver: false}
          )}
          scrollEventThrottle={16}
          style={{flex:1}}
          contentContainerStyle={{justifyContent:'space-evenly'}}
        >
          <Animated.View style={[styles.backgroundImage, {
            position: 'absolute',
            opacity: backgroundImageOpacity,
            transform: [
              {translateY: translateYConst},
              {scale: imageScale},
            ],
          }]}>
            <Image  source={require('../../Images/homeBoba_2.jpg')} style={styles.image}>
            </Image>
          </Animated.View>

          <TouchableWithoutFeedback
            onPress={ () => this.navigateReviews() }>
            <View style={{ flex:1, padding:10, marginBottom: 20, marginTop: Dimensions.get('window').height/2.2, }}>
              <Card style={{width: Dimensions.get('window').width/ 1.1, alignSelf: 'center', borderRadius: 20}}>
                <CardItem header style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                  <Left>
                    <Icon style={{fontSize:40, marginLeft: 5}} name='ios-create-outline' />
                    <Body>
                      <Text style={[styles.cardHeader, { color:'black', fontSize: 20, marginLeft: 10, marginTop: 5,}]}> Write a Review!</Text>
                      <Text style={{ color: 'black', marginLeft: 10, marginTop: 10 }}> Choose your favorite boba shops </Text>
                      <Text style={{ color: 'black', marginLeft: 10, marginTop: 2 }}> and start writing reviews! </Text>
                    </Body>
                  </Left>
                </CardItem>

                <CardItem cardBody style={{alignSelf:'center'}}>
                  <Image source={require('../../Images/homeBoba.png')} style={{borderBottomLeftRadius: 20, borderBottomRightRadius: 20, height: Dimensions.get('window').height / 3, width: Dimensions.get('window').width / 1.1, padding:20}}/>
                </CardItem>
              </Card>
            </View>
          </TouchableWithoutFeedback>

          <View styles={{flex:1, width: 100}}>
            <Text style={styles.subHeader}> Popular </Text>
          </View>
          <ScrollView
            style={styles.horizontalScroll}
            decelerationRate={0}
            snapToInterval={330} //your element width
            snapToAlignment={"center"}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {popularBobaList.map((item, index) => this.renderPopularShopCards(index, item))}
          </ScrollView>
          <View styles={{flex:1, width: 100}}>
            <Text style={styles.subHeader}> Discover </Text>
          </View>

          <ScrollView
            style={styles.horizontalScroll}
            decelerationRate={0}
            snapToInterval={330} //your element width
            snapToAlignment={"center"}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {discoverBobaList.map((item, index) => this.renderDiscoverShopCards(index, item))}
          </ScrollView>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex:1,
    marginBottom: 20,
    backgroundColor:'white',
    width: '100%',
    height: Dimensions.get('window').height / 2.3 ,
    top: 0,
    zIndex: -1000,
    shadowOffset:{
      width:0.7,
      height:3
    },
    shadowColor:'grey',
    shadowOpacity:0.4,
  },
  buttonContainer: {
    position: 'absolute',
    top: Dimensions.get('window').height/ 4,
    zIndex: 500,
    alignItems: 'center',
  },
  cardHeader: {
    fontWeight: '600',
    fontSize: 17,
  },
  header: {
    backgroundColor: 'white',
    zIndex: 50,
    position: 'absolute',
    width: '100%',
    flex:1,
    height: 116,
    shadowOffset:{
      width:0.7,
      height:3
    },
    shadowColor:'grey',
    shadowOpacity:0.4,
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  image: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  subHeader: {
    flex:1,
    color:'black',
    fontWeight: '700',
    fontSize: 27,
    marginBottom: 20,
    marginLeft: 11,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
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
  title: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    backgroundColor:'white',
  },
});

export default HomeScreen;
