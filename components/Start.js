import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default class Screen1 extends React.Component {
  constructor(props){
    super(props);
    this.state={name: ''};
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Hello Screen1!</Text>
        <Button
          title="Go to Screen 2"
          onPress={() => this.props.navigation.navigate('Screen2')}
        />
      </View>
    )
  }
}