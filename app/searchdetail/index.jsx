import { height, screenWidth, width } from "../../globalDimension"; // ✅ 상대경로 수정
import { useRoute, useNavigation } from "@react-navigation/native"; // ✅ navigation 사용
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import BackIcon from "../../assets/images/back.svg"; // ✅ 상대경로 수정

export default function SearchDetailScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation(); // ✅ 추가

  return (
    <SafeAreaProvider>
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
          }}
        >
          <Pressable
            style={{
              position: "absolute",
              left: width * 20,
              zIndex: 2,
            }}
            onPress={() => {
              navigation.goBack(); // ✅
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
              상세정보
            </Text>
          </View>
        </View>

        {/* 이미지 */}
        <View
          style={{
            alignItems: "center",
            marginTop: height * 45,
          }}
        >
          <Image
            style={{ width: width * 160, height: width * 160 }}
            source={
              route.params.index === "0"
                ? require("../../assets/images/item.png")
                : route.params.index === "1"
                  ? require("../../assets/images/item1.png")
                  : route.params.index === "2"
                    ? require("../../assets/images/item2.png")
                    : route.params.index === "3"
                      ? require("../../assets/images/item3.png")
                      : require("../../assets/images/item4.png")
            }
          />

          <View
            style={{
              paddingVertical: height * 20,
              borderBottomWidth: 1,
              borderColor: "#969696",
              width: screenWidth - width * 72,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: width * 17, fontWeight: "700" }}>
              {route.params.data}
            </Text>
          </View>
        </View>

        {/* 본문 */}
        <View>
          <View style={{ paddingHorizontal: width * 38 }}>
            {/* 제조사 */}
            <View style={{ marginTop: height * 17 }}>
              <View style={[{ width: width * 64 }, styles.boader]}>
                <Text>제조사</Text>
              </View>
              <Text style={{ marginLeft: width * 14, marginTop: height * 9 }}>
                {route.params.company}
              </Text>
            </View>

            {/* 효능 */}
            <View style={{ marginTop: height * 17 }}>
              <View style={[{ width: width * 64 }, styles.boader]}>
                <Text>효능</Text>
              </View>
              <Text style={{ marginLeft: width * 14, marginTop: height * 9 }}>
                {route.params.subTitle}
              </Text>
            </View>

            {/* 주의사항 */}
            <View style={{ marginTop: height * 17 }}>
              <View style={[{ width: width * 80 }, styles.boader]}>
                <Text>주의사항</Text>
              </View>
              <Text style={{ marginLeft: width * 14, marginTop: height * 9 }}>
                {route.params.description}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boader: {
    borderColor: "#A8DF8E",
    borderWidth: 1,
    paddingHorizontal: width * 10,
    paddingVertical: height * 7,
    borderRadius: width * 15,
    alignItems: "center",
  },
});
