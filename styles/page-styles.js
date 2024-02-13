import { StyleSheet, ImageBackground } from "react-native";

const styles = StyleSheet.create({
  button: {
    backgroundColor: "lightgreen",
    borderRadius: 30,
    padding: 20,
    marginLeft: 15,
    marginRight: 15,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  grid: {
    position: "absolute",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  highScore: {
    position: "absolute",
    top: 70,
    right: 20,
  },
  cell3x3: {
    width: 125,
    height: 125,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "grey",
    backgroundColor: "lightblue",
    margin: 2,
    borderRadius: 100,
    padding: 10,
  },
  cell4x4: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.75,
    borderColor: "#000",
    backgroundColor: "lightblue",
    margin: 2,
    borderRadius: 100,
  },
  cell5x5: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.75,
    borderColor: "#000",
    backgroundColor: "lightblue",
    margin: 1,
    borderRadius: 100,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center", // Align items vertically
    alignItems: "center", // Align items horizontally
  },
  textTop: {
    position: "absolute",
    top: 100,
    fontSize: 30,
  },
  topRightText: {
    position: "absolute",
    top: 30,
    right: 20,
    fontSize: 25,
  },
  textStyle: {
    fontSize: 20,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  livesContainer: {
    position: "absolute",
    top: 100,
    fontSize: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreContainer: {
    position: "abosolute",
    fontSize: 40,
    bottom: 220,
  },
  scoreStyle: {
    padding: 20,
    fontSize: 40,
  },
  buttonContainer: {
    backgroundColor: "red",
    position: "absolute",
    bottom: 75,
    width: 300,
    overflow: "hidden", // Keeps the button within the container
    borderRadius: 5, // Optional: if you want rounded corners
  },
  pauseButton: {
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    backgroundColor: "lightblue", // Optional: if you want to change the color
    borderRadius: 100,
  },

  buttonStyles: {
    width: 180,
    height: 50,
    backgroundColor: "lightblue",
    marginTop: 350,
    borderColor: "grey",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default styles;
