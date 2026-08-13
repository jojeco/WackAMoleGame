# NEXT.md — WackAMoleGame

Micro-improver left these for future sessions:

- `app/howToPlay.js` is 0 bytes and linked nowhere — implement a How-to-Play screen with rules and add a "How to Play" button to the home screen
- `components/score.js` contains broken/commented-out code referencing undeclared state — either delete or rewrite as a proper Score component
- `components/pauseMenu.js` references undeclared state variables and is not imported anywhere — delete or fix and wire in
- `app/Mole.js` (in use) vs `components/Mole.js` (unused, has Linux path case mismatch `../Styles/MoleStyle`) — consolidate to one Mole component
- `level_5.js` renders 16 cells with `styles.cell3x3` instead of a `cell4x4` style — add proper style
- High score tracking: add AsyncStorage high score to levels 2–10 (currently only level_1 has it, and that was fixed this session)
