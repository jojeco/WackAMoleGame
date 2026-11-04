import React from "react";
import { View, Text } from "react-native";
import runSummaryStyles from "../styles/run-summary-styles";

// Mirrors the "*"/"-" star-glyph convention from app/progress.js's
// starGlyphs() -- not imported from there since that file is a screen, not
// a shared lib, so the tiny helper is duplicated here on purpose.
function starGlyphs(stars) {
  return "*".repeat(stars) || "-";
}

// Small run-results card rendered on the win/loss overlays (app/level_N.js)
// just under the "You Won!"/loss title. Shows how *this* run went: score,
// stars (or "No stars" on a loss), whether it's a new best, and the combo
// stats carried over from useLevelProgress's `lastRun` -- plus the level's
// all-time best streak/combo for comparison, and whether this run just set
// a new one. `?? 0` defaults keep this backward compatible with an older
// `run` shape that predates those fields.
export default function RunSummary({ run }) {
  if (!run) return null;

  return (
    <View style={runSummaryStyles.card}>
      <Text style={runSummaryStyles.scoreText}>Score: {run.score}</Text>
      {run.won === false ? (
        <Text style={runSummaryStyles.starsText}>No stars</Text>
      ) : (
        <Text style={runSummaryStyles.starsText}>{starGlyphs(run.stars)}</Text>
      )}
      {run.isNewBest && (
        <Text style={runSummaryStyles.newBestText}>New best!</Text>
      )}
      <Text style={runSummaryStyles.comboText}>
        Best streak {run.bestStreak} · Combo pts {run.comboPoints}
      </Text>
      <Text style={runSummaryStyles.levelBestText}>
        Level best: streak {run.levelBestStreak ?? 0} · combo{" "}
        {run.levelBestComboPoints ?? 0}
      </Text>
      {run.isNewBestStreak && (
        <Text style={runSummaryStyles.newBestText}>New best streak!</Text>
      )}
      {run.isNewBestCombo && (
        <Text style={runSummaryStyles.newBestText}>New combo record!</Text>
      )}
    </View>
  );
}
