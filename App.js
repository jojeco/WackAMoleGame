import Mole from './components/Mole';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import theStyles from './styles/page-styles';
//import score from './components/score';




export default function App() {
  const [activeMole, setActiveMole] = useState(null); // State for active mole
  const [score, setScore] = useState(0); // State for score
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [gameReset, setGameReset] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lives, setLives] = useState(3); // Starting with 3 lives


  const handleIncorrectTap = () => {
    if (lives > 1) {
      setLives(lives - 1);
    } else {
      setLives(0);
      setIsGameActive(false); // Stop the game
      setIsGameOver(true); // Set the game over state
    }
  };
  
  const randomizeMole = () => {
    const randomMole = Math.floor(Math.random() * 9); // For a 3x3 grid
    setActiveMole(randomMole);
  };

  const handleIncorrectTap = () => {
    if (lives > 0) {
      setLives(lives - 1);
    } else {
      // Handle game over scenario
    }
  };
  
  const handleMoleHit = () => {
    setScore(score + 1);
  };

  useEffect(() => {
    let interval;
    if (isGameActive && !isGamePaused) {
      interval = setInterval(() => {
        randomizeMole();
      }, 1500); // Change every second
    }
    return () => clearInterval(interval);
  }, [isGameActive, isGamePaused, gameReset]);

  // Pause the game
  const handlePauseGame = () => {
    setIsGamePaused(true);
    setIsGameActive(false); // Temporarily treat the game as inactive
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
  };

  return (
    <View style = {theStyles.container}>
      {isGameActive && !isGamePaused && (
        <Button title="Pause Game" onPress={handlePauseGame} />
      )}

      {!isGameActive && !isGamePaused && (
        <Button title="Start Game" onPress={() => setIsGameActive(true)} />
      )}

      <Text>Score: {score}</Text>
      <Text>Lives: {lives}</Text>

    <View style={styles.grid} onTouchStart={handleIncorrectTap}>
    {Array.from({ length: 9 }).map((_, index) => (
    <View key={index} style={styles.cell}>
      <Mole 
        isVisible={isGameActive && !isGamePaused && activeMole === index} 
        onPress={handleMoleHit} 
        onMoleMissed={handleIncorrectTap}
      />
    </View>
  ))}
</View>

      
      

      {isGamePaused && (
        <View style ={theStyles.pauseScreen}>
          <Text>Game Paused</Text>
          <Button title="Resume Game" onPress={handleResumeGame} />
          <Button title="New Game" onPress={handleResetGame} />
        </View>
      )}
    </View>
  );
}