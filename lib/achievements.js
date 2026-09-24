// Achievements/badges layer built on top of lib/progress.js's save data.
// Same defensive style as progress.js: every exported function is
// try/catch-wrapped and falls back to a safe default on any storage error,
// so a bad blob or a storage failure must never crash a level/progress
// screen.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LEVELS } from "./levels";

const STORAGE_KEY = "@wam/achievements/v1";

export function defaultAchievementsState() {
  return { version: 1, unlocked: {}, seen: {} };
}

// Coerces whatever came out of storage into a well-formed state object, the
// same way progress.js's normalize() does, so a corrupt blob (or a raw
// object missing `unlocked`/`seen`) never has to be guarded against by
// every caller.
function normalize(raw) {
  const base = defaultAchievementsState();
  if (!raw || typeof raw !== "object") return base;

  const unlocked = {};
  if (raw.unlocked && typeof raw.unlocked === "object") {
    Object.keys(raw.unlocked).forEach((id) => {
      if (typeof raw.unlocked[id] === "string") unlocked[id] = raw.unlocked[id];
    });
  }

  const seen = {};
  if (raw.seen && typeof raw.seen === "object") {
    Object.keys(raw.seen).forEach((id) => {
      if (raw.seen[id]) seen[id] = true;
    });
  }

  return { version: 1, unlocked, seen };
}

// Achievement checks read from `progress.levels[id].stars`, never from
// `wins`. The "Unlock All Levels" escape hatch on the Progress screen
// (lib/progress.js#unlockAll) sets `wins = 1` on levels 1-9 without
// touching `stars`, specifically so that cheat button can't be used to farm
// level-completion badges here. Any check gating on level completion
// (first_win/halfway/champion/flawless/perfectionist) must read `stars`.
export const ACHIEVEMENTS = [
  {
    id: "first_hit",
    title: "First Hit",
    description: "Whack your first mole.",
    check: (progress) => progress.totals.moles >= 1,
  },
  {
    id: "first_win",
    title: "First Win",
    description: "Earn a star on any level.",
    check: (progress) =>
      LEVELS.some((level) => {
        const entry = progress.levels[String(level.id)];
        return !!(entry && entry.stars > 0);
      }),
  },
  {
    id: "halfway",
    title: "Halfway There",
    description: "Earn a star on Level 5.",
    check: (progress) => {
      const entry = progress.levels["5"];
      return !!(entry && entry.stars > 0);
    },
  },
  {
    id: "champion",
    title: "Champion",
    description: "Earn a star on Level 10.",
    check: (progress) => {
      const entry = progress.levels["10"];
      return !!(entry && entry.stars > 0);
    },
  },
  {
    id: "flawless",
    title: "Flawless",
    description: "Earn all 3 stars on any single level.",
    check: (progress) =>
      LEVELS.some((level) => {
        const entry = progress.levels[String(level.id)];
        return !!(entry && entry.stars === 3);
      }),
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Earn 3 stars on all 10 levels.",
    // Iterates the known LEVELS list (rather than Object.values(progress.levels))
    // so an empty/partial save can't vacuously satisfy Array.every().
    check: (progress) =>
      LEVELS.every((level) => {
        const entry = progress.levels[String(level.id)];
        return !!(entry && entry.stars === 3);
      }),
  },
  {
    id: "star_collector",
    title: "Star Collector",
    description: "Earn 15 total stars.",
    check: (progress) => {
      const total = LEVELS.reduce((sum, level) => {
        const entry = progress.levels[String(level.id)];
        return sum + (entry ? entry.stars : 0);
      }, 0);
      return total >= 15;
    },
  },
  {
    id: "moles_100",
    title: "Mole Menace",
    description: "Whack 100 moles lifetime.",
    check: (progress) => progress.totals.moles >= 100,
  },
  {
    id: "moles_1000",
    title: "Mole Annihilator",
    description: "Whack 1000 moles lifetime.",
    check: (progress) => progress.totals.moles >= 1000,
  },
  {
    id: "on_fire",
    title: "On Fire",
    description: "Reach an 8-hit combo streak.",
    check: (progress) => progress.totals.bestStreak >= 8,
  },
  {
    id: "unstoppable",
    title: "Unstoppable",
    description: "Reach a 20-hit combo streak.",
    check: (progress) => progress.totals.bestStreak >= 20,
  },
  {
    id: "combo_500",
    title: "Combo Master",
    description: "Earn 500 lifetime combo points.",
    check: (progress) => progress.totals.comboPoints >= 500,
  },
  {
    id: "dedicated",
    title: "Dedicated",
    description: "Play 25 rounds.",
    check: (progress) => progress.totals.plays >= 25,
  },
  {
    id: "comeback",
    title: "Comeback",
    description: "Win a level with only 1 life left.",
    // Run-only: this can't be reconstructed from saved progress (lib/progress.js
    // doesn't persist "won with exactly 1 life left" as a distinct fact), so
    // it deliberately never fires during a backfill pass (run === null).
    check: (progress, run) => !!(run && run.won && run.livesLeft === 1),
  },
];

