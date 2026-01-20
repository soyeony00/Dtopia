import { router, Stack } from "expo-router";
import { Platform } from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        statusBarBackgroundColor: "#A8DF8E",
        navigationBarColor: "white",
        contentStyle: {
          ...(Platform.OS === "android" && {
            backgroundColor: "white",
          }),
        },
        headerShown: false,
      }}
    >
      {/* ✅ 로그인 화면이 가장 먼저 렌더링되도록 설정 */}
      <Stack.Screen name="login" options={{ headerShown: false }} />

      {/* ✅ 탭 구조로 넘어갈 메인화면 */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      {/* ✅ 기타 디테일 페이지들 */}
      <Stack.Screen name="hopitalDetail" options={{ headerShown: false }} />
      <Stack.Screen name="medicineDetail" options={{ headerShown: false }} />
      <Stack.Screen name="searchDetail" options={{ headerShown: false }} />
      <Stack.Screen name="alarmDetail" options={{ headerShown: false }} />
      <Stack.Screen name="question" options={{ headerShown: false }} />
      <Stack.Screen name="pushDetail" options={{ headerShown: false }} />
      <Stack.Screen name="changePassword" options={{ headerShown: false }} />
      <Stack.Screen name="petDetail" options={{ headerShown: false }} />
      <Stack.Screen name="profileDetail" options={{ headerShown: false }} />
      <Stack.Screen name="changePasswor" options={{ headerShown: false }} />
      <Stack.Screen name="hospitalSearch" options={{ headerShown: false }} />

      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
