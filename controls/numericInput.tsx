import { styles } from "@/styles/numericInput.styles";
import React from "react";
import { TextInput, TextInputProps } from "react-native";

interface NumericInputProps
  extends Omit<TextInputProps, "onChangeText" | "value"> {
  value: number;
  onChangeNumber: (num: number) => void;
}

export const NumericInput = ({
  value,
  onChangeNumber,
  style,
  ...props
}: NumericInputProps) => {
  const handleChange = (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, "");

    if (cleanText === "") {
      onChangeNumber(0);
      return;
    }

    onChangeNumber(parseInt(cleanText, 10));
  };

  return (
    <TextInput
      {...props}
      style={[styles.input, style]}
      value={value === 0 ? "" : String(value)}
      onChangeText={handleChange}
      keyboardType="number-pad"
      placeholder="0"
    />
  );
};
