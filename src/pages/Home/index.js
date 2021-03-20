import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, PermissionsAndroid } from 'react-native';
import MapView  from 'react-native-maps';
import Local from '@react-native-community/geolocation';
import styles from './styles';

export default function Home() {
  const [latitude, setLatitude] = useState(-23.583776);
  const [longitude, setLongitude] = useState(-46.588805);

  const requestGeolocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Preciso da sua permissão",
          message:
            "Sua permissão é necessária para podermos acessar sua localização",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Podemos usar a localização");
        Local.getCurrentPosition((pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          console.log("latitude: " + latitude + "longitude: " + longitude)
        }), 
        (err) => {
          console.log("Erro: " + err)
        },
        { 
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 1000
        }
      } else {
        console.log("Não podemos usar a localização");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    requestGeolocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        zoomEnabled = {true}
        showsUserLocation={true}
      />
    </View>
  )
};