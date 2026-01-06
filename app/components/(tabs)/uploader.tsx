import { uploadFile } from "@/api/uploaderService";
import { AudioTrimmer } from "@/controls/audioTrim/audioTrimmer";
import { styles } from "@/styles/uploader.styles";
import { pickAudioFile } from "@/utils/pickAudio";
import { trimAudio } from "@/utils/trimAudio";
import { useAppStore } from "@/utils/useAppStore";
import { Audio } from "expo-av";
import { DocumentPickerAsset } from "expo-document-picker";
import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

export default function Uploader() {
  const [isTooLong, setIsTooLong] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [trimRange, setTrimRange] = useState({ start: 0, end: 0 });
  const maxDuration = useAppStore((state) => state.maxDuration);
  const [audioDuration, setAudioDuration] = useState(0);
  const [file, setFile] = useState<DocumentPickerAsset | null>(null);

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
      console.error("Błąd pobierania długości audio", error);
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
      return;
    }

    try {
      const response = await uploadFile({
        uri: file.uri,
        name: file.name || "audio.m4a",
        mimeType: file.mimeType || "audio/mpeg",
      });

      Alert.alert("Upload successful:", response);
    } catch (error: any) {
      Alert.alert("Upload failed", error.message);
    }
  };

  const handleUploadTrimmed = async () => {
    if (!file) return;

    const duration = trimRange.end - trimRange.start;
    console.log('start (seconds): ', trimRange.start)
    console.log('end (seconds): ', trimRange.end)
    console.log(duration)

    const result = await trimAudio(file.uri, trimRange.start, duration);

    // if (result.success && result.uri) {
    //   await uploadFile({
    //     uri: result.uri,
    //     name: `cut_${file.name}`,
    //     mimeType: file.mimeType || "audio/mp4",
    //   });
    // } else {
    //   Alert.alert("Error", "Trimming failed: " + result.error);
    // }
  };

  const handleCancelTrim = () => {
    setIsTooLong(false);
  };

  return (
    <View style={styles.container}>
      {isTooLong && (
        <View style={styles.container}>
          <AudioTrimmer
            maxDuration={maxDuration}
            audioDuration={audioDuration}
            setIsValid={setIsValid}
            setTrimRange={setTrimRange}
          />
          <Pressable
            style={[
              styles.button,
              styles.uploadButton,
              !isValid && styles.disabledButton,
            ]}
            onPress={handleUploadTrimmed}
            disabled={!isValid}
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

      {!isTooLong && (
        <View style={styles.container}>
          <Text style={styles.title}>Click below to upload audio file:</Text>
          <Pressable style={styles.button} onPress={handleUpload}>
            <Text style={styles.buttonText}>Upload File</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
