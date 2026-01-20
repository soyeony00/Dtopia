import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

export const Row = ({ children, gap, style }) => {
  return (
    <View
      style={{
        ...styles.row,
        gap: gap,
        ...style,
      }}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
