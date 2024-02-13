import { StyleSheet } from "react-native";

const indexStyles = StyleSheet.create({
  screenLayout: {
    flex: 1, // This makes the container take up the full screen
    justifyContent: "center", // This centers the child content vertically
    alignItems: "center", // This centers the child content horizontally
    backgroundColor: "lightblue", // Optional: Background color for the entire screen
  },
  titleContainer: {
    width: 250, // Specify width
    height: 140,
  },
  titleText: {
    color: "#000", // Text color for the button
    fontSize: 30, // Adjust text size as needed
    fontWeight: "bold",
    textAlign: "center",
  },
  subText: {
    color: "#000", // Text color for the button
    fontSize: 20, // Adjust text size as needed
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: "lightgreen",
    flex: 1,
  },
  levelsContainer: {
    width: 300, // Specify width
    height: 300, // Specify height
    flexDirection: "row", // Arrange items in a row
    flexWrap: "wrap", // Allow items to wrap to the next line
    justifyContent: "center", // Distribute items evenly along the line
    alignItems: "center", // Align items to the start of the cross axis
    textAlign: "center",
  },
  gridItem: {
    width: "25%", // Each item will take up roughly 45% of the container width
    height: "25%",
    aspectRatio: 1, // Optional, if you want each item to be square
    justifyContent: "center", // Center content vertically within the item
    alignItems: "center", // Center content horizontally within the item
    margin: 5, // Margin around each item to ensure they don't touch
    backgroundColor: "lightGreen", // Background color for each item, change as needed
  },
  buttonText: {
    color: "#000", // Text color for the button
    fontSize: 16, // Adjust text size as needed
    fontWeight: "bold",
    textAlign: "center",
  },
  pressableStyle: {
    textAlign: "center",
    width: "100%",
    height: "100%",
    textAlign: "center",
    justifyContent: "center",
  },
});
export default indexStyles;
