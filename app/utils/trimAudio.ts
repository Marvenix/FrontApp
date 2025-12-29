import * as FileSystem from 'expo-file-system';
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import { Platform } from 'react-native';

interface TrimResult {
  uri: String | null;
  success: boolean;
  error?: String;
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
    const outputPath = `${cacheDir.uri}${outputName}`; //?
    let inputPath = sourceUri;

    if (Platform.OS === 'android' && inputPath.startsWith('file://')) {
      inputPath = inputPath.replace('file://', '');
      //outputPath = outputPath.replace('file://', '');
    }

    const command = `-y -ss ${startSeconds} -t ${durationSeconds} -i "${inputPath}" -c copy "${outputPath}"`;

    console.log(`[FFmpeg] Running command: ${command}`);

    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();

    if (ReturnCode.isSuccess(returnCode)) {
      console.log(`[FFmpeg] Success. Output at: ${outputPath}`);
      return { success: true, uri: outputPath };
    } else {
      const logs = await session.getAllLogs();
      const failLog = logs[logs.length - 1]?.getMessage(); //?
      console.error(`[FFmpeg] Failed: ${failLog}`);
      return { success: false, uri: null, error: failLog };
    }

  } catch (e: any) {
    console.error(`[FFmpeg] Exception: ${e.message}`);
    return { success: false, uri: null, error: e.message };
  }
};