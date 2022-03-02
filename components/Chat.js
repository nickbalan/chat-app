import React from 'react';
import {
  View,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import {
  GiftedChat,
  Bubble,
  SystemMessage,
  InputToolbar,
  Day
} from 'react-native-gifted-chat';
// importing Firestore
/* const firebase = require('firebase');
require('firebase/firestore'); */
import * as firebase from 'firebase';
import 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';


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
        avatar: ""
      },
      isConnected: false,
      image: null,
      location: null
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

    //references firestore database collection
    this.referenceMessages = firebase
      .firestore()
      .collection('messages')
    this.refMsgsUser = null;
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
        },
        image: data.image || null,
        location: data.location || null
      });
    });
    this.setState({
      messages: messages
    });
  };

  //load the messages from asyncStorage
  getMessages = async () => {
    let messages = '';
    try {
      //convert the saved string back into an object
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //save the message in the storage by converting the message object into a string
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  //delete the message from the storage
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    //sets the title once the Chat page is loaded
    let { name } = this.props.route.params;
    //adds the username to the top of the Chat page
    this.props.navigation.setOptions({ title: name });

    //check the user connection status and fetch the data from asyncStorage or Firestore
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');
        //listen to collection updates
        this.unsubscribe = this.referenceMessages
          .orderBy('createdAt', 'desc')
          .onSnapshot(this.onCollectionUpdate);
        //listen to authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }

          //update user state
          this.setState({
            uid: user.uid,
            messages: [],
            user: {
              _id: user.uid,
              name: name,
              avatar: "https://placeimg.com/140/140/any"
            }
          });

          //referencing messages of current user
          this.refMsgsUser = firebase
            .firestore()
            .collection('messages')
            .where('uid', '==', this.state.uid);
        });
        // save messages to the local storge
        this.saveMessages()
      } else {
        // if the user is offline
        this.getMessages();
        console.log('offline');
      }
    });
  }

  componentWillUnmount() {
    //stop listening to the authentication
    this.authUnsubscribe();
    //stop listening to for the changes
    this.unsubscribe();
  }

  //add new message to database collection
  addMessage() {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: this.state.user,
      image: message.image || '',
      location: message.location || null
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      //the user's messages gets appended to the state
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
      this.saveMessages();
    })
  }

  //render the system message; the text color depends on the set background color
  renderSystemMessage(props) {
    return <SystemMessage
      {...props}
      textStyle={{ color: '#736357' }} />;
    /* const { bgColor } = this.props.route.params;
    return (
      <SystemMessage
        {...props}
        textStyle={{ color: bgColor === '#B9C6AE' ? '#555555' : '#dddddd' }}
      />
    ); */
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
  }

  renderDay(props) {
    return (
      <Day
        {...props}
        textStyle={{
          color: '#fff',
          backgroundColor: '#9e938c',
          borderRadius: 15,
          padding: 10,
        }}
      />
    );
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  renderCustomActions = props => {
    return <CustomActions {...props} />;
  };

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    /* applies the background color chosen by the user for Chat Room */
    const { bgColor } = this.props.route.params;

    return (
      <View style={{
        flex: 1,
        backgroundColor: bgColor
      }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderBubble={this.renderBubble.bind(this)}
          renderSystemMessage={this.renderSystemMessage.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderDay={this.renderDay}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
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