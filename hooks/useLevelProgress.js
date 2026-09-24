import { useState, useEffect, useCallback } from "react";
import { loadProgress, recordResult } from "../lib/progress";
import { unlockAchievements } from "../lib/achievements";

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

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const progress = await loadProgress();
      if (!isMounted) return;
      const entry = progress.levels[String(levelId)];
      setBest(entry ? entry.best : 0);
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
      }

      // Evaluate badges against the run that was just recorded. Runs after
      // the optimistic state updates above so those aren't delayed by a
      // second AsyncStorage round trip. Level screens don't consume
      // newAchievements yet (see NEXT.md); it's exposed for a future pop-up.
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

  return { best, stars, bestStreak, loading, recordWin, recordLoss, newAchievements };
}

export default useLevelProgress;
