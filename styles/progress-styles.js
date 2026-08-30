import { StyleSheet } from "react-native";

// Styles shared by the rebuilt home screen (app/index.js) and the new
// Progress/Stats screen (app/progress.js). Kept separate from
// styles/index-styles.js (still used for the base screen layout/title) so
// that file didn't need to be touched.
const progressStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: "lightblue",
  },
  headerStrip: {
    width: "88%",
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
    marginTop: 4,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 12,
  },
  totalStat: {
    alignItems: "center",
  },
  totalStatValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  totalStatLabel: {
    fontSize: 12,
    color: "#333",
  },
  progressLinkButton: {
    marginTop: 14,
    backgroundColor: "grey",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  progressLinkText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  levelGrid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  levelTile: {
    width: "27%",
    aspectRatio: 1,
    margin: "1.5%",
    borderRadius: 14,
    backgroundColor: "lightgreen",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4a7a4a",
    padding: 6,
  },
  levelTileLocked: {
    backgroundColor: "#9aa0a6",
    borderColor: "#6c7075",
  },
  levelNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  levelBest: {
    fontSize: 13,
    color: "#111",
    marginTop: 2,
  },
  levelStars: {
    fontSize: 14,
    letterSpacing: 1,
    color: "#b8860b",
    marginTop: 2,
  },
  levelLockedText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginTop: 4,
  },
  homeLink: {
    marginTop: 20,
    backgroundColor: "grey",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  homeLinkText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  table: {
    width: "92%",
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  tableCellLevel: {
    flex: 1.2,
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  actionButton: {
    width: "80%",
    backgroundColor: "grey",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  actionButtonDanger: {
    backgroundColor: "#a33",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default progressStyles;
