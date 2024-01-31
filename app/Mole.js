import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import moleImage from '../assets/images/mole.png';


    const Mole = ({ isVisible, onPress }) => {
        return (
            <TouchableOpacity onPress={onPress} style={styles.moleContainer}>
                {isVisible && <Image source={moleImage} style={styles.mole} />}
            </TouchableOpacity>
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
        width: 80,   // Adjust size as needed
        height: 80,  // Adjust size as needed
        // Add any additional styling for the image
    },
});
export default Mole;
