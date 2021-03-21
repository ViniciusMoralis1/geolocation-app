import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: '#FFF'
  },
  map: {
    flex: 1, 
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  buttonAdd: {
    position: 'absolute',
    height: 40,
    width: 40,
    borderRadius: 25,
    justifyContent: 'center',
    backgroundColor: '#666',
    alignItems: 'center',
    alignSelf: 'flex-end',
    elevation: 2,
    bottom: 10,
    right: 10
  },
  buttonSync: {
    height: 40,
    width: 40,
    borderRadius: 25,
    backgroundColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    elevation: 10,
    alignSelf: 'center',
    top: 10,
  }
});