import { styles } from "@/styles/symbolicWaveform.styles";
import { useMemo } from "react";
import { View, ViewStyle } from "react-native";

export type SymbolicWaveformProps = {
  length?: number;
  height?: number;
  style?: ViewStyle;
  bar?: {
    width?: number;
    gap?: number;
    color?: string;
    radius?: number;
    minHeight?: number;
  };
};

export function SymbolicWaveform({
  length = 60,
  height = 60,
  style,
  bar = {},
}: SymbolicWaveformProps) {
  const {
    width = 3,
    gap = 2,
    color = "#6366f1",
    radius = 2,
    minHeight = 10,
  } = bar;

  const safeLength = Math.max(0, length);
  const safeHeight = Math.max(0, height);
  const safeBarWidth = Math.max(0, width);
  const safeBarGap = Math.max(0, gap);
  const safeBarRadius = Math.max(0, radius);
  const safeBarMinHeight = Math.max(0, minHeight);

  const bars = useMemo(
    () =>
      Array.from(
        { length: safeLength },
        () => Math.random() * (safeHeight - safeBarMinHeight) + safeBarMinHeight
      ),
    [safeLength, safeHeight, safeBarMinHeight]
  );

  return (
    <View style={[styles.container, { height: safeHeight }, style]}>
      {bars.map((barHeight, i) => (
        <View
          key={i}
          style={{
            width: safeBarWidth,
            height: barHeight,
            backgroundColor: color,
            marginRight: safeBarGap,
            borderRadius: safeBarRadius,
          }}
        />
      ))}
    </View>
  );
}
