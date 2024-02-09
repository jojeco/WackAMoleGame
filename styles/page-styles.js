import { StyleSheet, ImageBackground } from "react-native";


const styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  button: {
    backgroundColor: 'lightgreen',
    borderRadius: 30,
    padding: 20,
    marginLeft: 15,
    marginRight: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cell3x3: {
      width: 125,
      height: 125,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'grey',
      backgroundColor: 'lightblue',
      margin:2,
      borderRadius: 100,
    },
    cell4x4: {
      width: 80,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: .75,
      borderColor: '#000',
      backgroundColor: 'lightblue',
      margin:2,
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'center', // Align items vertically
      alignItems: 'center', // Align items horizontally
    },
    topLeftText: {
      position: 'absolute',
      top: 40,
      left: 40,
    },
    topRightText: {
      position: 'absolute',
      top: 60,
      right: 40,
      fontSize: 25,
    },
    centerTop: {
      position: 'absolute',
      flex: 1,
      top: 80,
      fontSize: 40,
    },
    textStyle: {
      padding: 40,
      fontSize: 40,
    },
    buttonContainer: {
      backgroundColor: 'red',
      position: 'absolute',
      bottom: 75, 
      width: 300,
      overflow: 'hidden', // Keeps the button within the container
      borderRadius: 5, // Optional: if you want rounded corners
    },
    

  });
export default styles;
