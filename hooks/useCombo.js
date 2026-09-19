import { useReducer, useRef, useEffect, useCallback } from "react";
import { comboReducer, createComboState, multiplierFor, tierFor } from "../lib/combo";

// Combo tracker for a level screen. State drives the HUD; a ref mirror lets
// game-over handlers read the latest bestStreak/comboPoints synchronously
// (via getSnapshot) even when the hit that ended the run was dispatched in the
// same tick and React has not re-rendered yet.
export function useCombo() {
  const [state, dispatch] = useReducer(comboReducer, undefined, createComboState);
  const ref = useRef(state);

  // Re-sync the mirror after each render. The actions below also update it
  // eagerly, so this is only a safety net.
  useEffect(() => {
    ref.current = state;
  }, [state]);

  const send = useCallback((event) => {
    ref.current = comboReducer(ref.current, event);
    dispatch(event);
  }, []);

  const registerHit = useCallback(() => send({ type: "hit" }), [send]);
  const registerMiss = useCallback(() => send({ type: "miss" }), [send]);
  const resetCombo = useCallback(() => send({ type: "reset" }), [send]);

  const getSnapshot = useCallback(
    () => ({
      bestStreak: ref.current.bestStreak,
      comboPoints: ref.current.comboPoints,
    }),
    []
  );

  const tier = tierFor(state.streak);

  return {
    streak: state.streak,
    multiplier: multiplierFor(state.streak),
    tierLabel: tier ? tier.label : "",
    comboPoints: state.comboPoints,
    bestStreak: state.bestStreak,
    registerHit,
    registerMiss,
    resetCombo,
    getSnapshot,
  };
}

export default useCombo;
