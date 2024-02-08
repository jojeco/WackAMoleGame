import { StyleSheet } from "react-native";

const pauseSS = StyleSheet.create({
    pauseScreen: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }, 
    pauseText:{
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '',
        margin: 60,
    }, 
    pauseContainer: {
      height: '40%',
      width: '70%',
      backgroundColor: 'rgba(173, 216, 230, 0.7)',
      alignContent: 'center',
      
    },
    pauseButtons: {
      
      
    },
  });
export default pauseSS;
