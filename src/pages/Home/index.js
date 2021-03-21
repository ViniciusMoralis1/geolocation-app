import React, { useEffect, useState } from 'react';
import { SafeAreaView, PermissionsAndroid, TouchableOpacity, View, TextInput, Text, Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Local from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';

import styles from './styles';

export default function Home() {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [annotation, setAnnotation] = useState('');
  const [date, setDate] = useState(null);
  const [locations, setLocations] = useState([{}]);

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
        await AsyncStorage.getItem('@locations').then((obj) => {
          setLocations([...locations, obj]);
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

  function addLocation(){
    let today = new Date();
    setDate(("00" + today.getDate()).slice(-2) + ':' + ("00" + (today.getMonth() + 1)).slice(-2)
      + ':' + ("00" + today.getFullYear()).slice(-2) + ' ' + ("00" + today.getHours()).slice(-2)
      + ':' + ("00" + today.getMinutes()).slice(-2) + ':' + ("00" + today.getSeconds()).slice(-2));
    storeData(currentRegion.latitude, currentRegion.longitude, annotation, date);
  };

  async function storeData(latitude, longitude, annotation, date){
    try{
      if(annotation == '' || date == null){
        return false;
      }
      let data = JSON.stringify({
        "latitude": latitude,
        "longitude": longitude,
        "annotation": annotation,
        "datetime": date,
        "sync": false
      });
      if (locations){
        setLocations([...locations, data]);
      } else {
        setLocations(data);
      }
      console.log("locations " + locations);
      let jsonValue = JSON.stringify(locations);
      await AsyncStorage.setItem('@locations', jsonValue).then(() => {
        Keyboard.dismiss();
        setAnnotation('');
      });
    } catch(err){
      console.log("Erro: " + err);
    }
  }

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
      >
        {/* {locations.map(location => {
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} pinColor={'tan'}>

          </Marker>
        })} */}
      </MapView>
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