import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
// importing Firestore
import * as firebase from 'firebase';
import 'firebase/firestore';

export default class CustomActions extends React.Component {
  onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async buttonIndex => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return this.pickImage();
          case 1:
            console.log('user wants to take a photo');
            return this.takePhoto();
          case 2:
            console.log('user wants to get their location');
            return this.getLocation();
        }
      }
    );
  };

  // choose image from Library
  pickImage = async () => {
    //permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
      }).catch(error => console.log(error));

      if (!result.cancelled) {
        const imgUrl = await this.uploadImage(result.uri);
        this.props.onSend({
          image: imgUrl,
        });
      }
    }
  };

  // Take photo function
  takePhoto = async () => {
    //permission to access camera and media library
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync().catch(error =>
        console.log(error)
      );

      if (!result.cancelled) {
        const imgUrl = await this.uploadImage(result.uri);
        this.props.onSend({
          image: imgUrl,
        });
      }
    }
  };

  // upload image to Firestore
  uploadImage = async uri => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };

      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };

      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length - 1];
    /* const storageRef = ref(storage, `images/${imageName}`);
    await uploadBytes(storageRef, blob)
    blob.close();

    return await getDownloadURL(storageRef).then(url => url) */
    const ref = firebase.storage().ref().child(`images/${imageName}`);
    const snapshot = await ref.put(blob);
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  // User's location function
  getLocation = async () => {
    // permission to access user location
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') {
      let result = await Location.getCurrentPositionAsync({}).catch(error => {
        console.error(error);
      });
      // Send latitude and longitude and the position on the map
      const longitude = JSON.stringify(result.coords.longitude);
      const latitude = JSON.stringify(result.coords.latitude);
      if (result) {
        this.props.onSend({
          location: {
            longitude: result.coords.longitude,
            latitude: result.coords.latitude,
          },
        });
      }
    }
  };

  render() {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="More options"
        style={styles.container}
        onPress={this.onActionPress}
      >
        <View style={styles.iconWrapper}>
          <Text style={[styles.optionsIcon]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  iconWrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  optionsIcon: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};