import React from "react";
import { View, Text, ScrollView } from "react-native";
import indexStyles from "../styles/index-styles";
import progressStyles from "../styles/progress-styles";
import { COMBO_TIERS } from "../lib/combo";

// Static help screen. Combo numbers are read from COMBO_TIERS instead of
// being retyped here, so this text can't drift from the real game logic.
const comboLines = [...COMBO_TIERS]
  .sort((a, b) => a.minStreak - b.minStreak)
  .map((tier) => `x${tier.multiplier} at ${tier.minStreak} hits in a row ("${tier.label}")`);

export default function HowToPlay() {
  return (
    <ScrollView contentContainerStyle={progressStyles.scrollContainer}>
      <View style={indexStyles.titleContainer}>
        <Text style={indexStyles.titleText}>How to Play</Text>
      </View>

      <View style={progressStyles.headerStrip}>
        <Text style={progressStyles.headerTitle}>The Basics</Text>
        <Text style={progressStyles.headerSubtitle}>
          Tap a mole before it hides back in its hole -- a missed mole costs
          you a life. Reach the level's target score to win; run out of
          lives first and it's a loss.
        </Text>
      </View>

      <View style={progressStyles.headerStrip}>
        <Text style={progressStyles.headerTitle}>Stars</Text>
        <Text style={progressStyles.headerSubtitle}>
          3 stars: win without losing a single life. 2 stars: win with more
          than half your starting lives left. 1 star: win by any margin.
        </Text>
      </View>

      <View style={progressStyles.headerStrip}>
        <Text style={progressStyles.headerTitle}>Combos</Text>
        <Text style={progressStyles.headerSubtitle}>
          Hit moles back-to-back to build a combo multiplier:
        </Text>
        {comboLines.map((line) => (
          <Text key={line} style={progressStyles.headerSubtitle}>
            {line}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}
