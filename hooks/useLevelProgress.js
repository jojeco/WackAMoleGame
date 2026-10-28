import { useState, useEffect, useCallback, useRef } from "react";
import { loadProgress, recordResult } from "../lib/progress";
import { unlockAchievements } from "../lib/achievements";
import { starsFor, getLevel } from "../lib/levels";

// Per-level progress hook: loads the saved best/stars for `levelId` on
// mount, and exposes recordWin/recordLoss which persist a result and
// optimistically update local state so the UI reflects it immediately
// (no need to wait for the next AsyncStorage round trip).
export function useLevelProgress(levelId) {
  const [best, setBest] = useState(0);
  const [stars, setStars] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newAchievements, setNewAchievements] = useState([]);
  const [lastRun, setLastRun] = useState(null);
  // applyResult only depends on [levelId] (see below), so reading the
  // `best` state value directly inside it would be stale -- this ref is
  // kept in sync wherever `best` is set (on load, and in applyResult) so
  // applyResult can read the up-to-date value synchronously.
  const bestRef = useRef(0);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const progress = await loadProgress();
      if (!isMounted) return;
      const entry = progress.levels[String(levelId)];
      const loadedBest = entry ? entry.best : 0;
      setBest(loadedBest);
      bestRef.current = loadedBest;
      setStars(entry ? entry.stars : 0);
      setBestStreak(entry ? entry.bestStreak : 0);
      setLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [levelId]);

  const applyResult = useCallback(
    async (score, livesLeft, won, combo = {}) => {
      setLastRun(null);
      const prevBest = bestRef.current;

      const progress = await recordResult({
        levelId,
        score,
        livesLeft,
        won,
        bestStreak: combo.bestStreak,
        comboPoints: combo.comboPoints,
      });
      const entry = progress.levels[String(levelId)];
      if (entry) {
        setBest((prevBest) => Math.max(prevBest, entry.best));
        setStars((prevStars) => Math.max(prevStars, entry.stars));
        setBestStreak((prevStreak) => Math.max(prevStreak, entry.bestStreak));
        bestRef.current = Math.max(bestRef.current, entry.best);
      }

      setLastRun({
        won,
        score,
        stars: starsFor(getLevel(levelId), score, livesLeft),
        isNewBest: score > prevBest && score > 0,
        bestStreak: combo.bestStreak || 0,
        comboPoints: combo.comboPoints || 0,
      });

      // Evaluate badges against the run that was just recorded. Runs after
      // the optimistic state updates above so those aren't delayed by a
      // second AsyncStorage round trip. Level screens render
      // AchievementToast against newAchievements/dismissAchievement to pop
      // these up one at a time (see NEXT.md).
      const runInfo = {
        levelId,
        score,
        livesLeft,
        won,
        bestStreak: combo.bestStreak,
        comboPoints: combo.comboPoints,
      };
      const { newlyUnlocked } = await unlockAchievements(progress, runInfo);
      if (newlyUnlocked.length > 0) {
        setNewAchievements((prev) => [...prev, ...newlyUnlocked]);
      }
    },
    [levelId]
  );

  const recordWin = useCallback(
    (score, livesLeft, combo = {}) => applyResult(score, livesLeft, true, combo),
    [applyResult]
  );

  const recordLoss = useCallback(
    (score, combo = {}) => applyResult(score, 0, false, combo),
    [applyResult]
  );

  const dismissAchievement = useCallback(
    (id) => setNewAchievements((prev) => prev.filter((a) => a.id !== id)),
    []
  );

  return {
    best,
    stars,
    bestStreak,
    loading,
    recordWin,
    recordLoss,
    newAchievements,
    dismissAchievement,
    lastRun,
  };
}

export default useLevelProgress;
