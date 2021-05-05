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
class SavedReviewsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      text: null,
      latitude: null,
      longitude: null,
      reviewBobaList: [],
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

          const queryBobaUser = await API.graphql(graphqlOperation(getBobaUser, { id: user.attributes.sub }));
          this.setState({ reviewBobaList: queryBobaUser.data.getBobaUser.savedReviews, });
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
      <View style={styles.countTitle}>
        {this.state.reviewBobaList > 0 ? <Text style={{fontWeight: '700',}}> Reviews: {this.state.reviewBobaList.length} </Text> : <Text style={{fontWeight: '700',}}> No saved reviews! </Text>}
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
        <View style={{top: Dimensions.get('window').height/ 20, borderTopColor: '#d3d3d3',
        borderTopWidth: 1, opacity: 0.4}}>
        </View>
        <FlatList
          style={{top: Dimensions.get('window').height/11, marginBottom: 73} }
          data={this.state.reviewBobaList}
          extraData={this.props}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}

export default SavedReviewsScreen;

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
