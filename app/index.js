import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import indexStyles from "../styles/index-styles";
import progressStyles from "../styles/progress-styles";
import { LEVELS } from "../lib/levels";
import { loadProgress, isUnlocked, defaultProgress } from "../lib/progress";
import {
  ACHIEVEMENTS,
  unlockAchievements,
  unseenCount,
  defaultAchievementsState,
} from "../lib/achievements";

function starGlyphs(stars) {
  return "*".repeat(stars) || "-";
}

export default function Page() {
  const [progress, setProgress] = useState(defaultProgress);
  const [achievementsState, setAchievementsState] = useState(defaultAchievementsState);

  // Reload progress every time this screen gains focus so tiles reflect the
  // result of whatever level the player just came back from. Also runs the
  // achievements backfill here so a returning player gets credit for
  // milestones already sitting in their save, not just future runs.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        const loaded = await loadProgress();
        if (isActive) setProgress(loaded);
        const { state } = await unlockAchievements(loaded, null);
        if (isActive) setAchievementsState(state);
      })();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const totals = progress.totals;
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => achievementsState.unlocked[a.id]).length;
  const unseenAchievements = unseenCount(achievementsState);

  return (
    <ScrollView contentContainerStyle={progressStyles.scrollContainer}>
      <View style={indexStyles.titleContainer}>
        <Text style={indexStyles.titleText}>Welcome to Whack A Molé!</Text>
      </View>
      <Text style={indexStyles.subText}>Chose a level to begin</Text>

      <View style={progressStyles.headerStrip}>
        <Text style={progressStyles.headerTitle}>Lifetime Stats</Text>
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
        </View>
        <Link href="/progress" asChild>
          <Pressable style={progressStyles.progressLinkButton}>
            <Text style={progressStyles.progressLinkText}>View Progress</Text>
          </Pressable>
        </Link>

        <View style={progressStyles.achievementsRow}>
          <Link href="/achievements" asChild>
            <Pressable style={progressStyles.achievementsLinkButton}>
              <Text style={progressStyles.achievementsLinkText}>
                Achievements ({unlockedAchievements}/{ACHIEVEMENTS.length})
              </Text>
            </Pressable>
          </Link>
          {unseenAchievements > 0 && (
            <View style={progressStyles.achievementsBadge}>
              <Text style={progressStyles.achievementsBadgeText}>{unseenAchievements} new</Text>
            </View>
          )}
        </View>
      </View>

      <View style={progressStyles.levelGrid}>
        {LEVELS.map((level) => {
          const entry = progress.levels[String(level.id)];
          const best = entry ? entry.best : 0;
          const stars = entry ? entry.stars : 0;
          const unlocked = isUnlocked(progress, level.id);

          if (!unlocked) {
            return (
              <View
                key={level.id}
                style={[progressStyles.levelTile, progressStyles.levelTileLocked]}
              >
                <Text style={progressStyles.levelNumber}>{level.id}</Text>
                <Text style={progressStyles.levelLockedText}>Locked</Text>
              </View>
            );
          }

          return (
            <Link key={level.id} href={level.route} asChild>
              <Pressable style={progressStyles.levelTile}>
                <Text style={progressStyles.levelNumber}>{level.id}</Text>
                <Text style={progressStyles.levelBest}>Best: {best}</Text>
                <Text style={progressStyles.levelStars}>{starGlyphs(stars)}</Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </ScrollView>
  );
}
