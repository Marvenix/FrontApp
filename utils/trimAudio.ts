import * as FileSystem from "expo-file-system";
import { NativeModules, Platform } from "react-native";
const { FFmpegKitReactNativeModule } = NativeModules;

interface TrimResult {
  uri: string | null;
  success: boolean;
  error?: string;
}

export const trimAudio = async (
  sourceUri: string,
  startSeconds: number,
  durationSeconds: number
): Promise<TrimResult> => {
  try {
    const timestamp = Date.now();
    const outputName = `trimmed_${timestamp}.m4a`;
    const cacheDir = FileSystem.Paths.cache;
    let outputPath = `${cacheDir.uri}${outputName}`;
    let inputPath = sourceUri;

    if (Platform.OS === "android" && inputPath.startsWith("file://")) {
      inputPath = inputPath.replace("file://", "");
      outputPath = outputPath.replace("file://", "");
    }

    const commandArguments = [
      "-y",
      "-ss",
      String(startSeconds),
      "-t",
      String(durationSeconds),
      "-i",
      inputPath,
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      outputPath,
    ];

    const session = await FFmpegKitReactNativeModule.ffmpegSession(
      commandArguments
    );

    const sessionId = session.sessionId;

    await FFmpegKitReactNativeModule.ffmpegSessionExecute(sessionId);

    const returnCode =
      await FFmpegKitReactNativeModule.abstractSessionGetReturnCode(sessionId);

    if (returnCode === 0) {
      console.log(`[FFmpeg] Success. Output at: ${outputPath}`);
      return { success: true, uri: outputPath };
    } else {
      const logs =
        await FFmpegKitReactNativeModule.abstractSessionGetAllLogsAsString(
          sessionId,
          null
        );
      console.error(`[FFmpeg] Failed: ${logs}`);
      return { success: false, uri: null, error: logs };
    }
  } catch (e: any) {
    console.error(`[FFmpeg] Exception: ${e.message}`);
    return { success: false, uri: null, error: e.message };
  }
};
