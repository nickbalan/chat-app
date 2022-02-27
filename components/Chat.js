import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

// importing Firestore
const firebase = require('firebase');
require('firebase/firestore');


export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      //the state will be updated by the user
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      }
    }

    //initialize app 
    if (!firebase.apps.length) {
      firebase.initializeApp({
        // Chat App's Firestore database credentials
        apiKey: "AIzaSyAYsYst4N3acbuDZWNXJfOZ5Ju_HqRNBzA",
        authDomain: "chat-app-f50e3.firebaseapp.com",
        projectId: "chat-app-f50e3",
        storageBucket: "chat-app-f50e3.appspot.com",
        messagingSenderId: "296053348370",
        appId: "1:296053348370:web:faf5c63477ccea1a7c20cb"
      })
    }
  }

  componentDidMount() {
    //sets the title once the Chat page is loaded
    let { name } = this.props.route.params;
    //adds the username to the top of the Chat page
    this.props.navigation.setOptions({ title: name });

    //references firestore database collection
    this.referenceMessages = firebase
      .firestore()
      .collection('messages');

    //listens to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }

      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any"
        }
      });

      //listen to collection updates
      this.unsubscribe = this.referenceMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    //stop listening to the authentication
    this.authUnsubscribe();
    //stop listening to for the changes
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the Query Document Snapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        }
      });
    });
    this.setState({
      messages: messages
    });
  };

  //add new message to database collection
  addMessage() {
    const message = this.state.messages[0];

    this.referenceMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: this.state.user
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      //the user's messages gets appended to the state
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
    })
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
            _id: this.state.user._id,
            name: this.state.name,
            avatar: this.state.user.avatar
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