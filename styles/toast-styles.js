import { StyleSheet } from "react-native";

// In-level achievement-unlock toast (components/AchievementToast.js). Dark
// semi-opaque banner, matching the dark-HUD convention already used by
// combo-styles.js's badge (not achievements-styles.js's light translucent
// cards, which are styled for the Achievements screen's light background)
// -- no light border on a dark background, per the app's dark-theme
// convention.
const toastStyles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
    elevation: 999,
  },
  banner: {
    width: "80%",
    maxWidth: 320,
    backgroundColor: "rgba(20, 20, 30, 0.92)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#ffd54a",
    textAlign: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    color: "#e8e8f0",
    textAlign: "center",
    marginTop: 2,
  },
});

export default toastStyles;
