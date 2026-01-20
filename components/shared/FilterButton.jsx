import clsx from "clsx";
import { ReactNode } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export const FilterButton = ({
  className,
  titleClassName,
  title,
  onClick,
  isSelected = false,
  icon,
}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={styles.filterButton}
      className={clsx("bg-[#EFEFEF] rounded-primary", className, {
        "bg-primary": isSelected,
      })}
    >
      {icon && icon}
      <Text className={clsx("text-xxs", titleClassName)}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    display: "flex",
    flexDirection: "row",
    gap: 3,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
});
