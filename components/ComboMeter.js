import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import comboStyles from "../styles/combo-styles";

// Live streak/multiplier badge. Overlay only: pointerEvents="none" so it can
// never swallow a mole tap. Hidden until the streak reaches 2.
export default function ComboMeter({ streak, multiplier, tierLabel }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // Pulse on every streak change.
  useEffect(() => {
    if (streak < 2) return undefined;
    scale.setValue(1.35);
    opacity.setValue(0.6);
    const pulse = Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]);
    pulse.start();
    return () => pulse.stop();
  }, [streak, scale, opacity]);

  if (streak < 2) return null;

  return (
    <View style={comboStyles.wrapper} pointerEvents="none">
      <Animated.View
        style={[comboStyles.badge, { opacity, transform: [{ scale }] }]}
      >
        <Text style={comboStyles.streakText}>{streak} streak</Text>
        <Text style={comboStyles.multiplierText}>x{multiplier}</Text>
        {tierLabel ? <Text style={comboStyles.tierText}>{tierLabel}</Text> : null}
      </Animated.View>
    </View>
  );
}
