import { uploadFile } from "@/api/uploaderService";
import { AudioTrimmer } from "@/controls/audioTrim/audioTrimmer";
import { ModalWindow } from "@/controls/modalWindow";
import { styles } from "@/styles/uploader.styles";
import { pickAudioFile } from "@/utils/pickAudio";
import { trimAudio } from "@/utils/trimAudio";
import { useAppStore } from "@/utils/useAppStore";
import { Audio } from "expo-av";
import { DocumentPickerAsset } from "expo-document-picker";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

const INITIAL_STATE = {
  isTooLong: false,
  trimRange: { start: 0, end: 0 },
  audioDuration: 0,
  file: null,
  modalVisible: false,
  responseData: null,
  isLoading: false,
};

export default function Uploader() {
  const [isTooLong, setIsTooLong] = useState(INITIAL_STATE.isTooLong);
  const [trimRange, setTrimRange] = useState(INITIAL_STATE.trimRange);
  const [audioDuration, setAudioDuration] = useState(
    INITIAL_STATE.audioDuration
  );
  const [file, setFile] = useState<DocumentPickerAsset | null>(
    INITIAL_STATE.file
  );
  const [modalVisible, setModalVisible] = useState(INITIAL_STATE.modalVisible);
  const [responseData, setResponseData] = useState<string | null>(
    INITIAL_STATE.responseData
  );
  const [isLoading, setLoading] = useState(INITIAL_STATE.isLoading);

  const maxDuration = useAppStore((state) => state.maxDuration);

  const resetState = () => {
    setIsTooLong(INITIAL_STATE.isTooLong);
    setTrimRange(INITIAL_STATE.trimRange);
    setAudioDuration(INITIAL_STATE.audioDuration);
    setFile(INITIAL_STATE.file);
    setModalVisible(INITIAL_STATE.modalVisible);
    setResponseData(INITIAL_STATE.responseData);
    setLoading(INITIAL_STATE.isLoading);
  };

  const getAudioDuration = async (uri: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      const status = await sound.getStatusAsync();
      await sound.unloadAsync();

      if (status.isLoaded && status.durationMillis) {
        return status.durationMillis / 1000;
      }
      return 0;
    } catch (error) {
      console.error("Downloading audio error", error);
      return 0;
    }
  };

  const handleUpload = async () => {
    setIsTooLong(false);

    setFile(await pickAudioFile());

    if (!file) return;

    const duration = await getAudioDuration(file.uri);
    setAudioDuration(duration);

    if (duration > maxDuration) {
      setIsTooLong(true);
      setTrimRange({ start: 0, end: maxDuration });
      return;
    }

    setLoading(true);
    try {
      const response = await uploadFile({
        uri: file.uri,
        name: file.name || "audio.m4a",
        mimeType: file.mimeType || "audio/mpeg",
      });
      Alert.alert("Upload successful:");

      setResponseData(JSON.stringify(response, null, 2));
      setModalVisible(true);
    } catch (error: any) {
      Alert.alert("Upload failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadTrimmed = async () => {
    if (!file) return;

    const duration = trimRange.end - trimRange.start;

    setLoading(true);
    const result = await trimAudio(file.uri, trimRange.start, duration);

    if (result.success && result.uri) {
      try {
        const response = await uploadFile({
          uri: result.uri,
          name: `cut_${file.name}`,
          mimeType: file.mimeType || "audio/mp4",
        });
        Alert.alert("Upload successful:");

        setResponseData(JSON.stringify(response, null, 2));
        setModalVisible(true);
      } catch (error: any) {
        Alert.alert("Upload failed", error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      Alert.alert("Error", "Trimming failed: " + result.error);
    }
  };

  const handleCancelTrim = () => {
    setIsTooLong(false);
  };

  const handleClose = () => {
    resetState();
  };

  const isRangeValid = (trimRange.end - trimRange.start) <= maxDuration;

  return (
    <View style={styles.container}>
      {isTooLong && !isLoading && (
        <View style={styles.container}>
          <AudioTrimmer
            slider={{multiSlider: { values: [trimRange.start, trimRange.end] }}}
            audioDuration={audioDuration}
            setTrimRange={setTrimRange}
          />
          <Pressable
            style={[
              styles.button,
              styles.uploadButton,
              !isRangeValid && styles.disabledButton,
            ]}
            onPress={handleUploadTrimmed}
            disabled={!isRangeValid}
          >
            <Text style={styles.buttonText}>Upload Trimmed File</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancelTrim}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {!isTooLong && !isLoading && (
        <View style={styles.container}>
          <Text style={styles.title}>Click below to upload audio file:</Text>
          <Pressable style={styles.button} onPress={handleUpload}>
            <Text style={styles.buttonText}>Upload File</Text>
          </Pressable>
        </View>
      )}

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

      <ModalWindow
        modalVisible={modalVisible}
        handleClose={handleClose}
        responseData={responseData ?? ""}
      />
    </View>
  );
}
