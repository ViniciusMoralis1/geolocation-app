import React, { useEffect, useState } from 'react';
import { SafeAreaView, PermissionsAndroid, TouchableOpacity, Text } from 'react-native';
import MapView  from 'react-native-maps';
import Local from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Feather';

import styles from './styles';

export default function Home() {
  const [latitude, setLatitude] = useState(-23.583776);
  const [longitude, setLongitude] = useState(-46.588805);
  const [locations, setLocations] = useState([]);

  const requestGeolocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Preciso da sua permissão",
          message:
            "Sua permissão é necessária para podermos acessar sua localização",
          buttonNeutral: "Pergunte depois",
          buttonNegative: "Cancelar",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Podemos usar a localização");
        Local.getCurrentPosition((pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          console.log("latitude: " + latitude + " longitude: " + longitude)
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

  function addLocation(){
    console.log('add location')
  };

  async function syncLocations() {
    console.log('sync locations')
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 1.1,
          longitudeDelta: 1.1
        }}
        zoomEnabled = {true}
        showsUserLocation={true}
      />
      <TouchableOpacity activeOpacity={0.7} style={styles.buttonSync} onPress={syncLocations}>
        <Icon name="refresh-cw" size={24} color="#FFF"/>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.7} style={styles.buttonAdd} onPress={addLocation}>
        <Icon name="plus" size={28} color="#FFF"/>
      </TouchableOpacity>
    </SafeAreaView>
  )
};