import { uploadFile } from "@/api/uploaderService";
import { AudioTrimmer } from "@/controls/audioTrim/audioTrimmer";
import { ModalWindow } from "@/controls/modalWindow";
import { styles } from "@/styles/uploader.styles";
import { pickAudioFile } from "@/utils/pickAudio";
import { UiData } from "@/utils/processServerResponse";
import { trimAudio } from "@/utils/trimAudio";
import { useAppStore } from "@/utils/useAppStore";
import { Audio, AVPlaybackStatus } from "expo-av";
import { DocumentPickerAsset } from "expo-document-picker";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

const INITIAL_STATE = {
  isTooLong: false,
  trimRange: { start: 0, end: 0 },
  audioDuration: 0,
  file: null,
  modalVisible: false,
  responseData: null,
  isLoading: false,
  isPlaying: false,
  sound: null,
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
  const [responseData, setResponseData] = useState<UiData | null>(
    INITIAL_STATE.responseData
  );
  const [isLoading, setLoading] = useState(INITIAL_STATE.isLoading);
  const [isPlaying, setIsPlaying] = useState(INITIAL_STATE.isPlaying);
  const soundRef = useRef<Audio.Sound | null>(INITIAL_STATE.sound);

  const maxDuration = useAppStore((state) => state.maxDuration);

  const cleanupAudio = async (soundInstance: Audio.Sound | null) => {
    if (!soundInstance) return;

    try {
      const status = await soundInstance.getStatusAsync();

      if (status.isLoaded) {
        soundInstance.setOnPlaybackStatusUpdate(null);
        await soundInstance.stopAsync();
        await soundInstance.unloadAsync();
      }
    } catch (error) {
      console.error("Audio cleanup error:", error);
    }
  };

  const resetState = async () => {
    await cleanupAudio(soundRef.current);

    setIsTooLong(INITIAL_STATE.isTooLong);
    setTrimRange(INITIAL_STATE.trimRange);
    setAudioDuration(INITIAL_STATE.audioDuration);
    setFile(INITIAL_STATE.file);
    setModalVisible(INITIAL_STATE.modalVisible);
    setResponseData(INITIAL_STATE.responseData);
    setLoading(INITIAL_STATE.isLoading);
    setIsPlaying(INITIAL_STATE.isPlaying);
    soundRef.current = INITIAL_STATE.sound;
  };

  const getAudio = async (uri: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      const status = await sound.getStatusAsync();

      if (status.isLoaded) {
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        return sound;
      }

      return null;
    } catch (error) {
      console.error("Reading audio error", error);
      return null;
    }
  };

  const getAudioDuration = async (sound: Audio.Sound) => {
    try {
      const status = await sound.getStatusAsync();

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

    const sound = await getAudio(file.uri);

    if (!sound) {
      Alert.alert("Error", "Could not load audio file.");
      return;
    }

    const duration = await getAudioDuration(sound);
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
        name: file.name || "audio.wav",
        mimeType: file.mimeType || "audio/wav",
      });
      Alert.alert("Upload successful:");

      setResponseData(response);
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

    if (result.success && result.data) {
      try {
        const response = await uploadFile({
          uri: result.data.uri,
          name: result.data.name,
          mimeType: result.data.mimeType,
        });
        Alert.alert("Upload successful:");

        setResponseData(response);
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

  const handleCancelTrim = async () => {
    await resetState();
  };

  const handleClose = async () => {
    await resetState();
  };

  const handleStopPlay = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  const handlePlay = async () => {
    if (!soundRef.current) return;

    const status = await soundRef.current.getStatusAsync();

    if (status.isLoaded) {
      const currentPos = status.positionMillis;
      const endPos = trimRange.end * 1000;
      const startPos = trimRange.start * 1000;

      if (currentPos >= endPos || currentPos < startPos) {
        await soundRef.current.setPositionAsync(startPos);
      }

      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const handleResetPlay = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);

      await soundRef.current.setPositionAsync(trimRange.start * 1000);
    }
  };

  const trimRangeRef = useRef(trimRange);

  useEffect(() => {
    trimRangeRef.current = trimRange;
  }, [trimRange]);

  const onPlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if (!status.isLoaded || !soundRef.current) return;

    const endLimit = trimRangeRef.current.end * 1000;
    const startLimit = trimRangeRef.current.start * 1000;

    if (
      (status.isPlaying && status.positionMillis >= endLimit) ||
      status.positionMillis < startLimit
    ) {
      await soundRef.current.pauseAsync();
      await soundRef.current.setPositionAsync(
        trimRangeRef.current.start * 1000
      );
      setIsPlaying(false);
    }

    if (status.didJustFinish) {
      setIsPlaying(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        const sound = soundRef.current;
        if (!sound) return;

        sound
          .getStatusAsync()
          .then((status) => {
            if (status.isLoaded && status.isPlaying) {
              sound.pauseAsync();
              setIsPlaying(false);
            }
          })
          .catch(() => {});
      };
    }, [])
  );

  const isRangeValid = trimRange.end - trimRange.start <= maxDuration;

  return (
    <View style={styles.container}>
      {isTooLong && !isLoading && (
        <View style={styles.container}>
          <AudioTrimmer
            slider={{
              multiSlider: { values: [trimRange.start, trimRange.end] },
            }}
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
            style={[styles.button, styles.playStopButton]}
            onPress={isPlaying ? handleStopPlay : handlePlay}
          >
            <Text style={styles.buttonText}>{isPlaying ? "Stop" : "Play"}</Text>
          </Pressable>

          <Pressable
            onPress={handleResetPlay}
            style={[styles.button, styles.resetButton]}
          >
            <Text style={styles.buttonText}>Reset</Text>
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
        responseData={responseData}
      />
    </View>
  );
}
