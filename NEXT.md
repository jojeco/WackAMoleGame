# Follow-ups

1. **Consider deduplicating the 10 near-identical `app/level_N.js` files into
   one parameterised `<LevelScreen>` component driven by `lib/levels.js`.**
   Deliberately NOT done this run because it would delete ~1,600 net lines,
   tripping the playbook's pause-and-ask-Jordan rewrite threshold. Ask Jordan
   before doing it.

2. ~~`recordLoss` double-fire~~ Addressed: the `lives <= 0` effect is now
   guarded with `!isGameLost`, so a single run is no longer recorded as a loss
   twice (the timer branch's `lives <= 1` path still records it once). Note the
   pre-existing timer/lives-effect overlap is otherwise unchanged, and saves
   written before this fix keep their inflated `plays`/`losses` counts — there
   is no migration, so the Progress screen will show old inflated totals with
   correct increments accumulating on top.

3. ~~Pre-existing gameplay bug~~ Reframed, not a live bug: the mole timer
   effect's `if (lives <= 1)` game-over check isn't actually reachable on a
   hit. `handleMoleHit` never sets `moleHit` to `true` -- a hit calls
   `randomizeMole()`, which re-randomizes `activeMole` and resets `moleHit`
   to `false`, and that `activeMole` change clears/restarts the pending
   timer via its `useEffect` cleanup before it can fire. So the `lives <= 1`
   check inside the timer only ever runs on a real miss, never on a hit.
   What's left is a cleanup note: `moleHit` is effectively dead state outside
   of the Start-press guard (`setMoleHit(true)` in the Start `Pressable`) and
   could be removed in a future pass, but there's no gameplay bug to fix
   here.

4. ~~Combo system~~ Landed this run (see README and `lib/combo.js`).

5. ~~`randomizeMole()` on levels 2-10 can re-pick the cell that is already
   active~~ Fixed this run: levels 2-10 now use the same do/while re-roll
   pattern `level_1.js` already used, so `randomMole` can never equal
   `activeMole` and the stale-timer misfire can no longer happen.

6. Combo landed without haptics/audio. `expo-haptics` and `expo-av` are
   Expo-bundled and free; next increment could fire a light impact on tier-up
   and a whiff sound on combo break.

7. Combo points are persisted but unused. Candidate: a combo-based star
   criterion or a per-level best-combo board. **Partially addressed** this
   run: `bestStreak`/`comboPoints` now back three achievements
   (`on_fire`, `unstoppable`, `combo_500`) -- the star-criterion/best-combo-
   board ideas themselves are still open.

8. ~~Achievements landed without an in-level pop-up~~ Landed this run: a new
   `components/AchievementToast.js` (styled via `styles/toast-styles.js`)
   reads `newAchievements` and shows one unlock at a time, dismissing on a
   ~2.5s timer or a tap via the hook's new `dismissAchievement`. Wired into
   all 10 `app/level_N.js` files as the last child of the container so it
   draws above the pause/win/loss overlays.

9. Saves written before the `recordLoss` double-fire fix (item 2, above) have
   inflated `plays`/`losses` counts. That means the new `dedicated`
   achievement (`totals.plays >= 25`) can unlock earlier than intended on old
   saves that pre-date the fix -- there's no migration to correct historical
   totals, so this is expected drift rather than a bug in the achievement
   itself.
