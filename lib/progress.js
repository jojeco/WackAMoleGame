// Persistence layer for level progress + lifetime stats.
// Everything here is defensive: a storage failure must never hard-lock the
// game, so every exported function is wrapped in try/catch and falls back
// to defaultProgress() (or a best-effort in-memory value) on any error.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLevel, starsFor } from "./levels";

const STORAGE_KEY = "@wam/progress/v1";
const LEVEL_COUNT = 10;

export function defaultProgress() {
  return {
    version: 1,
    levels: {},
    totals: { moles: 0, plays: 0, wins: 0, losses: 0, bestStreak: 0, comboPoints: 0 },
  };
}

function defaultLevelEntry() {
  return { best: 0, stars: 0, wins: 0, losses: 0, plays: 0, bestStreak: 0, bestComboPoints: 0 };
}

// Coerces whatever came out of storage into a well-formed progress object so
// the rest of the app never has to guard against missing fields.
function normalize(raw) {
  const base = defaultProgress();
  if (!raw || typeof raw !== "object") return base;

  const levels = {};
  if (raw.levels && typeof raw.levels === "object") {
    Object.keys(raw.levels).forEach((key) => {
      const entry = raw.levels[key] || {};
      levels[key] = {
        best: Number(entry.best) || 0,
        stars: Number(entry.stars) || 0,
        wins: Number(entry.wins) || 0,
        losses: Number(entry.losses) || 0,
        plays: Number(entry.plays) || 0,
        // Combo fields postdate v1 saves; old entries simply read as 0.
        bestStreak: Number(entry.bestStreak) || 0,
        bestComboPoints: Number(entry.bestComboPoints) || 0,
      };
    });
  }

  const totals = {
    moles: Number(raw.totals && raw.totals.moles) || 0,
    plays: Number(raw.totals && raw.totals.plays) || 0,
    wins: Number(raw.totals && raw.totals.wins) || 0,
    losses: Number(raw.totals && raw.totals.losses) || 0,
    bestStreak: Number(raw.totals && raw.totals.bestStreak) || 0,
    comboPoints: Number(raw.totals && raw.totals.comboPoints) || 0,
  };

  return { version: 1, levels, totals };
}

export async function loadProgress() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return normalize(JSON.parse(raw));
  } catch (e) {
    console.log("progress:loadProgress failed", e);
    return defaultProgress();
  }
}

async function saveProgress(progress) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.log("progress:saveProgress failed", e);
  }
}

// Read-modify-write. `best` and `stars` are max-merged (never overwritten
// downward) so calling this twice for the same result (which the level
// screens deliberately do, once from the timer's loss branch and once from
// the lives<=0 effect) is safe and idempotent for gating purposes.
// Combo stats follow the same rule per level (bestStreak/bestComboPoints are
// max-merged); the lifetime comboPoints total is summed like `moles`.
export async function recordResult({
  levelId,
  score,
  livesLeft,
  won,
  bestStreak = 0,
  comboPoints = 0,
}) {
  try {
    const progress = await loadProgress();
    const key = String(levelId);
    const existing = progress.levels[key] || defaultLevelEntry();
    const level = getLevel(levelId);
    const stars = starsFor(level, score, livesLeft);
    const safeScore = Number(score) || 0;
    const safeStreak = Number(bestStreak) || 0;
    const safeComboPoints = Number(comboPoints) || 0;

    const updatedEntry = {
      best: Math.max(existing.best, safeScore),
      stars: Math.max(existing.stars, stars),
      wins: existing.wins + (won ? 1 : 0),
      losses: existing.losses + (won ? 0 : 1),
      plays: existing.plays + 1,
      bestStreak: Math.max(existing.bestStreak, safeStreak),
      bestComboPoints: Math.max(existing.bestComboPoints, safeComboPoints),
    };

    const nextProgress = {
      version: 1,
      levels: { ...progress.levels, [key]: updatedEntry },
      totals: {
        moles: progress.totals.moles + safeScore,
        plays: progress.totals.plays + 1,
        wins: progress.totals.wins + (won ? 1 : 0),
        losses: progress.totals.losses + (won ? 0 : 1),
        bestStreak: Math.max(progress.totals.bestStreak, safeStreak),
        comboPoints: progress.totals.comboPoints + safeComboPoints,
      },
    };

    await saveProgress(nextProgress);
    return nextProgress;
  } catch (e) {
    console.log("progress:recordResult failed", e);
    return defaultProgress();
  }
}

// Level 1 is always unlocked; level N (N>1) unlocks once level N-1 has at
// least one recorded win.
export function isUnlocked(progress, levelId) {
  try {
    const id = Number(levelId);
    if (id === 1) return true;
    const prev = progress && progress.levels ? progress.levels[String(id - 1)] : null;
    return !!(prev && prev.wins > 0);
  } catch (e) {
    console.log("progress:isUnlocked failed", e);
    return Number(levelId) === 1;
  }
}

// Escape hatch: mark levels 1-9 as having a win so every level 1-10 reads
// as unlocked, without touching best/stars for any level.
export async function unlockAll() {
  try {
    const progress = await loadProgress();
    const levels = { ...progress.levels };
    for (let id = 1; id < LEVEL_COUNT; id += 1) {
      const key = String(id);
      const existing = levels[key] || defaultLevelEntry();
      levels[key] = { ...existing, wins: Math.max(existing.wins, 1) };
    }
    const nextProgress = { ...progress, levels };
    await saveProgress(nextProgress);
    return nextProgress;
  } catch (e) {
    console.log("progress:unlockAll failed", e);
    return defaultProgress();
  }
}

export async function resetProgress() {
  try {
    const fresh = defaultProgress();
    await saveProgress(fresh);
    return fresh;
  } catch (e) {
    console.log("progress:resetProgress failed", e);
    return defaultProgress();
  }
}
