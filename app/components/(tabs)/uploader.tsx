import { uploadFile } from "@/app/api/uploaderService";
import { pickAudioFile } from "@/app/utils/pickAudio";
import React from "react";
import { Alert, Button, View } from "react-native";

export default function Uploader() {
  const handleUpload = async () => {
    const file = await pickAudioFile();
    if (!file) return;

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

  return (
    <View>
      <Button title="Upload Audio File" onPress={handleUpload} />
    </View>
  );
}
