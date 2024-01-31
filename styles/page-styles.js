import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    cell: {
      width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
        borderWidth: 1,
          borderColor: '#000',
        },
      });
export default styles;
