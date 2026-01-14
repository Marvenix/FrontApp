import { styles } from "@/styles/trimSlider.styles";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useState } from "react";
import { View, ViewStyle } from "react-native";

export type TrimSliderProps = {
  setTrimRange?: (range: { start: number; end: number }) => void;
  lineMarker?: {
    width?: number;
    height?: number;
    color?: string;
    borderRadius?: number;
    style?: ViewStyle;
  };
  multiSlider?: {
    values?: number[];
    min?: number;
    max?: number;
    step?: number;
    sliderLength?: number;
    backgroundColor?: string;
    minMarkerOverlapDistance?: number;
    maxMarkerOverlapDistance?: number;
    style?: ViewStyle;
  };
};

export function TrimSlider({
  setTrimRange,
  lineMarker = {},
  multiSlider = {},
}: TrimSliderProps) {
  const {
    width = 3,
    height = 60,
    color = "#000000ff",
    borderRadius = 1,
  } = lineMarker;

  const {
    values = [0, 1],
    min = 0,
    max = 100,
    step = 1,
    sliderLength = 298,
    backgroundColor = "rgba(255, 0, 0, 0.3)",
    minMarkerOverlapDistance = 0,
  } = multiSlider;

  const safeLineMarkerWidth = Math.max(0, width);
  const safeLineMarkerHeight = Math.max(0, height);
  const safeLineMarkerBorderRadius = Math.max(0, borderRadius);

  const lineMarkerComponent = () => (
    <View
      style={[
        { width: safeLineMarkerWidth },
        { height: safeLineMarkerHeight },
        { backgroundColor: color },
        { borderRadius: safeLineMarkerBorderRadius },
        lineMarker.style,
        { marginTop: 60 },
      ]}
    />
  );

  const safeMin = Math.max(0, Math.min(min, max));
  const safeMax = Math.max(0, Math.max(min, max));
  const safeStep = Math.max(1, step);
  const safeSliderLength = Math.max(0, sliderLength);

  let safeValues = values;

  if (
    safeValues.length !== 2 ||
    (safeValues.length === 2 && safeValues[0] > safeValues[1])
  )
    safeValues = [safeMin, safeMax];

  safeValues = safeValues.map((v) => Math.min(Math.max(safeMin, v), safeMax));

  const safeMinOverlapMarker = Math.max(0, minMarkerOverlapDistance);
  const totalRange = safeMax - safeMin;
  const minOverlapPixels =
    (safeMinOverlapMarker / totalRange) * safeSliderLength;

  const [ranges, setRanges] = useState(safeValues);

  const [minOverlap, setOverlap] = useState(minOverlapPixels);

  let counter = 0;

  const handleValuesChangeStart = () => {
    counter += 1;
    if (counter === 1) return;

    const currentWidth = ranges[1] - ranges[0];

    const pixelWidth = (currentWidth / totalRange) * safeSliderLength;
    setOverlap(pixelWidth);
  };

  const handleValuesChange = (newValues: number[]) => {
    setTrimRange?.({ start: newValues[0], end: newValues[1] });
  };

  const handleValuesChangeFinish = (newValues: number[]) => {
    setRanges(newValues);
    setOverlap(minOverlapPixels);
    setTrimRange?.({ start: newValues[0], end: newValues[1] });
    counter = 0;
  };

  return (
    <MultiSlider
      values={ranges}
      min={safeMin}
      max={safeMax}
      step={safeStep}
      sliderLength={safeSliderLength}
      customMarker={lineMarkerComponent}
      containerStyle={multiSlider.style}
      trackStyle={styles.track}
      selectedStyle={{
        backgroundColor: backgroundColor,
        height: safeLineMarkerHeight,
      }}
      onValuesChangeStart={handleValuesChangeStart}
      onValuesChange={handleValuesChange}
      onValuesChangeFinish={handleValuesChangeFinish}
      minMarkerOverlapDistance={minOverlap}
    />
  );
}
