import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { height, width } from "../../globalDimension"; // 수정 ✅
import { useNavigation } from "@react-navigation/native"; // 수정 ✅
import BackIcon from "../../assets/images/back.svg"; // 수정 ✅

export default function QuestionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation(); // 수정 ✅

  return (
    <SafeAreaProvider>
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        {/* 상태바 영역 보정 */}
        <View style={{ height: insets.top }}>
          <StatusBar barStyle="default" />
        </View>

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
              zIndex: 2,
            }}
            onPress={() => {
              navigation.goBack(); // 수정 ✅
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
                flex: 1,
              }}
            >
              검색창
            </Text>
          </View>
        </View>

        {/* 검색바 */}
        <View style={styles.searchBarView}>
          <View
            style={{
              position: "absolute",
              bottom: height * 34,
              left: width * 46,
              zIndex: 2,
            }}
          >
            <Image
              width={width * 16}
              height={width * 16}
              source={require("../../assets/images/search_w.png")} // 수정 ✅
            />
          </View>

          <TextInput
            style={styles.searchBarInput}
            placeholder="병원명 또는 지역명을 입력해 주세요"
            multiline
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  searchBarView: {
    paddingHorizontal: width * 32,
    paddingVertical: height * 22,
    marginBottom: height * 8,
    flexDirection: "row",
    position: "relative",
  },
  searchBarInput: {
    borderWidth: 0,
    backgroundColor: "#F6F6F6",
    borderRadius: width * 15,
    paddingVertical: height * 9,
    paddingHorizontal: width * 35,
    flex: 1,
  },
});
