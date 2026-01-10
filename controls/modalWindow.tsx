import { styles } from "@/styles/modalWindow.styles";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ModalWindowProps = {
  modalVisible: boolean;
  handleClose: () => void;
  responseData: string;
};

export const ModalWindow = ({ modalVisible, handleClose, responseData }: ModalWindowProps) => {
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
          <ScrollView style={styles.scrollView}>
            <Text style={styles.responseText}>{responseData}</Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
