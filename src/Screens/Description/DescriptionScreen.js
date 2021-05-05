import React from 'react';
import { Button, SafeAreaView, StyleSheet, View, Text } from 'react-native';

class DescriptionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTfReady: false,
      isModelReady: false,
    }
  }

  async componentDidMount() {
  }

  render() {
    return (
      <SafeAreaView style={styles.title}>
        <View style={styles.topHeader}>
          <Button title="Back" onPress={() => this.props.navigation.navigate('Map')} />
        </View>
        <View style={styles.container}>
          <Text> This is the description screen </Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    flex:1,
    fontSize: 20,
    marginTop: 40,
  },
  container: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
  },
  topHeader: {
    flex: 1,
    alignItems: "baseline"
  }
});

export default DescriptionScreen;
