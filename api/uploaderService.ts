import { processServerResponse } from "@/utils/processServerResponse";

export interface AudioFile {
  uri: string;
  name: string;
  mimeType: string;
}

export const uploadFile = async (file: AudioFile) => {
  const formData = new FormData();
  const fileUri = file.uri.startsWith('file://') ? file.uri : 'file://' + file.uri;

  formData.append("file", {
    uri: fileUri,
    name: file.name,
    type: file.mimeType,
  } as any);

  const response = await fetch("http://10.0.2.2:5000/predict", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${errorText}`);
  }

  return processServerResponse(await response.json());
};
