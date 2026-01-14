import { styles } from "@/styles/modalWindow.styles";
import { UiData } from "@/utils/processServerResponse";
import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ModalWindowProps = {
  modalVisible: boolean;
  handleClose: () => void;
  responseData: UiData | null;
};

const ProgressBar = ({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) => (
  <View
    style={{
      height: 10,
      backgroundColor: "#e0e0e0",
      borderRadius: 5,
      flex: 1,
      marginHorizontal: 10,
    }}
  >
    <View
      style={{
        width: `${percentage}%`,
        backgroundColor: color,
        height: "100%",
        borderRadius: 5,
      }}
    />
  </View>
);

export const ModalWindow = ({
  modalVisible,
  handleClose,
  responseData,
}: ModalWindowProps) => {
  if (!responseData) return null;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Analysis result:</Text>
          <Text style={styles.headerTitle}>Winner:</Text>
          <Text style={styles.mainText}>{responseData.best_match.genre}</Text>
          <Text style={styles.headerTitle}>Confidence:</Text>
          <Text style={styles.mainText}>
            {responseData.best_match.confidence.toFixed(1)}%
          </Text>
          <View style={styles.separator} />
          <Text style={styles.subHeader}>Details:</Text>
          <ScrollView style={styles.listContainer}>
            {responseData.breakdown.map((item, index) => (
              <View key={item.genre} style={styles.row}>
                <Text style={styles.rowLabel}>{item.genre}</Text>
                <ProgressBar
                  percentage={item.confidence}
                  color={index === 0 ? "#4CAF50" : "#2196F3"}
                />
                <Text style={styles.rowValue}>
                  {item.confidence.toFixed(0)}%
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
