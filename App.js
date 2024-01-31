import Mole from './app/Mole';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function App() {
  const [activeMole, setActiveMole] = useState(null); // State for active mole
  const [score, setScore] = useState(0); // State for score
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [gameReset, setGameReset] = useState(false);
  

  const randomizeMole = () => {
    const randomMole = Math.floor(Math.random() * 9); // For a 3x3 grid
    setActiveMole(randomMole);
  };
  const handleMoleHit = () => {
    setScore(score + 1);
    randomizeMole();
  };
  useEffect(() => {
    let interval;
    if (isGameActive) {
      interval = setInterval(() => {
        randomizeMole();
      }, 1000); // Change every second
    }
    return () => clearInterval(interval);
  }, [isGameActive]);

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
    <View style={styles.container}>
      {/* Start Button */}
      {!isGameActive && (
        <Button 
          title="Start Game" 
          onPress={() => setIsGameActive(true)} 
        />
      )}

      {/* Score Display */}
      <Text>Score: {score}</Text>

      {/* Game Grid */}
      <View style={styles.grid}>
        {Array.from({ length: 9 }).map((_, index) => (
          <View key={index} style={styles.cell}>
            <Mole isVisible={isGameActive && activeMole === index} onPress={handleMoleHit} />
          </View>
        ))}
      </View>
    </View>
  );
}
return (
  <View style={styles.container}>
    {isGameActive && (
      <Button title="Pause Game" onPress={handlePauseGame} />
    )}
    
    {isGamePaused && (
      <View style={styles.pauseScreen}>
        <Text>Game Paused</Text>
        <Button title="Resume Game" onPress={handleResumeGame} />
        <Button title="Reset Game" onPress={handleResetGame} />
      </View>
    )}

    {/* Your existing game UI */}
  </View>
);



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
  grid: {
    width: 300, // Set the width of the grid
    height: 300, // Set the height of the grid
    flexDirection: 'row', // Align children in a row
    flexWrap: 'wrap', // Allow wrapping of children
    justifyContent: 'center', // Center children horizontally
    alignItems: 'center', // Center children vertically
  },
  cell: {
    width: '33%', // Each cell is a third of the grid width
    height: '33%', // Each cell is a third of the grid height
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  
});
