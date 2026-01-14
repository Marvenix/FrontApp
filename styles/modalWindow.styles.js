import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 50,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
  },
  responseText: {
    fontSize: 16,
    fontFamily: "monospace",
    color: "#333",
  },
  mainText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginVertical: 5,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  listContainer: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rowLabel: {
    width: 70,
    fontSize: 14,
    fontWeight: "500",
  },
  rowValue: {
    width: 40,
    fontSize: 12,
    textAlign: "right",
    color: "#666",
  },
});
