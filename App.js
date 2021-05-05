import React from 'react';
import Navigator from './src/Navigation/index.js';
import { StyleSheet, View, Text } from 'react-native';
import Amplify from 'aws-amplify';
import awsExports from "./src/aws-exports";

Amplify.configure({
  ...awsExports,
  Analytics: {
    disabled: true,
  },
});

const App = () => <Navigator />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 40,
  },
});

export default App;
