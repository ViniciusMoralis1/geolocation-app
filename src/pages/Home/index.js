import React, { useEffect, useState } from 'react';
import { SafeAreaView, PermissionsAndroid, TouchableOpacity, View, TextInput, Text, Keyboard } from 'react-native';
import MapView  from 'react-native-maps';
import Local from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';

import styles from './styles';

export default function Home() {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [annotation, setAnnotation] = useState('');
  const [date, setDate] = useState(null);
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

    async function getLocationsSaved() {
      try {
        const stored = await AsyncStorage.getItem('@locations').then(() => {
          setLocations(stored);
          console.log(locations);
        })
      } catch(err) {
        console.log("Erro: " + err);
      }
    }
    requestGeolocationPermission();
    getLocationsSaved();
  }, []);

  function handleRegionChanged(region){
    setCurrentRegion(region);
  }

  if(!currentRegion){
    return null;
  }

  async function storeData(){
    try{
      if(annotation.length() == 0 || date == null){
        return false;
      }
      const data = JSON.stringify({
        "latitude": currentRegion.latitude,
        "longitude": currentRegion.longitude,
        "annotation": annotation,
        "datetime": date
      });
      await AsyncStorage.setItem('@locations', data).then(() => {
        setLocations(data);
        console.log("locations " + locations);
        Keyboard.dismiss();

      });
    } catch(err){
      console.log("Erro: " + err);
    }
  }

  function addLocation(){
    let today = new Date();
    setDate(("00" + today.getDate()).slice(-2) + ':' + ("00" + (today.getMonth() + 1)).slice(-2)
      + ':' + ("00" + today.getFullYear()).slice(-2) + ' ' + ("00" + today.getHours()).slice(-2)
      + ':' + ("00" + today.getMinutes()).slice(-2) + ':' + ("00" + today.getSeconds()).slice(-2));
    console.log(date);
    storeData();
  };

  async function syncLocations() {
    console.log('sync locations')
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView 
        onRegionChangeComplete={handleRegionChanged} 
        initialRegion={currentRegion} 
        style={styles.map} 
        zoomEnabled={true} 
        showsUserLocation={true}
      />
      <TouchableOpacity activeOpacity={0.7} style={styles.buttonSync} onPress={syncLocations}>
        <Icon name="refresh-cw" size={24} color="#FFF"/>
      </TouchableOpacity>

      <View style={styles.addForm}>
        <TextInput style={styles.addInput} placeholder="Digite sua anotação aqui..." multiline={true} value={annotation} onChangeText={setAnnotation} />
        <TouchableOpacity activeOpacity={0.7} style={styles.buttonAdd} onPress={addLocation}>
          <Icon name="plus" size={28} color="#FFF"/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
};