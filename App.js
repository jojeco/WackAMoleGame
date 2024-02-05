import Mole from './app/Mole';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function App() {
  const [activeMole, setActiveMole] = useState(null); 
  const [score, setScore] = useState(0); 
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [gameReset, setGameReset] = useState(false);

  const randomizeMole = () => {
    const randomMole = Math.floor(Math.random() * 9); 
    setActiveMole(randomMole);
  };

  const handleMoleHit = () => {
    setScore(score + 1);
  };

  useEffect(() => {
    let interval;
    if (isGameActive && !isGamePaused) {
      interval = setInterval(() => {
        randomizeMole();
      }, 1000); 
    }
    return () => clearInterval(interval);
  }, [isGameActive, isGamePaused, gameReset]);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  grid: {
    width: '80%',
    height: '60%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    width: '33%',
    height: '33%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  pauseScreen: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
