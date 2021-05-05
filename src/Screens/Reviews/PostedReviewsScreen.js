import React from 'react';
import { ActivityIndicator, Alert, AsyncStorage, FlatList, Button, Dimensions, Keyboard, SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { Avatar, List, ListItem, Rating } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Amplify, { API, Auth, graphqlOperation } from 'aws-amplify';
import { getBobaUser, getBobaReview, listBobaShops } from '../../graphql/queries';

const DismissKeyBoard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

/*const link = leftAvatar={{ source: { uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + item[1] + '&key=AIzaSyAcQraHjkVDf80nGJ05mdqSTYmaPgnZ-W4' } }}*/

/*const data = bobaArr[responseJson.results[i].name] = responseJson.results[i].photos[0].photo_reference;*/
class PostedReviewsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      text: null,
      latitude: null,
      longitude: null,
      reviewBobaList: [],
      reviewBobaDataList: [],
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
          const queryBobaUser = await API.graphql(graphqlOperation(getBobaUser, { id: user.attributes.sub }));
          let bobaArr = await this.getBobaReviewData(queryBobaUser.data.getBobaUser.review);

          this.setState({ reviewBobaList: queryBobaUser.data.getBobaUser.review,
                          reviewBobaDataList: bobaArr });
        })
      } catch (error) {
        console.log(error);
      }
    }
  }

  async componentDidUpdate(prevState, prevProps) {
    let queryBobaUser;
    let bobaArr;

    try {
      await Auth.currentAuthenticatedUser()
      .then(async(user) => {
        queryBobaUser = await API.graphql(graphqlOperation(getBobaUser, { id: user.attributes.sub }));
        bobaArr = await this.getBobaReviewData(queryBobaUser.data.getBobaUser.review);
      })
    } catch (error) {
      console.log(error);
    }

    if(prevState.reviewBobaList != bobaArr){
      try {
        await Auth.currentAuthenticatedUser()
        .then(async(user) => {
          queryBobaUser = await API.graphql(graphqlOperation(getBobaUser, { id: user.attributes.sub }));
          bobaArr = await this.getBobaReviewData(queryBobaUser.data.getBobaUser.review);

          this.setState({ reviewBobaList: queryBobaUser.data.getBobaUser.review,
                          reviewBobaDataList: bobaArr });
        })
      } catch (error) {
        console.log(error);
      }
    }
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

  async getBobaReviewData(bobaReviewId) {
    let bobaArr = [];

    for(let i = 0; i < bobaReviewId.length; i++) {
      try {
        const bobaShopId = await API.graphql(graphqlOperation(getBobaReview, { id: bobaReviewId[i] }));
        bobaArr.unshift(bobaShopId.data.getBobaReview);

      } catch(e) {
        console.log('error creating review', e);
      }
    }

    return bobaArr;
  }

  renderDate = (date) => {
    var d = new Date(date.substring(0, date.indexOf('T')));
    var str = d.toString();
    var dateArr = str.split(' ');
    var returnDate = dateArr[0] + ' ' + dateArr[1] + ' ' + dateArr[2] + ', ' + dateArr[3];
    return(
      <ListItem.Subtitle style={{ color: 'grey', marginTop: 5,}}>Created On: {returnDate}</ListItem.Subtitle>
    )
  }

  renderBobaStars = (rating) => {
    return(
      <Rating style={styles.rating}
        imageSize={15}
        readonly
        startingValue={rating}/>
    )
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
    const { reviewBobaList } = this.state;
    return (
      <View style={styles.countTitle}>
        {reviewBobaList.length > 0 ? <Text style={{fontWeight: '700',}}> Reviews: {reviewBobaList.length} </Text> : <Text style={{fontWeight: '700',}}> No posted reviews! </Text>}
      </View>
    );
  };

  renderItem = ({ item }) => {
    return(
      <ListItem bottomDivider
        onPress = { () => this.props.navigation.navigate('ViewPostedReview', {bobaReviewId: item.id, rating: item.rating}) }>
        <ListItem.Content>
          <ListItem.Title style={{ fontWeight: 'bold' }}>{item.bobaShopId}</ListItem.Title>
          {this.renderBobaStars(item.rating)}
          {this.renderDate(item.createdOn)}
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    )
  }

  render() {
    const { reviewBobaList } = this.state;
    let renderView;

    if(reviewBobaList.length > 0) {
      renderView = (
        <View style={styles.container}>
          {this.renderHeader()}
          <View style={{top: Dimensions.get('window').height/ 20, borderTopColor: '#d3d3d3',
          borderTopWidth: 1, opacity: 0.4}}>
          </View>
          <FlatList
            contentContainerStyle={{ paddingBottom: '20%'}}
            style={{top: Dimensions.get('window').height/20, } }
            data={this.state.reviewBobaDataList}
            extraData={this.props}
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
          />
        </View>
      )
    }
    else {
      renderView = (
        <View style={styles.title}>
          <ActivityIndicator size="large" color="" />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        {renderView}
      </View>
    );
  }
}

export default PostedReviewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  countTitle: {
    alignItems: 'flex-start',
    marginLeft: 20,
    top: 20,
    fontWeight: '700',
  },
  rating: {
    marginTop: 7,
  },
  title: {
    backgroundColor: 'white',
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
