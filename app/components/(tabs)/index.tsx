import { styles } from "@/styles/tabsIndex.styles";
import React from "react";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Welcome to the 
        {"\n"}
        recognizing music genres AI app.
      </Text>
    </View>
  );
}