export async function loadAchievements() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAchievementsState();
    return normalize(JSON.parse(raw));
  } catch (e) {
    console.log("achievements:loadAchievements failed", e);
    return defaultAchievementsState();
  }
}

async function saveAchievements(state) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.log("achievements:saveAchievements failed", e);
  }
}

// Every read-modify-write against STORAGE_KEY goes through this queue so two
// callers (e.g. the home screen's focus backfill and a level's post-run
// unlock finishing at the same moment) can't interleave load/save and have
// one clobber the other's freshly-unlocked badge.
let writeQueue = Promise.resolve();
function serialized(fn) {
  const result = writeQueue.then(fn, fn);
  writeQueue = result.catch(() => {});
  return result;
}

// Pure and synchronous: given a loaded `progress` (from lib/progress.js), an
// optional `run` (null for a backfill pass, or the just-completed run's
// info), and the currently-loaded achievements `state`, returns the ids of
// achievements that pass their check but aren't already in `state.unlocked`.
// Each check is individually try/catch-wrapped so one bad/throwing check
// can't block evaluation of the rest.
export function evaluateAchievements(progress, run, state = defaultAchievementsState()) {
  const safeProgress = progress && typeof progress === "object" ? progress : { levels: {}, totals: {} };
  const safeState = state && typeof state === "object" ? state : defaultAchievementsState();
  const unlocked = safeState.unlocked || {};
  const safeRun = run || null;

  const ids = [];
  ACHIEVEMENTS.forEach((achievement) => {
    if (unlocked[achievement.id]) return;
    try {
      if (achievement.check(safeProgress, safeRun)) {
        ids.push(achievement.id);
      }
    } catch (e) {
      console.log("achievements:evaluate check failed", achievement.id, e);
    }
  });
  return ids;
}

// Loads current state, evaluates `progress`/`run` against it, saves any
// newly-passing achievements with the current timestamp, and returns both
// the resulting state and the full achievement objects (not just ids) that
// were newly unlocked by this call.
export function unlockAchievements(progress, run) {
  return serialized(() => unlockAchievementsUnsafe(progress, run));
}

async function unlockAchievementsUnsafe(progress, run) {
  try {
    const state = await loadAchievements();
    const newIds = evaluateAchievements(progress, run, state);

    if (newIds.length === 0) {
      return { state, newlyUnlocked: [] };
    }

    const now = new Date().toISOString();
    const nextUnlocked = { ...state.unlocked };
    newIds.forEach((id) => {
      nextUnlocked[id] = now;
    });
    const nextState = { version: 1, unlocked: nextUnlocked, seen: { ...state.seen } };

    await saveAchievements(nextState);

    const newlyUnlocked = ACHIEVEMENTS.filter((a) => newIds.indexOf(a.id) !== -1);
    return { state: nextState, newlyUnlocked };
  } catch (e) {
    console.log("achievements:unlockAchievements failed", e);
    return { state: defaultAchievementsState(), newlyUnlocked: [] };
  }
}

// Marks every currently-unlocked achievement as seen. Deliberately does NOT
// mark all of ACHIEVEMENTS as seen -- only ids present in `unlocked` -- so
// that an achievement unlocked *after* this call still shows up as "new"
// via unseenCount() instead of the indicator going dark forever.
export function markAllSeen() {
  return serialized(markAllSeenUnsafe);
}

async function markAllSeenUnsafe() {
  try {
    const state = await loadAchievements();
    const nextSeen = { ...state.seen };
    Object.keys(state.unlocked).forEach((id) => {
      nextSeen[id] = true;
    });
    const nextState = { version: 1, unlocked: state.unlocked, seen: nextSeen };
    await saveAchievements(nextState);
    return nextState;
  } catch (e) {
    console.log("achievements:markAllSeen failed", e);
    return defaultAchievementsState();
  }
}

// Count of achievements that are unlocked but not yet marked seen. Scoped to
// known ACHIEVEMENTS ids so stale/unknown ids left behind by a future
// version change can't inflate the count.
export function unseenCount(state) {
  try {
    if (!state || !state.unlocked) return 0;
    const seen = state.seen || {};
    let count = 0;
    ACHIEVEMENTS.forEach((achievement) => {
      if (state.unlocked[achievement.id] && !seen[achievement.id]) count += 1;
    });
    return count;
  } catch (e) {
    console.log("achievements:unseenCount failed", e);
    return 0;
  }
}

export function resetAchievements() {
  return serialized(resetAchievementsUnsafe);
}

async function resetAchievementsUnsafe() {
  try {
    const fresh = defaultAchievementsState();
    await saveAchievements(fresh);
    return fresh;
  } catch (e) {
    console.log("achievements:resetAchievements failed", e);
    return defaultAchievementsState();
  }
}
