import { StyleSheet } from "react-native";

// HUD combo meter. Sits at the left edge under the pause button (top ~5-55)
// and clear of the centered lives text (top 100), the top-right level label
// and best score, and the bottom score counter.
const comboStyles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 70,
    left: 12,
    alignItems: "center",
  },
  badge: {
    minWidth: 76,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "rgba(20, 20, 30, 0.85)",
    alignItems: "center",
  },
  streakText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffd54a",
  },
  multiplierText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff8a3d",
  },
  tierText: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#e8e8f0",
  },
});

export default comboStyles;
