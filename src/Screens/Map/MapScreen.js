import React from 'react';
import { Alert, Button, Dimensions, Keyboard, SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isTfReady: false,
      isModelReady: false,
      region: {
        latitude: null,
        longitude: null,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    }
  }

  async componentDidMount(prevProps, prevState) {
    if(prevState != this.state.loading) {
      this.onRelocate();
    }
    else {
      console.log("initial location set");
    }
  }

  onRegionChange(region) {
    this.setState({ region });
    console.log(region);
  }

  onRelocate = () => {
    const { region } = this.state;
    let coord = navigator.geolocation.getCurrentPosition(
      positions => {
        var regionProp = { ...this.state.region };
        regionProp.latitude = JSON.stringify(positions.coords.latitude);
        regionProp.longitude = JSON.stringify(positions.coords.longitude);
        this.setState({ regionProp,
                        loading: true,},
        () => this.map.animateToRegion(regionProp));
      },
      error => Alert.alert(error.message),
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
    navigator.geolocation.stopObserving();
  }

  render() {
    return (
        <View style={styles.page}>
          <MapView
            showsUserLocation={true}
            style={styles.map}
            ref={ref => { this.map = ref; }}
            onRegionChange={region => this.onRegionChange(region)}
            onRegionChangeComplete = {region=>this.setState({region})}
          >
          </MapView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    fontSize: 20,
    backgroundColor: 'red',
  },
  textContainer: {
    zIndex: 100,
    flexDirection:'row',
    padding: 13,
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
    borderRadius: 15,
    opacity:0.93,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  map: {
    zIndex: -100,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  topHeader: {
    top: Dimensions.get('window').height/10,
    zIndex: 100,
    left: -1* Dimensions.get('window').width/2.5,
  }
});

export default MapScreen;
