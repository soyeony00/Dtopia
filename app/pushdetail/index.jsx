import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { height, width } from "../../globalDimension"; // ✅ 상대경로 수정
import { Image, Pressable, StatusBar, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native"; //
import BackIcon from "../../assets/images/back.svg"; // ✅ 상대경로 수정

export default function PushDetail() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation(); // ✅

  return (
    <SafeAreaProvider>
      {/* 상태바 영역 */}
      <View style={{ height: insets.top, backgroundColor: "#fff" }}>
        <StatusBar barStyle="default" />
      </View>

      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        {/* 헤더 */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: width * 20,
            alignItems: "center",
            marginTop: height * 15,
            marginBottom: height * 15,
          }}
        >
          <Pressable
            style={{
              position: "absolute",
              left: width * 20,
              zIndex: 2,
            }}
            onPress={() => {
              navigation.goBack(); // ✅ router.navigate(x) ❌
            }}
          >
            <BackIcon />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: width * 16,
                fontWeight: "700",
              }}
            >
              알림
            </Text>
          </View>
        </View>

        {/* 선 긋기 */}
        <View
          style={{
            marginTop: height * 10,
            borderBottomWidth: width * 1,
            borderColor: "#EFEFEF",
            paddingHorizontal: width * 24,
          }}
        />

        {/* 본문 내용 */}
        <View style={{ paddingHorizontal: width * 30, marginTop: height * 30 }}>
          <View
            style={{
              backgroundColor: "#F6F6F6",
              paddingHorizontal: width * 30,
              borderRadius: width * 15,
            }}
          >
            <Text
              style={{
                marginTop: height * 15,
                marginBottom: height * 5,
                fontSize: width * 12,
                color: "#969696",
                fontWeight: "700",
              }}
            >
              1월 14일
            </Text>

            <Text
              style={{
                fontSize: width * 15,
                color: "#242424",
                fontWeight: "600",
              }}
            >
              반려동물의 건강상태를 확인할 시간이에요
            </Text>

            <Text
              style={{
                marginTop: height * 5,
                marginBottom: height * 15,
                fontSize: width * 15,
                color: "#242424",
                fontWeight: "600",
              }}
            >
              단독기기를 사용해 측정을 진행해 주세요!
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
