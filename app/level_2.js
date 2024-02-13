import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import Mole from "./Mole";
import styles from "../styles/page-styles";
import pauseSS from "../styles/pauseStyle";
import { Link } from "expo-router";
import pauseImage from "../assets/images/buttonPause.png";

export default function App() {
  const [activeMole, setActiveMole] = useState(null); // State for the active mole
  const [score, setScore] = useState(0); // State for the score
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [gameReset, setGameReset] = useState(false);
  const initialLives = 5; // Starting number of lives
  const [lives, setLives] = useState(initialLives);
  const [moleHit, setMoleHit] = useState(false); // Track if the mole was hit
  const [isGameWon, setIsGameWon] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isGameLost, setIsGameLost] = useState(false);

  const randomizeMole = () => {
    const randomMole = Math.floor(Math.random() * 9);
    setActiveMole(randomMole);
    setMoleHit(false); // Reset mole hit state
  };
  const StartPress = () => {
    setIsVisible(false); // Hide the Pressable
  };
  const handleMoleHit = () => {
    setScore(score + 1);
    // Indicate the mole was hit
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
      }, 800);

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
    if (score >= 20) {
      setIsGameWon(true);
      setIsGameActive(false);
    }
  }, [score]);

  return (
    <View style={styles.container}>
      <View style={pauseSS.pauseButton}>
        <TouchableOpacity onPress={handlePauseGame}>
          <Image source={pauseImage} style={styles.pauseButton} />
        </TouchableOpacity>
      </View>
      <Text style={styles.topRightText}> Level 2</Text>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreStyle}>{score}/20</Text>
      </View>
      <Text style={styles.livesContainer}>Lives:{lives}</Text>

      <View style={styles.grid}>
        {Array.from({ length: 9 }).map((_, index) => (
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
            <Text style={pauseSS.pausedGameText}>
              You lost:{"("} {"\n"} skill issue{" "}
            </Text>
            <Pressable style={pauseSS.pauseButtons} onPress={handleResetGame}>
              <Text style={pauseSS.pauseText}>Retry</Text>
            </Pressable>
            <Link href="/" style={pauseSS.pauseButtons}>
              <Text style={pauseSS.pauseText}>Home</Text>
            </Link>
          </View>
        </View>
      )}
    </View>
  );
}