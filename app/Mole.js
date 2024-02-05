import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import moleImage from '../assets/images/mole.png';


const Mole = ({ isVisible, onPress }) => {
    return isVisible ? (
        <TouchableOpacity onPress={onPress} style={styles.moleContainer}>
            <Image source={moleImage} style={styles.mole} />
        </TouchableOpacity>
    ) : (
        <View style={styles.moleContainer} />
    );
    
};



const styles = StyleSheet.create({
    moleContainer: {
        width: 100,  // Adjust size as needed
        height: 100, // Adjust size as needed
        justifyContent: 'center',
        alignItems: 'center',
    },
    mole: {
        width: 100,   // Adjust size as needed
        height: 100,  // Adjust size as needed
    },
});
export default Mole;
