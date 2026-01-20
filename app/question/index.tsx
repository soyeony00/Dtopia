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
import { height, width } from "../../globalDimension";
import { useNavigation } from "@react-navigation/native";
import BackIcon from "../../assets/images/back.svg";

export default function QuestionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        {/* 상태바 */}
        <View style={{ height: insets.top }}>
          <StatusBar barStyle="default" />
        </View>

        {/* 상단 뒤로가기 + 타이틀 */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: width * 20,
            alignItems: "center",
            marginTop: height * 15,
          }}
        >
          <Pressable
            style={{ zIndex: 2 }}
            onPress={() => navigation.goBack()}
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
              자주 묻는 질문
            </Text>
          </View>
        </View>

        {/* 검색창 */}
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
              source={require("../../assets/images/search_w.png")}
            />
          </View>
          <TextInput
            style={styles.searchBarInput}
            placeholder="궁금한 내용을 검색해보세요"
            multiline
          />
        </View>

        {/* 질문 리스트 */}
        <View style={{ paddingHorizontal: width * 30, gap: height * 28 }}>
          <Image source={require("../../assets/images/TOP.png")} />

          <Text style={styles.questionText}>
            웨어러블 기기는 어떻게 연동하나요?
          </Text>
          <Text style={styles.questionText}>
            아이 견종을 찾을 수 없어요
          </Text>
          <Text style={styles.questionText}>
            주소는 어떻게 수정할 수 있나요?
          </Text>
          <Text style={styles.questionText}>
            아이 견종을 찾을 수 없어요
          </Text>
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
  questionText: {
    fontSize: width * 15,
  },
});
