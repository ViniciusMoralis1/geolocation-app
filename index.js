import React from 'react';
import {AppRegistry} from 'react-native';
import Home from './src/pages/Home/index'
import {name as appName} from './app.json';
import { StyleSheet } from 'react-native';

export default function App(){
  return(
    <Home style={styles.font} />
  )
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'Roboto'
  }
})

AppRegistry.registerComponent(appName, () => App);
