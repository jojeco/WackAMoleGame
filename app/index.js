import { React } from "react";
import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import indexStyles from "../styles/index-styles";

export default function Page() {
  const links = [
    { name: "Level 1", pathname: "/level_1" },
    { name: "Level 2", pathname: "/level_2" },
    { name: "Level 3", pathname: "/level_3" },
    // Add more links as needed to make up to 10 links for a 2x5 grid
  ];

  // Ensure you have 10 links for a 2x5 grid, repeating or adding as necessary
  while (links.length < 10) {
    links.push({
      name: `Level ${links.length + 1}`,
      pathname: `/level_${links.length + 1}`,
    });
  }

  return (
    <View style={indexStyles.screenLayout}>
      <View style={indexStyles.titleContainer}>
        <Text style={indexStyles.titleText}>Welcome to Whack A Molé!</Text>
      </View>
      <View>
        <Text style={indexStyles.subText}>Chose a level to begin</Text>
      </View>

      <View style={indexStyles.levelsContainer}>
        {links.map((link, index) => (
          <View key={index} style={indexStyles.gridItem}>
            <Link style={indexStyles.button} href={link.pathname} asChild>
              <Pressable style={indexStyles.pressableStyle}>
                <Text style={indexStyles.buttonText}>{link.name}</Text>
              </Pressable>
            </Link>
          </View>
        ))}
      </View>
      <View></View>
    </View>
  );
}
