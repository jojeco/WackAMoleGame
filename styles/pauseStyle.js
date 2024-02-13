import { StyleSheet } from "react-native";

const pauseSS = StyleSheet.create({
  pauseScreen: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pauseText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  pausedGameText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 20,
    
  },
  pauseContainer: {
    height: "40%",
    width: "70%",
    backgroundColor: "rgba(173, 216, 230, 0.8)",
    alignContent: "center",
    justifyContent: "center",
  },
  pauseButtons: {
    backgroundColor: "grey",
    borderRadius: 40,
    padding: 10,
    margin: 10,
    textAlign: "center",
    justifyContent: "center",
  },
  pauseButton: {
    position: "absolute",
    top: 20,
    left: 20,
    wdith: 40,
    height: 40,
  },
});

export default pauseSS;
