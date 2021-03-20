import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 22,
    color: '#FFF'
  },
  map: {
    flex: 1, 
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
  
});