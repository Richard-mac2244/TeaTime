import React from 'react';
import { ActivityIndicator, Alert, Animated, AsyncStorage, FlatList, Button, Dimensions, Keyboard, SafeAreaView, StyleSheet, View, TextInput, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { Avatar, List, ListItem } from 'react-native-elements';
import { Container, Header, Content, CheckBox, Text, Body } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Amplify, { API, Auth, graphqlOperation } from 'aws-amplify';
import { getBobaUser, listBobaShops } from '../../graphql/queries';

const DismissKeyBoard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

class SearchScreen extends React.Component {
  animation = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.state = {
      bobaData: [],
      bobaBoundary: {},
      buttonBackgroundColor: '#C6125E',
      selectedDistance: [5],
      submitSelectedDistance: [5],
      distance: [{ 'distance': 5 } , { 'distance': 10 }, { 'distance': 20 }],
      history: [],
      loading: false,
      latitude: null,
      longitude: null,
      popularBobaList: [],
      text: null,
    },
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount(prevProps, prevState) {

    const currLat = this.props.navigation.getParam('latitude', null);
    const currLong = this.props.navigation.getParam('longitude', null);

    this.setState({ latitude: currLat,
                    longitude: currLong,
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
          const queryBobaShop = await API.graphql(graphqlOperation(listBobaShops));
          const listBobaShop = queryBobaShop.data.listBobaShops.items;
          const nextTok = queryBobaShop.data.listBobaShops.nextToken;

          var newCoordArr = this.setNearMiles(5, currLat, currLong);
          console.log(newCoordArr);

          var findBobaShopWithinXMilesList;
          var state;
          if( nextTok ) {
            await this.findNextPageWithinShops(nextTok);
            state = true;
          }
          else {
            findBobaShopWithinXMilesList = this.findWithinShops(listBobaShop, currLat, currLong);
            state = false;
          }

          //var closestShopList = this.findClosestShops(listBobaShop, currLat, currLong);
          var sortedList = this.quickSort((state ? this.state.bobaData : findBobaShopWithinXMilesList), 0, (state ? this.state.bobaData.length - 1 : findBobaShopWithinXMilesList.length - 1));

          this.setState({ popularBobaList: sortedList, });

        })
      } catch (error) {
        console.log(error);
      }
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const { latitude, longitude, submitSelectedDistance } = this.state;

    if(prevState.submitSelectedDistance[0] !== submitSelectedDistance[0]) {
      console.log('rerendering: ' + submitSelectedDistance[0])
      try {
        await Auth.currentAuthenticatedUser()
        .then(async(user) => {
          let filter = {
            address: {
              contains: 'Sacramento'
            }
          }
          const queryBobaShop = await API.graphql(graphqlOperation(listBobaShops));
          const listBobaShop = queryBobaShop.data.listBobaShops.items;
          const nextTok = queryBobaShop.data.listBobaShops.nextToken;

          var newCoordArr = this.setNearMiles(submitSelectedDistance[0], latitude, longitude);
          console.log(newCoordArr);

          var findBobaShopWithinXMilesList;
          var state;
          if( nextTok ) {
            await this.findNextPageWithinShops(nextTok);
            state = true;
          }
          else {
            findBobaShopWithinXMilesList = this.findWithinShops(listBobaShop, latitude, longitude);
            state = false;
          }

          var sortedList = this.quickSort((state ? this.state.bobaData : findBobaShopWithinXMilesList), 0, (state ? this.state.bobaData.length - 1 : findBobaShopWithinXMilesList.length - 1));

          this.setState({ popularBobaList: sortedList, });

        })
      } catch (error) {
        console.log(error);
      }
    }
  }

  findWithinShops(listBobaShop, lat, long) {
    const { bobaBoundary } = this.state;
    var bobaShopArr = [];

    const bobaList = listBobaShop;
    console.log(bobaList.length);
    for(var i = 0; i < bobaList.length; i++) {
      if(( bobaList[i].coordinates[0] <= parseFloat(bobaBoundary.N[0]) && bobaList[i].coordinates[0] >= parseFloat(bobaBoundary.S[0]) )) {
        if(( bobaList[i].coordinates[1] >= parseFloat(bobaBoundary.W[1]) && bobaList[i].coordinates[1] <= parseFloat(bobaBoundary.E[1]) )) {
          var bobaInfo = {};
          var bobaLat = bobaList[i].coordinates[0];
          var bobaLong = bobaList[i].coordinates[1];
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
          bobaInfo["primary"] = bobaList[i].id;
          bobaInfo["address"] = bobaList[i].address;
          bobaInfo["distance"] = parseFloat(mi.toFixed(2));;

          bobaShopArr.push(bobaInfo);
          console.log('added')
        }
        else {
          console.log('firstCondition not added')
        }
      }
      else {
        console.log('not added')
      }
    }

    return bobaShopArr;
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
        bobaInfo["primary"] = bobaList[i].id;
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

  setNearMiles(mi, lat0, long0) {
    console.log('initial lat: ' +  lat0);
    console.log('intial long: ' + long0);
    var boundaries = {};

    var coordArr0 = [];

    var m = mi * 1609;  //convert miles to meters
    const R = 6371e3; // metres
    const φ21 = Math.asin( Math.sin(lat0*Math.PI/180)*Math.cos(m/R) + Math.cos(lat0*Math.PI/180)*Math.sin(m/R)*Math.cos(0) );
    const λ21 = long0*Math.PI/180 + (Math.atan2(Math.sin(0)*Math.sin(m/R)*Math.cos(lat0*Math.PI/180), Math.cos(m/R)-Math.sin(lat0*Math.PI/180)*Math.sin(φ21)));
    coordArr0.push(φ21 * (180 / Math.PI));
    coordArr0.push(λ21 * (180 / Math.PI));

    boundaries['N'] = coordArr0;

    var coordArr90 = [];

    const φ22 = Math.asin( Math.sin(lat0*Math.PI/180)*Math.cos(m/R) + Math.cos(lat0*Math.PI/180)*Math.sin(m/R)*Math.cos(1.571) );
    const λ22 = long0*Math.PI/180 + (Math.atan2(Math.sin(1.571)*Math.sin(m/R)*Math.cos(lat0*Math.PI/180), Math.cos(m/R)-Math.sin(lat0*Math.PI/180)*Math.sin(φ22)));
    coordArr90.push(φ22 * (180 / Math.PI));
    coordArr90.push(λ22 * (180 / Math.PI));

    boundaries['E'] = coordArr90;

    var coordArr180 = [];

    const φ23 = Math.asin( Math.sin(lat0*Math.PI/180)*Math.cos(m/R) + Math.cos(lat0*Math.PI/180)*Math.sin(m/R)*Math.cos(3.142) );
    const λ23 = long0*Math.PI/180 + (Math.atan2(Math.sin(3.142)*Math.sin(m/R)*Math.cos(lat0*Math.PI/180), Math.cos(m/R)-Math.sin(lat0*Math.PI/180)*Math.sin(φ23)));
    coordArr180.push(φ23 * (180 / Math.PI));
    coordArr180.push(λ23 * (180 / Math.PI));

    boundaries['S'] = coordArr180;

    var coordArr270 = [];

    const φ24 = Math.asin( Math.sin(lat0*Math.PI/180)*Math.cos(m/R) + Math.cos(lat0*Math.PI/180)*Math.sin(m/R)*Math.cos(4.712) );
    const λ24 = long0*Math.PI/180 + (Math.atan2(Math.sin(4.712)*Math.sin(m/R)*Math.cos(lat0*Math.PI/180), Math.cos(m/R)-Math.sin(lat0*Math.PI/180)*Math.sin(φ24)));
    coordArr270.push(φ24 * (180 / Math.PI));
    coordArr270.push(λ24 * (180 / Math.PI));

    boundaries['W'] = coordArr270;

    this.setState({bobaBoundary: boundaries})

    return boundaries;
  }


  findClosestShops(bobaShops, lat, long) {
    var closestShop = [];

    for(var i = 0; i < bobaShops.length; i++) {
      var bobaInfo = {};
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

      bobaInfo["name"] = bobaShops[i].secondaryId;
      bobaInfo["primary"] = bobaList[i].id;
      bobaInfo["address"] = bobaShops[i].address;
      bobaInfo["distance"] = parseFloat(mi.toFixed(2));;

      closestShop.push(bobaInfo);
    }

    return closestShop;
  }

  swap(bobaShops, leftInd, rightInd) {
    var temp = bobaShops[leftInd];
    bobaShops[leftInd] = bobaShops[rightInd];
    bobaShops[rightInd] = temp;
  }

  partition(bobaShops, leftInd, rightInd) {
    var pivot = bobaShops[Math.floor((rightInd + leftInd) / 2)].distance,
      i = leftInd,
      j = rightInd;

    while( i <= j ) {

      while(bobaShops[i].distance < pivot) {
        i++;
      }

      while(bobaShops[j].distance > pivot) {
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

  onChangeHandler(e){
    e.preventDefault();
    this.setState({input: e.target.value});
  }

  handleChange(text) {
    reText = text.trim().toLowerCase().replace(" ", "%20");
    this.setState({text: reText});
  }

  handleSubmit(event) {
    Keyboard.dismiss();
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.text + '&key=AIzaSyCK1n6b3bdxx5f9RmbTod_zJRCG62VOgsI',
    {
      method: 'GET',
      headers: {
      Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      }).then((response) => response.json())
        .then((responseJson) => {
          var responseObj = responseJson.results[0]
          var lat = responseObj.geometry.location.lat;
          var long = responseObj.geometry.location.lng;
          console.log('lat: ' + lat + ' long: ' + long);
          this.setState({latitude: lat,
                          longitude: long,},
                          () => this.locateBoba(lat, long));
        }
      )
      .then(console.log("finished"))
      .catch((error) => {
        console.log(error);
      });
  }

  getBackdrop() {
    return (
      this.animation.interpolate({
        inputRange: [0, 0.01],
        outputRange: [Dimensions.get("window").height, 0],
        extrapolate: 'clamp',
      })
    )
  }

  getBackdropOpacity() {
    return (
      this.animation.interpolate({
        inputRange: [0.01, 0.5],
        outputRange: [0, 1],
        extrapolate: "clamp",
      })
    )
  }

  getSlideUp() {
    return (
      this.animation.interpolate({
        inputRange: [0.01, 1],
        outputRange: [0, -1 * Dimensions.get("window").height / 1.12],
        extrapolate: "clamp",
      })
    )
  }

  handleOpenFilter = () => {
    Animated.timing(this.animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  handleCloseFilter = () => {
    Animated.timing(this.animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  toggleCheckBox(distance) {
    let selectedDistance = this.state.selectedDistance;
    let selectedDistArr = [];
    if(!selectedDistance.includes(parseInt(distance))) {
      selectedDistArr.push(parseInt(distance));
      selectedDistance = selectedDistArr;
    }
    this.setState({ selectedDistance });
  }

  handleFilterOptions(selected) {
    let newSelectedDistance = [];
    newSelectedDistance.push(selected);
    this.setState({ submitSelectedDistance: newSelectedDistance },
                  () => this.handleCloseFilter())
  }

  renderFilterTab = () => {
    const { buttonBackgroundColor, distance, selectedDistance } = this.state;

    return (
      <View style={{height: 500}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
          <TouchableOpacity style={{ left: 20, top: 23 }} onPress={this.handleCloseFilter}>
            <Icon name = "ios-close" size = {28} style={{ color: 'black',}}/>
          </TouchableOpacity>
          <Text style={{ top: 25, fontWeight: '700', fontSize: 16}}> Filters </Text>
          <Text style={{fontSize:1, color:'white'}}> . </Text>
        </View>
        <View
          style={{
            top: 40,
            width: Dimensions.get('window').width / 1.1,
            borderBottomColor: '#CED0CE',
            borderBottomWidth: 1.3,
          }}
        />
        <FlatList
          style={{ top: 60}}
          data={distance}
          renderItem={({item}) => {
            const distanceId = item.distance;
            return (
              <ListItem>
                <CheckBox style={{ fontSize: 20, }} color='#C6125E' onPress={ () => this.toggleCheckBox(distanceId) } checked={distance && this.state.selectedDistance.includes(distanceId)} />
                <Body>
                  <Text>{distanceId} miles</Text>
                </Body>
              </ListItem>
            )
          }}
          keyExtractor={ (item, index) => item.id }>
        </FlatList>
        <View
          style={{
            position: 'absolute',
            top: 403,
            width: Dimensions.get('window').width / 1.1,
            borderBottomColor: '#CED0CE',
            borderBottomWidth: 1.3,
          }}
        />
        <TouchableWithoutFeedback
          onPress={() => this.handleFilterOptions(selectedDistance[0])}>
          <View style={{ alignSelf: 'center', backgroundColor: buttonBackgroundColor, borderRadius: "55%", justifyContent: 'center', position: 'absolute', top: Dimensions.get('window').height / 1.95, width: Dimensions.get('window').width/1.7, height: 50,}}>
            <Text style={{ color: 'white', fontSize: 16,  fontWeight: '700', textAlign: 'center', }}> Submit </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
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

  renderHeader = () => {
    return (
      <View style={styles.textContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate('Home')}
        >
          <Icon name = "ios-chevron-back" size = {20} style={{ top: Dimensions.get('window').height/55, marginLeft: Dimensions.get('window').width/30,  marginRight:15, color: 'grey'}}/>
        </TouchableOpacity>
          <TextInput
            autoCompleteType='off'
            placeholder = "Find nearby boba spots!"
            placeholderTextColor = "grey"
            onChangeText={(text) => this.handleChange(text)}
            onSubmitEditing = {this.handleSubmit}
            returnKeyType = 'search'
            style={{flex:2, fontWeight:'400', backgroundColor:'white', height:'100%'}}
          />
        <TouchableOpacity onPress={this.handleOpenFilter}>
          <Icon name = "ios-options" size = {20} style={{ top: Dimensions.get('window').height/55, marginLeft: Dimensions.get('window').width/100,  marginRight:12, color: 'grey'}}/>
        </TouchableOpacity>
      </View>
    );
  };

  renderItem = ({ item }) => {
    return (
      <ListItem bottomDivider
        onPress={ () => this.props.navigation.navigate('Shop', {'primaryId': item.primary, 'secondaryId': item.name, 'distance': item.distance}) }>
        <ListItem.Content>
          <ListItem.Title style={{ fontWeight: 'bold' }}>{item.name}</ListItem.Title>
          <ListItem.Subtitle style={{ color: 'grey'}}>{item.address}</ListItem.Subtitle>
          <ListItem.Subtitle style={{ color: 'grey'}}>Distance: {item.distance}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    )
  }

  renderEmptyList = () => {
    return (
      <ListItem >
        <ListItem.Content>
          <ListItem.Title style={{ fontWeight: '700', fontSize: 15, alignSelf: 'center' }}> Found 0 nearby boba shops!</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    )
  }

  render() {
    const screenHeight = Dimensions.get('window').height;

    if (!this.state.loading) {
      return (
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
          {this.renderHeader()}
        </SafeAreaView>
      );
    }

    const backdrop = this.getBackdrop();

    const backdropOpacity = this.getBackdropOpacity();

    const slideUp = this.getSlideUp();

    return (
      <DismissKeyBoard>
        <SafeAreaView style={styles.container}>
          {this.renderHeader()}
          <View style={{top: Dimensions.get('window').height/12 + 18 , borderTopColor: '#d3d3d3',
          borderTopWidth: 1,}}/>
          <FlatList
            style={{top: Dimensions.get('window').height/12 + 18, marginBottom: 50} }
            data={this.state.popularBobaList}
            extraData={this.props}
            renderItem={this.renderItem}
            keyExtractor={ (item, index) => index }
            ListEmptyComponent={this.renderEmptyList()}
          />
          <Animated.View
            style={[
              styles.cover,
              StyleSheet.absoluteFill,
              {
                opacity: backdropOpacity,
                transform: [{
                  translateY: backdrop,
                }]
              }
            ]} />
          <View style={styles.filterView}>
            <Animated.View
              style={[
                styles.filterPopup,
                {
                  transform: [{
                    translateY: slideUp,
                  }]
                }
              ]}>
              <TouchableWithoutFeedback >
                {this.renderFilterTab()}
              </TouchableWithoutFeedback>
            </Animated.View>
          </View>
        </SafeAreaView>
      </DismissKeyBoard>
    );
  }
}

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection:'column',
    backgroundColor: 'white',
  },
  cover: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterView: {
    position: 'absolute',
    top: Dimensions.get("window").height,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    height: '100%',
  },
  filterPopup: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    minHeight: 500,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 20,
    alignItems: "center",
    justifyContent: 'center',
  },
  textContainer: {
    flex:1,
    alignSelf: 'center',
    flexDirection:'row',
    backgroundColor:'white',
    marginHorizontal: 25,
    shadowOffset:{
      width:0.7,
      height:3
    },
    shadowColor:'grey',
    shadowOpacity:0.4,
    position: 'absolute',
    top: Dimensions.get('window').height/12,
    width: Dimensions.get('window').width/1.2,
    borderRadius: 12,
    height: 50,
  },
});
