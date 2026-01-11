import { styles } from "@/styles/audioTrimmer.styles";
import { View } from "react-native";
import { SymbolicWaveform, SymbolicWaveformProps } from "./symbolicWaveForm";
import { TrimSlider, TrimSliderProps } from "./trimSlider";

type AudioTrimmerProps = {
  audioDuration: number;
  setTrimRange?: (range: { start: number; end: number }) => void;
  waveForm?: SymbolicWaveformProps;
  slider?: Omit<TrimSliderProps, "setTrimRange">;
};

export function AudioTrimmer({
  audioDuration,
  setTrimRange,
  waveForm,
  slider,
}: AudioTrimmerProps) {
  return (
    <View style={styles.container}>
      <SymbolicWaveform {...waveForm} />
      <View style={styles.overlay}>
        <TrimSlider
          {...slider}
          setTrimRange={setTrimRange}
          multiSlider={{ min: 0, max: audioDuration }}
        />
      </View>
    </View>
  );
}
