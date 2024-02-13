import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import Mole from "./Mole";
import styles from "../styles/page-styles";
import pauseSS from "../styles/pauseStyle";
import { Link } from "expo-router";
import pauseImage from "../assets/images/buttonPause.png";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [activeMole, setActiveMole] = useState(null); // State for the active mole
  const [score, setScore] = useState(0); // State for the score
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [gameReset, setGameReset] = useState(false);
  const initialLives = 100; // Starting number of lives
  const [lives, setLives] = useState(initialLives);
  const [moleHit, setMoleHit] = useState(false); // Track if the mole was hit
  const [isGameWon, setIsGameWon] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isGameLost, setIsGameLost] = useState(false);
  const [highScore, setHighScore] = useState(0);

    useEffect(() => {
    const fetchHighScore = async () => {
      const storedHighScore = await AsyncStorage.getItem('highScore');
      if (storedHighScore) {
        setHighScore(parseInt(storedHighScore, 10));
      }
    };

    fetchHighScore();
  }, []);

  const getHighScore = async () => {
    try {
      const value = await AsyncStorage.getItem('highScore');
      if(value !== null) {
        // Value stored in 'highScore', parse it as it's stored as string
        return parseInt(value, 10);
      }
    } catch(e) {
      // Error retrieving data
      console.log(e);
    }
    return 0; // Default high score is 0 if not found
  };
  
  const saveHighScore = async (score) => {
    try {
      await AsyncStorage.setItem('highScore', score.toString());
    } catch (e) {
      // Saving error
      console.log(e);
    }
  };
  
  // After game ends or when the score is updated
  const updateHighScore = async (newScore) => {
    const highScore = await getHighScore();
    if (newScore > highScore) {
      await saveHighScore(newScore);
    }
  };
  

  const randomizeMole = () => {
    let randomMole;
    do {
      randomMole = Math.floor(Math.random() * 6); // Assuming you have 6 moles/spots
    } while (randomMole === activeMole);
    setActiveMole(randomMole);
    setMoleHit(false); // Reset mole hit state
  };
  

  const StartPress = () => {
    setIsVisible(false); // Hide the Pressable
  };

  const handleMoleHit = () => {
    setScore(score + 1); // Indicate the mole was hit
    randomizeMole();
  };

  useEffect(() => {
    if (isGameActive && !isGamePaused) {
      const moleTimer = setTimeout(() => {
        if (!moleHit) {
          setLives((prevLives) => prevLives - 1);
        }

        if (lives <= 1) {
          setIsGameLost(true);
          setIsGameActive(false);
          setLives(initialLives);
          setScore(0);
        }
        randomizeMole();
      }, 1000);

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
    setGameReset((prevState) => !prevState); // Toggle to trigger useEffect
    setLives(initialLives); // Reset lives on game reset
    setIsVisible(true);
  };

  useEffect(() => {
    if (lives <= 0) {
      setIsGameLost(true);
      setIsGameActive(false);
    }
  }, [lives]);

  useEffect(() => {
    if (score >= 10) {
      setIsGameWon(true);
      setIsGameActive(false);
    }
  }, [score]);

  return (
    <View style={styles.container}>
      <View style= {styles.highScore}>
        <Text>High Score: {'\n'}{highScore}</Text>
      </View>
      <View style={pauseSS.pauseButton}>
        <TouchableOpacity onPress={handlePauseGame}>
          <Image source={pauseImage} style={styles.pauseButton} />
        </TouchableOpacity>
      </View>
      <Text style={styles.topRightText}> Level 1</Text>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreStyle}>{score}/10</Text>
      </View>
      <Text style={styles.livesContainer}>Lives:{lives}</Text>

      <View style={styles.grid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={index} style={styles.cell3x3}>
            <Mole
              isVisible={isGameActive && !isGamePaused && activeMole === index}
              onPress={handleMoleHit}
            />
          </View>
        ))}
      </View>
      {isVisible && (
        <Pressable
          style={styles.buttonStyles}
          onPress={() => {
            setIsGameActive(true), setMoleHit(true), StartPress();
          }}
        >
          <Text
            style={{ textAlign: "center", fontSize: 23, fontWeight: "bold" }}
          >
            Start Game
          </Text>
        </Pressable>
      )}
      {isGamePaused && (
        <View style={pauseSS.pauseScreen}>
          <View style={pauseSS.pauseContainer}>
            <Text style={pauseSS.pausedGameText}>Game Paused</Text>
            <Pressable style={pauseSS.pauseButtons} onPress={handleResumeGame}>
              <Text style={pauseSS.pauseText}>Resume</Text>
            </Pressable>
            <Pressable style={pauseSS.pauseButtons} onPress={handleResetGame}>
              <Text style={pauseSS.pauseText}>Reset</Text>
            </Pressable>
            <Link href="/" style={pauseSS.pauseButtons}>
              <Text style={pauseSS.pauseText}>Home</Text>
            </Link>
          </View>
        </View>
      )}
      {isGameWon && (
        <View style={pauseSS.pauseScreen}>
          <View style={pauseSS.pauseContainer}>
            <Text style={pauseSS.pausedGameText}>You Won!</Text>
            <Link href="/level_2" style={pauseSS.pauseButtons}>
              <Text style={pauseSS.pauseText}>Next Level</Text>
            </Link>
            <Link href="/" style={pauseSS.pauseButtons}>
              <Text style={pauseSS.pauseText}>Home</Text>
            </Link>
          </View>
        </View>
      )}
      {isGameLost && (
        <View style={pauseSS.pauseScreen}>
          <View style={pauseSS.pauseContainer}>
            <Text style={pauseSS.pausedGameText}>You lost level 1{'\n'} you suck</Text>
            <Link href="/level_2" style={pauseSS.pauseButtons}>
              <Text style={pauseSS.pauseText}>Next Level</Text>
            </Link>
            <Link href="/" style={pauseSS.pauseButtons}>
              <Text style={pauseSS.pauseText}>Home</Text>
            </Link>
          </View>
        </View>
      )}
    </View>
  );
}
