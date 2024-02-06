import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import Mole from './Components/Mole'; 
import styles from './styles/page-styles';

export default function App() {
  const [activeMole, setActiveMole] = useState(null); // State for the active mole
  const [score, setScore] = useState(0); // State for the score
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [gameReset, setGameReset] = useState(false);
  const initialLives = 3; // Starting number of lives
  const [lives, setLives] = useState(initialLives);
  const [moleHit, setMoleHit] = useState(false); // Track if the mole was hit


  const randomizeMole = () => {
    const randomMole = Math.floor(Math.random() * 9);
    setActiveMole(randomMole);
    setMoleHit(false); // Reset mole hit state
  };
  

  const handleMoleHit = () => {
    setScore(score + 1);
    setMoleHit(true); // Indicate the mole was hit
    randomizeMole();  
  };
  
  useEffect(() => {
    if (isGameActive && !isGamePaused) {
      const moleTimer = setTimeout(() => {
        if (!moleHit) {
          setLives((prevLives) => prevLives - 1);
        }
        // Optionally, end game if lives reach 0
        if (lives <= 1) {
          alert('Game Over');
          setIsGameActive(false);
          setLives(initialLives);
        }
        randomizeMole();
      }, 3000); 
  
      return () => clearTimeout(moleTimer);
    }
  }, [activeMole, isGameActive, isGamePaused, moleHit, lives]);
  
  // Pause the game
  const handlePauseGame = () => {
    setIsGamePaused(true);
    setIsGameActive(false); 
  };

  // Resume the game
  const handleResumeGame = () => {
    setIsGamePaused(false);
    setIsGameActive(true);
  };

  // Reset the game
  const handleResetGame = () => {
    setScore(0);
    setActiveMole(null);
    setIsGamePaused(false);
    setIsGameActive(false);
    setGameReset(prevState => !prevState); // Toggle to trigger useEffect
    setLives(initialLives); // Reset lives on game reset
  };
  

  return (
    <View style={styles.container}>
      {isGameActive && !isGamePaused && (
        <Button title="Pause Game" onPress={handlePauseGame} />
      )}

      {!isGameActive && !isGamePaused && (
        <Button title="Start Game" onPress={() => setIsGameActive(true)} />
      )}

      <Text>Score: {score}</Text>
      <Text>Lives: {lives}</Text>

      <View style={styles.grid}>
        {Array.from({ length: 9 }).map((_, index) => (
          <View key={index} style={styles.cell}>
            <Mole isVisible={isGameActive && !isGamePaused && activeMole === index} onPress={handleMoleHit} />
          </View>
        ))}
      </View>
      {isGamePaused && (
        <View style={styles.pauseScreen}>
          <Text>Game Paused</Text>
          <Button title="Resume Game" onPress={handleResumeGame} />
          <Button title="New Game" onPress={handleResetGame} />
        </View>
      )}
    </View>
  );
}