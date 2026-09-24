# WackAMoleGame

Browser-style Whack-a-Mole game built with React Native and Expo Router. Moles pop up randomly across a grid and you tap them before they disappear — score tracking across rounds.

## Tech Stack

- **React Native** (Expo) — cross-platform mobile
- **Expo Router** — file-based navigation
- **AsyncStorage** — persistent high score storage

## Running

```bash
npm install
npx expo start
```

Scan with Expo Go on Android/iOS.

## Combo system

Consecutive hits build a streak (x2 at 3, x3 at 5, x4 at 8); a missed mole breaks it. Multiplier-weighted combo points and the best streak are saved per level and lifetime and shown on the Progress screen. Combo never affects `score`, win targets, or lives. Logic lives in `lib/combo.js`.

## Achievements

14 milestone badges (first hit, star/level completion, lifetime mole counts, combo streak/points thresholds, play count, and a run-only "comeback" for winning on your last life) unlock as you play and are visible from the "Achievements" button on the home screen, which also shows an "N new" indicator for unseen unlocks. Returning players are backfilled against their existing save whenever the home screen or Achievements screen gains focus, so milestones already earned aren't missed. Level-completion badges check `stars`, never `wins`, so the "Unlock All Levels" escape hatch on the Progress screen can't be used to farm them. Badges persist separately from level progress under their own storage key, but "Reset Progress" clears both together so they don't drift out of sync. Logic lives in `lib/achievements.js`, screen is `app/achievements.js`.
