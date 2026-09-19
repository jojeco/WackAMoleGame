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
