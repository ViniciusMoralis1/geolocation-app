import React, { useEffect, useState } from 'react';
import { SafeAreaView, PermissionsAndroid, TouchableOpacity, View, TextInput, Text, Keyboard, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Local from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';

import api from '../../services/api';

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
        await AsyncStorage.getItem('@locations').then((obj) => {
          if(locations){
            setLocations([...locations, obj]);
          } else{
            setLocations(obj);
          }
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
    if(annotation.length == 0){
      Alert.alert(
        'Erro',
        "Não é possível adicionar uma localização sem uma anotação.",
        [{
          text: 'OK',
          style: 'default'
        }]
      )
    }
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
      let data = {
        "latitude": latitude,
        "longitude": longitude,
        "annotation": annotation,
        "datetime": date,
        "sync": false,
        "color": "green"
      };
      if (locations){
        setLocations([...locations, data]);
      } else {
        setLocations(data);
      }
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
    if(locations.length == 0){
      Alert.alert(
        "Erro",
        "Não há localizações salvas para sincronizar.",
        [{
          text: "OK",
          style: "cancel",
        }]
      )
    } else {
      Alert.alert(
        "Sincronizando",
        "Aguarde um momento...",
        [{
          text: 'OK',
          style: 'default',
        }]
      )
      let canSync = [];
      locations.map(location => {
        if(!location.sync) {
          canSync.push(location);
        }
      })
      //estou mandando sem o e-mail como parametro pois não estava chegando nenhum e-mail
      try{
        const response = await api.post('/hooks/catch/472009/09rj5z/', canSync);
        if(response.data.status == "success"){
          Alert.alert(
            'Sucesso',
            "Suas localizações estão sincronizadas.",
            [{
              text: 'OK',
              style: 'default'
            }]
          )
          canSync.map(location => {
            location.sync = true
            location.color = "tan"
          })
          setLocations([...locations, ...canSync]);
        }
      }catch(err){
        console.log("erro: " + err);
      }
    }
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
        { locations.length > 0 ? (
          locations.map((location) => {
            { location != null ? (
              <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} pinColor={location.color}>
              <Callout>
                <View style={styles.callout}>
                  <Text style={[styles.text, { fontWeight: 'bold'}]}>{location.annotation}</Text>
                  <Text style={styles.text}>{location.datetime}</Text>
                </View>
              </Callout>
            </Marker>
            )
            : <></>
          }})
        ) : <></>}
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