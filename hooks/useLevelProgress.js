import { useState, useEffect, useCallback } from "react";
import { loadProgress, recordResult } from "../lib/progress";

// Per-level progress hook: loads the saved best/stars for `levelId` on
// mount, and exposes recordWin/recordLoss which persist a result and
// optimistically update local state so the UI reflects it immediately
// (no need to wait for the next AsyncStorage round trip).
export function useLevelProgress(levelId) {
  const [best, setBest] = useState(0);
  const [stars, setStars] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(true);

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

  return { best, stars, bestStreak, loading, recordWin, recordLoss };
}

export default useLevelProgress;
