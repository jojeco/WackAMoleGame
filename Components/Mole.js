import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import moleImage from '../assets/images/mole.png';
import MoleStyles from '../styles/mole-styles';


const Mole = ({ isVisible, onPress }) => {
    return isVisible ? (
        <TouchableOpacity onPress={onPress} style={MoleStyles.moleContainer}>
            <Image source={moleImage} style={MoleStyles.mole} />
        </TouchableOpacity>
    ) : (
        <View style={MoleStyles.moleContainer} />
    );
    
};
export default Mole;
