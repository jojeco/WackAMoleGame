import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';


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
