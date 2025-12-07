export interface AudioFile {
  uri: string;
  name: string;
  mimeType: string;
}

export const uploadFile = async (file: AudioFile) => {
  const formData = new FormData();

  formData.append("file", {
    uri: file.uri,
    name: file.name,
    type: file.mimeType,
  } as any);

  const response = await fetch("tutaj podpiac backend", {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${errorText}`);
  }

  return response.json();
};
