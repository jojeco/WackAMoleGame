import { StyleSheet } from "react-native";

// Styles for the Achievements screen (app/achievements.js). Mirrors the
// color/spacing/font conventions of styles/progress-styles.js (translucent
// white cards on the lightblue background, grey pill buttons, dark text)
// rather than introducing a new visual language.
const achievementsStyles = StyleSheet.create({
  countText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 14,
  },
  list: {
    width: "92%",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  cardUnlocked: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderColor: "#4a7a4a",
  },
  cardLocked: {
    backgroundColor: "rgba(154, 160, 166, 0.55)",
    borderColor: "#6c7075",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#000",
  },
  cardDescription: {
    fontSize: 13,
    color: "#222",
    marginTop: 2,
  },
  cardStatus: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#555",
    marginTop: 6,
  },
});

export default achievementsStyles;
