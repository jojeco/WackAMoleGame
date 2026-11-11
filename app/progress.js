import React, { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import indexStyles from "../styles/index-styles";
import progressStyles from "../styles/progress-styles";
import { LEVELS } from "../lib/levels";
import {
  loadProgress,
  resetProgress,
  unlockAll,
  defaultProgress,
} from "../lib/progress";
import { resetAchievements } from "../lib/achievements";

function starGlyphs(stars) {
  return "*".repeat(stars) || "-";
}

export default function ProgressScreen() {
  const [progress, setProgress] = useState(defaultProgress);
  // null | "reset" | "unlock" - which destructive button is armed for a
  // second confirming tap. A single value means arming one disarms the
  // other automatically.
  const [armed, setArmed] = useState(null);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(null), 4000);
    return () => clearTimeout(timer);
  }, [armed]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        const loaded = await loadProgress();
        if (isActive) setProgress(loaded);
      })();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleReset = async () => {
    const fresh = await resetProgress();
    setProgress(fresh);
    // Badges reset alongside progress so old timestamps/unlocks don't
    // linger after a wipe.
    await resetAchievements();
  };

  // Deliberately does NOT touch achievements: this is the escape hatch that
  // sets wins=1 on levels 1-9 without awarding stars, and achievement
  // checks are stars-based specifically so this button can't farm badges.
  const handleUnlockAll = async () => {
    const next = await unlockAll();
    setProgress(next);
  };

  const onPressReset = () => {
    if (armed === "reset") {
      handleReset();
      setArmed(null);
    } else {
      setArmed("reset");
    }
  };

  const onPressUnlockAll = () => {
    if (armed === "unlock") {
      handleUnlockAll();
      setArmed(null);
    } else {
      setArmed("unlock");
    }
  };

  const totals = progress.totals;
  const totalStars = LEVELS.reduce(
    (sum, l) => sum + ((progress.levels[String(l.id)] || {}).stars || 0),
    0
  );

  return (
    <ScrollView contentContainerStyle={progressStyles.scrollContainer}>
      <View style={indexStyles.titleContainer}>
        <Text style={indexStyles.titleText}>Progress & Stats</Text>
      </View>

      <View style={progressStyles.headerStrip}>
        <Text style={progressStyles.headerTitle}>Lifetime Totals</Text>
        <Text style={progressStyles.headerSubtitle}>
          Stars: {totalStars} / {LEVELS.length * 3}
        </Text>
        <View style={progressStyles.totalsRow}>
          <View style={progressStyles.totalStat}>
            <Text style={progressStyles.totalStatValue}>{totals.moles}</Text>
            <Text style={progressStyles.totalStatLabel}>Moles</Text>
          </View>
          <View style={progressStyles.totalStat}>
            <Text style={progressStyles.totalStatValue}>{totals.plays}</Text>
            <Text style={progressStyles.totalStatLabel}>Plays</Text>
          </View>
          <View style={progressStyles.totalStat}>
            <Text style={progressStyles.totalStatValue}>{totals.wins}</Text>
            <Text style={progressStyles.totalStatLabel}>Wins</Text>
          </View>
          <View style={progressStyles.totalStat}>
            <Text style={progressStyles.totalStatValue}>{totals.losses}</Text>
            <Text style={progressStyles.totalStatLabel}>Losses</Text>
          </View>
          <View style={progressStyles.totalStat}>
            <Text style={progressStyles.totalStatValue}>{totals.bestStreak}</Text>
            <Text style={progressStyles.totalStatLabel}>Best Streak</Text>
          </View>
          <View style={progressStyles.totalStat}>
            <Text style={progressStyles.totalStatValue}>{totals.comboPoints}</Text>
            <Text style={progressStyles.totalStatLabel}>Combo Pts</Text>
          </View>
        </View>
      </View>

      <View style={progressStyles.table}>
        <View style={progressStyles.tableHeaderRow}>
          <Text style={[progressStyles.tableCellLevel, progressStyles.tableHeaderText]}>
            Level
          </Text>
          <Text style={[progressStyles.tableCell, progressStyles.tableHeaderText]}>Best</Text>
          <Text style={[progressStyles.tableCell, progressStyles.tableHeaderText]}>Stars</Text>
          <Text style={[progressStyles.tableCell, progressStyles.tableHeaderText]}>Wins</Text>
          <Text style={[progressStyles.tableCell, progressStyles.tableHeaderText]}>Losses</Text>
          <Text style={[progressStyles.tableCell, progressStyles.tableHeaderText]}>Plays</Text>
          <Text style={[progressStyles.tableCell, progressStyles.tableHeaderText]}>Streak</Text>
          <Text style={[progressStyles.tableCell, progressStyles.tableHeaderText]}>Combo</Text>
        </View>
        {LEVELS.map((level) => {
          const entry = progress.levels[String(level.id)] || {
            best: 0,
            stars: 0,
            wins: 0,
            losses: 0,
            plays: 0,
            bestStreak: 0,
            bestComboPoints: 0,
          };
          return (
            <View key={level.id} style={progressStyles.tableRow}>
              <Text style={progressStyles.tableCellLevel}>Level {level.id}</Text>
              <Text style={progressStyles.tableCell}>{entry.best}</Text>
              <Text style={progressStyles.tableCell}>{starGlyphs(entry.stars)}</Text>
              <Text style={progressStyles.tableCell}>{entry.wins}</Text>
              <Text style={progressStyles.tableCell}>{entry.losses}</Text>
              <Text style={progressStyles.tableCell}>{entry.plays}</Text>
              <Text style={progressStyles.tableCell}>{entry.bestStreak}</Text>
              <Text style={progressStyles.tableCell}>{entry.bestComboPoints}</Text>
            </View>
          );
        })}
      </View>

      <Pressable
        style={[
          progressStyles.actionButton,
          progressStyles.actionButtonDanger,
          armed === "reset" && progressStyles.actionButtonArmed,
        ]}
        onPress={onPressReset}
      >
        <Text style={progressStyles.actionButtonText}>
          {armed === "reset" ? "Tap again to erase ALL progress" : "Reset Progress"}
        </Text>
      </Pressable>

      <Pressable
        style={[
          progressStyles.actionButton,
          armed === "unlock" && progressStyles.actionButtonArmed,
        ]}
        onPress={onPressUnlockAll}
      >
        <Text style={progressStyles.actionButtonText}>
          {armed === "unlock" ? "Tap again to unlock all levels" : "Unlock All Levels"}
        </Text>
      </Pressable>

      {armed && (
        <Pressable style={progressStyles.actionButton} onPress={() => setArmed(null)}>
          <Text style={progressStyles.actionButtonText}>Cancel</Text>
        </Pressable>
      )}

      <Link href="/" asChild>
        <Pressable style={progressStyles.homeLink}>
          <Text style={progressStyles.homeLinkText}>Home</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}
