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

3. Pre-existing gameplay bug, left alone this run because it changes
   difficulty: in the mole timer effect only the life *decrement* is guarded
   by `if (!moleHit)`, while the `if (lives <= 1)` game-over check is not. So
   once you are down to your last life the next timer tick ends the run even
   if you did hit that mole. Fixing it means moving the game-over check
   inside the `!moleHit` branch (or checking the post-decrement value).

4. ~~Combo system~~ Landed this run (see README and `lib/combo.js`).

5. `randomizeMole()` on levels 2-10 can re-pick the cell that is already
   active, so the effect does not restart and a stale timer can cost a life
   (and break a combo) right after a successful hit. Fix alongside the
   `lives <= 1` difficulty change in item 3.

6. Combo landed without haptics/audio. `expo-haptics` and `expo-av` are
   Expo-bundled and free; next increment could fire a light impact on tier-up
   and a whiff sound on combo break.

7. Combo points are persisted but unused. Candidate: a combo-based star
   criterion or a per-level best-combo board. **Partially addressed** this
   run: `bestStreak`/`comboPoints` now back three achievements
   (`on_fire`, `unstoppable`, `combo_500`) -- the star-criterion/best-combo-
   board ideas themselves are still open.

8. Achievements landed without an in-level pop-up. `useLevelProgress` already
   exposes `newAchievements` (the newly-unlocked achievement objects from the
   run that just completed) for exactly this purpose, but no level screen
   consumes it yet. Deliberately deferred because wiring a toast/pop-up in
   means touching all 10 near-identical `app/level_N.js` files, which is the
   same out-of-scope territory as item 1's dedup.

9. Saves written before the `recordLoss` double-fire fix (item 2, above) have
   inflated `plays`/`losses` counts. That means the new `dedicated`
   achievement (`totals.plays >= 25`) can unlock earlier than intended on old
   saves that pre-date the fix -- there's no migration to correct historical
   totals, so this is expected drift rather than a bug in the achievement
   itself.
