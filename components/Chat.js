import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      //the state will be updated by the user
      messages: [],
    }
  }

  componentDidMount() {
    //sets the title once the Chat page is loaded
    let { name } = this.props.route.params;
    //adds the username to the top of the Chat page
    this.props.navigation.setOptions({ title: name });

    this.setState({
      /* displayed on-screen static messages, right after the Chat component mounts */
      messages: [
        {
          _id: 1,
          text: 'Hello ' + name,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      //the user's messages gets appended to the state
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  //defines style of messages
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {},
          right: {},
        }}
      />
    )
  };

  render() {
    /* applies the background color chosen by the user for Chat Room */
    const { bgColor } = this.props.route.params;

    return (
      <View style={{
        flex: 1,
        /* justifyContent: 'center',
        alignItems: 'center',*/
        backgroundColor: bgColor
      }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderBubble={this.renderBubble.bind(this)}
          user={{
            _id: 1,
          }}
        />
        {/* adds the component KeyboardAvoidingView if the platform’s OS is Android */}
        {Platform.OS === 'android'
          ? <KeyboardAvoidingView behavior="height" />
          : null
        }
      </View>
    )
  }
}