import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Pressable } from "react-native";
import toastStyles from "../styles/toast-styles";

const HOLD_MS = 2500;
const FADE_MS = 200;

// In-level achievement-unlock pop-up. Reads the head of the
// `achievements` queue (useLevelProgress's `newAchievements`) and shows
// only that one; when it dismisses (timeout or tap) it calls
// onDismiss(id), which removes it from the queue, and the next queued
// achievement then renders automatically since this always reads
// achievements[0]. Positioned above the pause/win/loss overlays
// (styles/pauseStyle.js's pauseScreen) and wrapped in
// pointerEvents="box-none" so it never blocks Retry/Next Level/Home
// buttons or mole taps underneath. Animation follows the same Animated +
// useNativeDriver pattern as components/ComboMeter.js.
export default function AchievementToast({ achievements, onDismiss }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const current = achievements && achievements.length > 0 ? achievements[0] : null;
  const currentId = current ? current.id : null;

  useEffect(() => {
    if (!currentId) return undefined;

    opacity.setValue(0);
    const fadeIn = Animated.timing(opacity, {
      toValue: 1,
      duration: FADE_MS,
      useNativeDriver: true,
    });
    fadeIn.start();

    const holdTimer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_MS,
        useNativeDriver: true,
      }).start(({ finished }) => {
        // stopAnimation() in cleanup (unmount / id change) ends this with
        // finished=false -- only dismiss when the fade-out actually ran.
        if (finished) onDismiss(currentId);
      });
    }, HOLD_MS);

    return () => {
      clearTimeout(holdTimer);
      opacity.stopAnimation();
    };
  }, [currentId]);

  if (!current) return null;

  return (
    <View style={toastStyles.wrapper} pointerEvents="box-none">
      <Animated.View style={[toastStyles.banner, { opacity }]}>
        <Pressable onPress={() => onDismiss(current.id)}>
          <Text style={toastStyles.heading}>Achievement unlocked!</Text>
          <Text style={toastStyles.title}>{current.title}</Text>
          <Text style={toastStyles.description}>{current.description}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
