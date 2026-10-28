import { StyleSheet } from "react-native";

// Run-results card (components/RunSummary.js) shown inside the win/loss
// overlays. Those overlays sit on pauseStyle.js's light-blue
// pauseContainer background (rgba(173, 216, 230, 0.8)), unlike the dark-HUD
// convention in combo-styles.js/toast-styles.js -- so this card uses a
// light semi-opaque fill and dark text for readability instead of the
// HUD's dark-badge-with-light-text look.
const runSummaryStyles = StyleSheet.create({
  card: {
    width: "85%",
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 8,
    alignItems: "center",
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1c1c2e",
  },
  starsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff8a3d",
    marginTop: 2,
  },
  newBestText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2e7d32",
    marginTop: 2,
  },
  comboText: {
    fontSize: 12,
    color: "#1c1c2e",
    marginTop: 4,
    textAlign: "center",
  },
});

export default runSummaryStyles;
