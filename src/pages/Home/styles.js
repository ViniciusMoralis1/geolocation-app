import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: '#222',
    fontSize: 16
  },
  map: {
    flex: 1, 
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  buttonSync: {
    height: 40,
    width: 40,
    borderRadius: 25,
    backgroundColor: '#E72629',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    elevation: 2,
    alignSelf: 'center',
    top: 10,
  },
  addForm: {
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row'
  },
  buttonAdd: {
    height: 40,
    width: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#199792',
    elevation: 1,
    bottom: 2,
  },
  addInput: {
    flex: 1,
    maxHeight: 120,
    backgroundColor: "#FFF",
    color: "#333",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 2,
    shadowOffset: {
      width: 3,
      height: 3
    },
    marginRight: 15
  }
});