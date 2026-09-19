// Consecutive-hit combo logic. Pure and dependency-free so it can be unit
// tested under plain Node. Combo points are a separate stat: they NEVER feed
// the level `score`, so win conditions and lives are unaffected.

// Highest matching tier wins, so keep this sorted by descending minStreak.
export const COMBO_TIERS = [
  { minStreak: 8, multiplier: 4, label: "On Fire" },
  { minStreak: 5, multiplier: 3, label: "Hot" },
  { minStreak: 3, multiplier: 2, label: "Nice" },
];

export function createComboState() {
  return { streak: 0, bestStreak: 0, comboPoints: 0 };
}

// Returns the matching tier, or null while the streak is below the first one.
export function tierFor(streak) {
  return COMBO_TIERS.find((tier) => streak >= tier.minStreak) || null;
}

export function multiplierFor(streak) {
  const tier = tierFor(streak);
  return tier ? tier.multiplier : 1;
}

// events: { type: "hit" | "miss" | "reset" }. Unknown events are ignored.
export function comboReducer(state, event) {
  switch (event && event.type) {
    case "hit": {
      const streak = state.streak + 1;
      return {
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
        comboPoints: state.comboPoints + multiplierFor(streak),
      };
    }
    case "miss":
      // A miss only breaks the streak; best streak and points are kept.
      return { ...state, streak: 0 };
    case "reset":
      return createComboState();
    default:
      return state;
  }
}
