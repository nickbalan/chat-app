import React from 'react';
import BackgroundImage from '../assets/background-img.png';
import icon from '../assets/icon-user.svg';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  Pressable,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';

export default class Start extends React.Component {
  constructor(props) {
    super(props),
      //the state will be changed by the user  
      this.state = {
        bgColor: this.colors.blue,
        name: '',
      }
  }

  // this function updates the state of the background color
  changeBgColor = (newColor) => {
    this.setState({ bgColor: newColor });
  };

  // the background color used for updating the bgColor state
  colors = {
    purple: '#474056',
    dark: '#090C08',
    blue: '#8A95A5',
    green: '#B9C6AE'
  };

  render() {
    return (
      <View style={styles.container}>
        {/* loads the background image */}
        <ImageBackground
          source={BackgroundImage}
          resizeMode='cover'
          style={styles.backgroundImage}
        >

          {/* The title box */}
          <View style={styles.titleBox}>
            <Text style={styles.title}>Chat App</Text>
          </View>

          {/* Input that will change the name state */}
          <View style={styles.box1}>
            <View style={styles.inputBox}>
              <Image source={icon} style={styles.image} />
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.setState({ name: text })}
                value={this.state.name}
                placeholder=' Your Name ...'
              />
            </View>

            {/* Letting the user choose a background color */}
            <View style={styles.colorBox}>
              <Text style={styles.chooseColor}> Choose a background color: </Text>
            </View>
            <View style={styles.colorArray}>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="Darker background"
                accessibilityHint="Choose a darker background color for the Chat Room"
                accessibilityRole="button"
                style={styles.color1}
                onPress={() => this.changeBgColor(this.colors.dark)}>
              </TouchableOpacity>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="Purple background"
                accessibilityHint="Choose purple background color for the Chat Room"
                accessibilityRole="button"
                style={styles.color2}
                onPress={() => this.changeBgColor(this.colors.purple)}>
              </TouchableOpacity>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="Blue background"
                accessibilityHint="Choose blue background color for the Chat Room"
                accessibilityRole="button"
                style={styles.color3}
                onPress={() => this.changeBgColor(this.colors.blue)}>
              </TouchableOpacity>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="Green background"
                accessibilityHint="Choose green background color for the Chat Room"
                accessibilityRole="button"
                style={styles.color4}
                onPress={() => this.changeBgColor(this.colors.green)}>
              </TouchableOpacity>
            </View>

            {/* Pressable text-link to the Chat page, which will pass the name into it */}
            <Pressable
              accessible={true}
              accessibilityLabel="Start chatting"
              accessibilityHint="Navigate to the Chat Room"
              accessibilityRole="button"
              style={styles.button}
              onPress={() =>
                this.props.navigation.navigate('Chat', {
                  name: this.state.name,
                  bgColor: this.state.bgColor
                })}>
              <Text style={styles.buttonText}>Start Chatting</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundImage: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleBox: {
    height: '50%',
    width: '88%',
    alignItems: 'center',
    paddingTop: 100
  },

  title: {
    fontSize: 45,
    fontWeight: "600",
    color: '#FFFFFF',
  },

  box1: {
    backgroundColor: 'white',
    height: '44%',
    width: '88%',
    justifyContent: 'space-around',
    alignItems: 'center',

  },

  inputBox: {
    borderWidth: 2,
    borderRadius: 1,
    borderColor: 'grey',
    width: '88%',
    height: 60,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },

  image: {
    width: 20,
    height: 20,
    marginRight: 10
  },

  input: {
    fontSize: 16,
    fontWeight: "300",
    color: '#757083',
    opacity: 0.5,
  },

  colorBox: {
    marginRight: 'auto',
    paddingLeft: 15,
    width: '88%'
  },

  chooseColor: {
    fontSize: 16,
    fontWeight: "300",
    color: '#757083',
    opacity: 1,
  },

  colorArray: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '88%',
    paddingRight: 60
  },

  color1: {
    backgroundColor: '#090C08',
    width: 50,
    height: 50,
    borderRadius: 25
  },

  color2: {
    backgroundColor: '#474056',
    width: 50,
    height: 50,
    borderRadius: 25
  },

  color3: {
    backgroundColor: '#8A95A5',
    width: 50,
    height: 50,
    borderRadius: 25
  },

  color4: {
    backgroundColor: '#B9C6AE',
    width: 50,
    height: 50,
    borderRadius: 25
  },

  button: {
    width: '88%',
    height: 70,
    backgroundColor: '#757083',
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "600"
  }
});