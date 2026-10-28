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
   board ideas themselves are still open. **Further addressed** in a later
   run: the new win/loss `RunSummary` card (see item 11) now surfaces this
   run's `bestStreak`/`comboPoints` directly on the overlay, so the numbers
   are no longer purely invisible persisted state -- but the star-criterion
   and best-combo-board ideas themselves are still unimplemented.

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

10. `app/howToPlay.js` is now a real screen (this run) -- landed via the
    home screen's new "How to Play" link. Good next increments from here:
    - `components/Mole.js` looks like dead code: it imports from
      `'../Styles/MoleStyle'` (capital `Styles`) but the real folder is
      lowercase `styles/`, so the import is case-mismatched on
      case-sensitive filesystems. Worth confirming nothing actually renders
      it before removing.
    - `components/score.js` is fully commented out -- another removal
      candidate.
    - Both of the above are *removals*, not additions, so they may trip the
      playbook's pause-and-ask-Jordan threshold for deleting files; flag
      that before acting on them rather than just deleting in a future run.
    - The "How to Play" screen is currently static prose; a future pass
      could link to it from the pause/loss overlays too, not just the home
      screen. (Note: those overlays just grew a `RunSummary` card -- item 11
      below -- so weigh overlay crowding before adding another link there.)

11. **Run-results card on the win/loss overlays.** Added
    `components/RunSummary.js` + `styles/run-summary-styles.js`, and a new
    `lastRun` state in `hooks/useLevelProgress.js` (set at the start of
    `applyResult` and populated once `recordResult` resolves, using a
    `bestRef` ref to avoid reading stale `best` state). Wired into all 10
    `app/level_N.js` win/loss overlays, just under the title text. Shows
    this run's score, stars (or "No stars" on a loss), a "New best!" line
    when applicable, and the run's `bestStreak`/`comboPoints`.
    `styles/pauseStyle.js`'s `pauseContainer` changed from a fixed
    `height: "40%"` to `minHeight: "40%"` plus a touch of vertical padding
    so the taller win/loss overlays don't clip the new card; the plain
    pause overlay (which doesn't render `RunSummary`) is unaffected since
    its content didn't grow.

12. Good next increments from here:
    - A light haptic/chime specifically on the win overlay appearing (via
      `expo-haptics`/`expo-av`, see item 6) would pair well with the new
      `RunSummary` card landing in the same moment.
    - `RunSummary` only shows *this run's* combo stats. It could also show
      the level's lifetime `bestComboPoints`/`bestStreak` side by side, or
      link out to the Progress screen -- a small step toward the still-open
      star-criterion/best-combo-board idea in item 7.
    - `components/Mole.js`'s case-mismatched import and `components/score.js`'s
      fully-commented-out body (both flagged in item 10) are still open and
      still look like removal candidates -- still flagged as needing
      Jordan's go-ahead before deleting anything, not re-decided here.
