import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import moleImage from '../assets/images/mole.png';
import styles from '../Styles/MoleStyle';


const Mole = ({ isVisible, onPress, onMoleMissed }) => {
    const handlePress = (e) => {
      e.stopPropagation(); // Prevents the grid's touch handler from firing
      onPress();
    };
  
    return isVisible ? (
      <TouchableOpacity onPress={handlePress} style={styles.moleContainer}>
            <Image source={moleImage} style={styles.mole} />
      </TouchableOpacity>
    ) : (
      <View style={styles.moleContainer} onTouchStart={onMoleMissed} />
    );
  };
  

export default Mole;

    
