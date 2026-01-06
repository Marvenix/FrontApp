import { styles } from "@/styles/audioTrimmer.styles";
import { useEffect } from "react";
import { View } from "react-native";
import { SymbolicWaveform, SymbolicWaveformProps } from "./symbolicWaveForm";
import { TrimSlider, TrimSliderProps } from "./trimSlider";

type AudioTrimmerProps = {
  audioDuration: number;
  maxDuration?: number;
  setIsValid?: (valid: boolean) => void;
  setTrimRange?: (range: { start: number; end: number }) => void;
  waveForm?: SymbolicWaveformProps;
  slider?: Omit<TrimSliderProps, "maxDuration" | "setIsValid" | "setTrimRange">;
};

export function AudioTrimmer({
  audioDuration,
  maxDuration,
  setIsValid,
  setTrimRange,
  waveForm,
  slider,
}: AudioTrimmerProps) {
  const initialRange = [0, maxDuration || audioDuration];

  useEffect(() => {
    setTrimRange?.({ start: 0, end: maxDuration || audioDuration });
    setIsValid?.(true);
  }, []);

  return (
    <View style={styles.container}>
      <SymbolicWaveform {...waveForm} />
      <View style={styles.overlay}>
        <TrimSlider
          {...slider}
          maxDuration={maxDuration}
          setTrimRange={setTrimRange}
          setIsValid={setIsValid}
          multiSlider={{ values: initialRange, min: 0, max: audioDuration }}
        />
      </View>
    </View>
  );
}
