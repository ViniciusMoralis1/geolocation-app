import React, { useEffect, useState } from 'react';
import { SafeAreaView, PermissionsAndroid, TouchableOpacity, Text } from 'react-native';
import MapView  from 'react-native-maps';
import Local from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Feather';

import styles from './styles';

export default function Home() {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    async function requestGeolocationPermission() {
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
        if(granted === PermissionsAndroid.RESULTS.GRANTED) {
          Local.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            setCurrentRegion({latitude, longitude, latitudeDelta: 1, longitudeDelta: 1})
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
    requestGeolocationPermission();
  }, []);

  function handleRegionChanged(region){
    setCurrentRegion(region);
  }

  if(!currentRegion){
    return null;
  }

  function addLocation(){
    console.log('add location')
  };

  async function syncLocations() {
    console.log('sync locations')
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView onRegionChangeComplete={handleRegionChanged} initialRegion={currentRegion} style={styles.map} zoomEnabled={true} showsUserLocation={true}
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