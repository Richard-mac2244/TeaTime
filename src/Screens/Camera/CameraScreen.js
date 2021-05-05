import React, { useState, useEffect, useRef } from 'react';
import { Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions'
import { ActivityIndicator, Alert, Dimensions, SafeAreaView, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default class CameraScreen extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        frameworkReady: false,
        identifedAs: null,
        isTfReady: false,
        isModelReady: false,
        image: false,
        loading: false,
        hasPermission: false,
        setHasPermission: false,
        type: Camera.Constants.Type.back,
        setType: Camera.Constants.Type.back,
        predictionFound: false,
        dimensions: {
        window,
        screen
        },
    }
  }

  async componentDidMount() {
    if(!this.state.frameworkReady) {
      const { status } = await Camera.requestPermissionsAsync();
      this.setState({ hasPermission: status === 'granted' })
      await tf.ready()
      this.setState({
        isTfReady: true
      })
      this.model = await cocoSsd.load()
      this.setState({ isModelReady: true,
                      frameworkReady: true,
      },)

    }
  }

  async _takePhoto(){
    if(this.camera) {
      this.camera.pausePreview();
      this.setState({ loading: true });
      const options = {quality: 1};
      const photo = await this.camera.takePictureAsync(options);
      this.identifyImage(photo);
    }
  }

  imageToTensor(imageData) {
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(imageData, TO_UINT8ARRAY);
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0;
    for(let i = 0; i < buffer.length; i+=3) {
      buffer[i] = data[offset];
      buffer[i+1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];
      offset += 4;
    }

    return tf.tensor3d(buffer, [height, width, 3]);
  }

  async identifyImage(imagePic){
    const response = await fetch(imagePic.uri, {}, { isBinary: true });
    const imageData = await response.arrayBuffer();
    const convImageData = new Uint8Array(imageData);
    const imageTensor = this.imageToTensor(convImageData);
    const prediction = await this.model.detect(imageTensor);
    console.log(prediction);
    this.setState({loading: false});
    this.camera.resumePreview();
  }

  displayAnswer(identifiedImage){
    this.setState({
            identifedAs:identifiedImage,
            isModelReady: true,
            image: true,
            loading: false,
        });
    Alert.alert(
            this.state.identifedAs,
            '',
            { cancelable: false }
        )
    this.camera.resumePreview();
  }

  renderPrediction(prediction){
    return (
      <Text key={prediction.className} style={styles.text}>
        {prediction.className}
      </Text>
    )
  }

  render() {
    const { hasPermission, dimensions, image, isModelReady, isTfReady, identifedAs, loading } = this.state

    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    else {
      return (
        <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        <View style={styles.loadingContainer}>
          <Text style={styles.commonTextStyles}>
            TFJS ready? {isTfReady ? <Text>✅</Text> : ''}
          </Text>

          <View style={styles.loadingModelContainer}>
            <Text style={styles.text}>Model ready? </Text>
            {isModelReady ? (
              <Text style={styles.text}>✅</Text>
            ) : (
              <ActivityIndicator size='small' />
            )}
          </View>
        </View>
        <Camera style={styles.camera} type={this.state.type} ref={ (ref) => {this.camera = ref}}>
          <ActivityIndicator size="large" style={{flex: 1,alignItems: 'center',justifyContent: 'center', top: dimensions.window.height / 4}} color="#fff" animating={!isModelReady || !isTfReady}/>
          <ActivityIndicator size="large" style={{flex: 1,alignItems: 'center',justifyContent: 'center', top: dimensions.window.height / 4}} color="#fff" animating={loading}/>
          <TouchableOpacity
            style={styles.imageWrapper}
            onPress={isModelReady ? this._takePhoto.bind(this) : undefined}>
            {isModelReady && (
              <Text style={styles.transparentText}>Tap to take picture!</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Icon name="ios-camera-reverse" color="white" size={35}/>
          </TouchableOpacity>
        </Camera>
      </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  camera: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#171f24',
    alignItems: 'center'
  },
  loadingContainer: {
    marginTop: 80,
    justifyContent: 'center'
  },
  text: {
    color: '#ffffff',
    fontSize: 16
  },
  loadingModelContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  imageWrapper: {
    width: 280,
    height: 280,
    padding: 10,
    borderColor: '#cf667f',
    borderWidth: 5,
    borderStyle: 'dashed',
    marginTop: 40,
    marginBottom: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    width: 250,
    height: 250,
    position: 'absolute',
    top: 10,
    left: 10,
    bottom: 10,
    right: 10
  },
  predictionWrapper: {
    height: 100,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center'
  },
  transparentText: {
    color: '#ffffff',
    opacity: 0.7
  },
})
