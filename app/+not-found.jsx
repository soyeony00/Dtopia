import Center from "@/components/ui/Center";
import { Stack } from "expo-router";
import { Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Center>
        <Text>Page not found</Text>
      </Center>
    </>
  );
}
