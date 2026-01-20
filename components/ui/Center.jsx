import { ReactNode } from "react";
import { View } from "react-native";

const Center = ({ children }) => {
  return (
    <View className="w-full h-full flex justify-center items-center">
      {children}
    </View>
  );
};

export default Center;
