import { NumericInput } from "@/controls/numericInput";
import { styles } from "@/styles/settings.styles";
import { useAppStore } from "@/utils/useAppStore";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Settings() {
  const storeMaxDuration = useAppStore((state) => state.maxDuration);
  const setMaxDuration = useAppStore((state) => state.setMaxDuration);

  const [localMaxDuration, setLocalMaxDuration] = useState(storeMaxDuration);

  useFocusEffect(
    useCallback(() => {
      setLocalMaxDuration(storeMaxDuration);
    }, [storeMaxDuration])
  );

  const handleMaxDurationChange = () => {
    setMaxDuration(localMaxDuration);
    alert("Changes saved!");
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View>
        <Text style={styles.titleText}>Max duration time (seconds):</Text>

        <NumericInput
          value={localMaxDuration}
          onChangeNumber={setLocalMaxDuration}
        />
      </View>

      <View style={{ flex: 1 }} />

      <Pressable style={[styles.button, styles.saveButton]} onPress={handleMaxDurationChange}>
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
    </View>
  );
}
