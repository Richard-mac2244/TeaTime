import React from 'react';
import { ActivityIndicator, Alert, AsyncStorage, FlatList, Button, Dimensions, Keyboard, SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { Avatar, List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Amplify, { API, Auth, graphqlOperation } from 'aws-amplify';
import { getBobaUser, listBobaShops } from '../../graphql/queries';

const DismissKeyBoard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

/*const link = leftAvatar={{ source: { uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + item[1] + '&key=AIzaSyAcQraHjkVDf80nGJ05mdqSTYmaPgnZ-W4' } }}*/

/*const data = bobaArr[responseJson.results[i].name] = responseJson.results[i].photos[0].photo_reference;*/
class ReviewsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      text: null,
      latitude: null,
      longitude: null,
      popularBobaList: [],
      history: [],
      bobaData: [],
      bobaBoundary: {},
      searchedShops: [],
    },
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.findHistory = this.findHistory.bind(this);
  }

  async componentDidMount(prevProps, prevState) {
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

          var newCoordArr = this.setNearMiles(20, currLat, currLong);
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

  async findHistory() {
    try {
      let historyData =  await JSON.parse(AsyncStorage.getItem('history'))
      this.setState({history: historyData.history},
                    () => console.log(this.state.history));
      Alert.alert("success");
    }
    catch(e) {
      Alert.alert(e)
    }
  }

  handleChange(text) {
    text = text.trim();
    this.setState({text},
                  () => console.log(this.state.text));
  }

  async handleSubmit(event) {
    const { text } = this.state;
    Keyboard.dismiss();
    try {
      let filter = {
        secondaryId: {
          contains: text
        }
      }
      const queryBobaShop = await API.graphql({ query: listBobaShops, variables: { filter: filter }});
      const listBobaShop = queryBobaShop.data.listBobaShops.items;
      console.log(listBobaShop);

      this.setState({ searchedShops: listBobaShop });
    }
    catch(e) {
      console.log(e);
    }
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          top:60,
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
          opacity: 0.5,
        }}
      />
    );
  };

  renderHeader = () => {
    return (
      <View style={styles.textContainer}>
        <TextInput
          autoCompleteType='off'
          placeholder = "Find nearby boba spots!"
          placeholderTextColor = "grey"
          onChangeText={(text) => this.handleChange(text)}
          onSubmitEditing = {this.handleSubmit}
          returnKeyType = 'search'
          style={{flex:2, fontWeight:'400', backgroundColor:'white', height:'100%', marginLeft: 30}}
        />
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Map')}
          >
          <Icon name = "ios-options" size = {20} style={{ top: Dimensions.get('window').height/90, marginLeft: Dimensions.get('window').width/100,  marginRight:12, color: 'grey'}}/>
        </TouchableOpacity>
      </View>
    );
  };

  renderItem = ({ item }) => (
    <ListItem bottomDivider
      onPress={ () => this.props.navigation.navigate('WriteReview', {primaryId: item.id, secondaryId: item.secondaryId}) } >
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: 'bold' }}>{item.secondaryId}</ListItem.Title>
        <ListItem.Subtitle style={{ color: 'grey'}}>{item.address}</ListItem.Subtitle>
        <ListItem.Subtitle style={{ color: 'grey'}}>{item.rating}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  )

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={{top: Dimensions.get('window').height/ 11, borderTopColor: '#d3d3d3',
        borderTopWidth: 1, opacity: 0.4}}>
        </View>
        <FlatList
          style={{top: Dimensions.get('window').height/11, marginBottom: 73} }
          data={this.state.searchedShops}
          extraData={this.props}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}

export default ReviewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  title: {
    flex: 1,
    fontSize: 20,
    alignItems: "center",
    justifyContent: 'center',
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
});
