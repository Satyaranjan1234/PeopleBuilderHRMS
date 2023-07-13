
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  PermissionsAndroid,
  Alert
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Loading from '../component/Loading';




const Punch = ({ navigation }) => {
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.front;

  const [showCamera, setShowCamera] = useState(false);
  const [imageSource, setImageSource] = useState('');

  // state to hold location
  const [location, setLocation] = useState(false);
  const [latitude, setLatitude] = useState(20.2376);
  const [longitude, setLongitude] = useState(84.2700);

  // function to check permissions and get Location
  const getLocation = async () => {
    // Function to get permission for location
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Geolocation Permission',
            message: 'Can we access your location?',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log('granted', granted);
        if (granted === 'granted') {
          console.log('You can use Geolocation');
          return true;
        } else {
          console.log('You cannot use Geolocation');
          return false;
        }
      } catch (err) {
        return false;
      }
    };
    //function for camera permission
    async function getPermission() {
      const newCameraPermission = await Camera.requestCameraPermission();
      console.log(newCameraPermission);
    }
    // calling of location permission function
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
            setLongitude(position.coords.longitude);
            setLatitude(position.coords.latitude);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
        //calling of camera permission function
        getPermission();
      }
      else {
        Alert.alert('Geolocation Permission', 'Please allow to access location for Punch , Otherwise you can not Punch.', [
          { text: 'OK', onPress: async () => console.log("ok") },
        ]);
        navigation.goBack();
      }
    });
    console.log(location)
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    // Move the map region to the user's current location when coordinates are available
    if (mapViewRef.current && latitude && longitude) {
      mapViewRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
    }
  }, [latitude, longitude]);

  const mapViewRef = React.useRef(null);

  const capturePhoto = async () => {
    if (camera.current !== null) {
      const photo = await camera.current.takePhoto({});
      setImageSource(photo.path);
      setShowCamera(false);
      console.log(photo.path);
    }
  };

  if (device == null) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapcontainer}>
        <MapView
          ref={mapViewRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 20.2376,
            longitude: 84.2700,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          showUserLocation={true}
        >
          <Marker coordinate={{ latitude, longitude }} />
        </MapView>
        <View>
          <View style={styles.ImgContainer}>
            {imageSource !== '' ? (
              <Image
                style={styles.Image}
                source={{
                  uri: `file://'${imageSource}`,
                }}
              />
            ) : (
              <Image source={require('../assets/mypic.jpeg')} style={styles.Image} />
            )}
          </View>
        </View>

      </View>
      <View style={{ marginTop: 50 }}>
        {/* <Text style={{color:'black'}}>Time</Text> */}
        <Text style={styles.text}>Longitude : {longitude}</Text>
        <Text style={styles.text}>Latitude: {latitude}</Text>
      </View>
      <View style={styles.btnView}>
        <TouchableOpacity style={styles.btn} onPress={() => setShowCamera(true)}>
          <Text style={styles.txt}>Take Selfie</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.txt}>Punch</Text>
        </TouchableOpacity>
      </View>
      {showCamera && (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={showCamera}
            photo={true}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.camButton} onPress={() => capturePhoto()} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    height: '100%',
  },
  mapcontainer: {
    height: '70%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  ImgContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    bottom: -40,
    alignSelf: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'gray',
  },
  Image: {
    width: 200,
    height: 200,
  },
  btnView: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 30,
  },
  btn: {
    height: 50,
    width: '40%',
    backgroundColor: '#aa18ea',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: 0,
    padding: 20,
  },
  camButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#B2BEB5',
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  text: {
    color: 'black',
    fontSize: 15
  }
});

export default Punch;
