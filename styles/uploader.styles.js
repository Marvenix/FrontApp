import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  title: {
    color: "#000000ff",
    fontSize: 20,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    width: 200,
    marginTop: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F44336",
    width: 200,
    marginTop: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
    opacity: 0.5,
  },
});
