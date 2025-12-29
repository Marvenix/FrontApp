import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    zIndex: 1,
  },
});
