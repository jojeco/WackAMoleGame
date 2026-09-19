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
   criterion or a per-level best-combo board.
