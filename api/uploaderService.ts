import { processServerResponse } from "@/utils/processServerResponse";
import * as FileSystem from 'expo-file-system/legacy';

export interface AudioFile {
  uri: string;
  name: string;
  mimeType: string;
}

export const uploadFile = async (file: AudioFile) => {
  const fileUri = file.uri.startsWith('file://') ? file.uri : 'file://' + file.uri;

  const response = await FileSystem.uploadAsync("http://10.0.2.2:5000/predict", fileUri, {
    fieldName: 'file',
    httpMethod: 'POST',
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
  });

  if (response.status !== 200) {
    let errorMessage = response.body;

    try {
      const errorJson = JSON.parse(response.body);
      errorMessage = errorJson.message || errorJson.error || JSON.stringify(errorJson);
    } catch (e) { }

    throw new Error(`Upload failed (Status ${response.status}): ${errorMessage}`);
  }

  return processServerResponse(JSON.parse(response.body));
};
