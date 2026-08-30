// Single source of truth for the 10 Whack-a-Mole levels.
// Values below are copied from the existing per-level files verbatim
// (see app/level_1.js ... app/level_10.js) -- this file does not rebalance
// difficulty, it only centralizes the numbers that already existed.

export const LEVELS = [
  { id: 1, target: 10, lives: 5, cells: 6, speedMs: 1000, cellStyle: "cell3x3", route: "/level_1", nextRoute: "/level_2" },
  { id: 2, target: 20, lives: 5, cells: 9, speedMs: 800, cellStyle: "cell3x3", route: "/level_2", nextRoute: "/level_3" },
  { id: 3, target: 30, lives: 3, cells: 9, speedMs: 600, cellStyle: "cell3x3", route: "/level_3", nextRoute: "/level_4" },
  { id: 4, target: 20, lives: 3, cells: 16, speedMs: 800, cellStyle: "cell4x4", route: "/level_4", nextRoute: "/level_5" },
  { id: 5, target: 50, lives: 3, cells: 16, speedMs: 600, cellStyle: "cell4x4", route: "/level_5", nextRoute: "/level_6" },
  { id: 6, target: 60, lives: 2, cells: 16, speedMs: 500, cellStyle: "cell4x4", route: "/level_6", nextRoute: "/level_7" },
  { id: 7, target: 20, lives: 5, cells: 9, speedMs: 800, cellStyle: "cell3x3", route: "/level_7", nextRoute: "/level_8" },
  { id: 8, target: 20, lives: 5, cells: 9, speedMs: 800, cellStyle: "cell3x3", route: "/level_8", nextRoute: "/level_9" },
  { id: 9, target: 20, lives: 5, cells: 25, speedMs: 800, cellStyle: "cell5x5", route: "/level_9", nextRoute: "/level_10" },
  { id: 10, target: 100, lives: 10, cells: 25, speedMs: 300, cellStyle: "cell5x5", route: "/level_10", nextRoute: null },
];

export function getLevel(id) {
  const numericId = Number(id);
  return LEVELS.find((level) => level.id === numericId) || null;
}

// 3 stars: won with every life still intact
// 2 stars: won with more than half of the starting lives remaining
// 1 star: won (any margin)
// 0 stars: lost
export function starsFor(level, score, livesLeft) {
  if (!level) return 0;
  const won = score >= level.target;
  if (!won) return 0;
  if (livesLeft >= level.lives) return 3;
  if (livesLeft > level.lives / 2) return 2;
  return 1;
}

export default LEVELS;
