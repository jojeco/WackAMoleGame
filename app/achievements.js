import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import indexStyles from "../styles/index-styles";
import progressStyles from "../styles/progress-styles";
import achievementsStyles from "../styles/achievements-styles";
import { loadProgress } from "../lib/progress";
import {
  ACHIEVEMENTS,
  unlockAchievements,
  markAllSeen,
  defaultAchievementsState,
} from "../lib/achievements";

// Avoid toLocaleDateString: Hermes' Intl support varies by build/platform,
// so keep this to a plain ISO-date slice instead.
function formatUnlockDate(iso) {
  if (!iso || typeof iso !== "string" || iso.length < 10) return "";
  return iso.slice(0, 10);
}

export default function AchievementsScreen() {
  const [achievementsState, setAchievementsState] = useState(defaultAchievementsState);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        const progress = await loadProgress();
        // Backfill first (covers milestones already in the save), then mark
        // everything currently unlocked as seen. These run strictly in
        // sequence -- both are read-modify-write calls against the same
        // storage key, so running them concurrently could let one save
        // clobber the other.
        const { state } = await unlockAchievements(progress, null);
        if (!isActive) return;
        setAchievementsState(state);
        await markAllSeen();
      })();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const unlockedCount = ACHIEVEMENTS.filter((a) => achievementsState.unlocked[a.id]).length;

  return (
    <ScrollView contentContainerStyle={progressStyles.scrollContainer}>
      <View style={indexStyles.titleContainer}>
        <Text style={indexStyles.titleText}>Achievements</Text>
      </View>
      <Text style={achievementsStyles.countText}>
        {unlockedCount} / {ACHIEVEMENTS.length} unlocked
      </Text>

      <View style={achievementsStyles.list}>
        {ACHIEVEMENTS.map((achievement) => {
          const unlockedAt = achievementsState.unlocked[achievement.id];
          const isUnlocked = !!unlockedAt;
          return (
            <View
              key={achievement.id}
              style={[
                achievementsStyles.card,
                isUnlocked ? achievementsStyles.cardUnlocked : achievementsStyles.cardLocked,
              ]}
            >
              <Text style={achievementsStyles.cardTitle}>{achievement.title}</Text>
              <Text style={achievementsStyles.cardDescription}>{achievement.description}</Text>
              <Text style={achievementsStyles.cardStatus}>
                {isUnlocked ? `Unlocked ${formatUnlockDate(unlockedAt)}` : "Locked"}
              </Text>
            </View>
          );
        })}
      </View>

      <Link href="/" asChild>
        <Pressable style={progressStyles.homeLink}>
          <Text style={progressStyles.homeLinkText}>Home</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}
