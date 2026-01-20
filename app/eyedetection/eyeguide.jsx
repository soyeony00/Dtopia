import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");
const IMAGE_SIZE = width * 0.4;

export default function EyeGuideScreen() {
  const navigation = useNavigation();

  const handleStartDetection = () => {
    navigation.navigate("EyeDetection", { autoStart: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 타이틀 */}
        <Text style={styles.title}>안구 질환 검사 가이드</Text>

        <Text style={styles.description}>
          반려견의 눈 사진을 촬영하면{"\n"}
          AI 모델이 질환 여부를 분석해 드립니다.
        </Text>

        {/* 주요 질환 */}
        <Text style={styles.sectionTitle}>진단 가능한 주요 질환</Text>
        <View style={styles.bulletBox}>
          <Text style={styles.bullet}>- 백내장 (Cataract)</Text>
          <Text style={styles.bullet}>- 결막염 (Conjunctivitis)</Text>
          <Text style={styles.bullet}>- 안검종양 (Eyelid tumor)</Text>
          <Text style={styles.bullet}>- 궤양성 각막염 (Ulcerative keratitis)</Text>
          <Text style={styles.bullet}>- 색소침착형 각막염 (Pigmentary keratitis)</Text>
        </View>

        {/* 유의사항 */}
        <Text style={styles.sectionTitle}>검사 전 유의사항</Text>
        <View style={styles.bulletBox}>
          <Text style={styles.bullet}>- 눈에 빛 반사가 없도록 촬영하세요</Text>
          <Text style={styles.bullet}>- 눈 중심이 선명하게 보이도록 가까이서 촬영</Text>
          <Text style={styles.bullet}>- 반려견을 안정시킨 후 흔들림 없이 촬영</Text>
        </View>

        {/* 예시 이미지 */}
        <View style={styles.exampleRow}>
          <View style={styles.exampleCard}>
            <Image
              source={require("../../assets/images/eye_bad.jpg")}
              style={styles.exampleImage}
              resizeMode="cover"
            />
            <Text style={styles.exampleLabelWrong}>잘못된 예</Text>
            <Text style={styles.exampleExplain}>흐림, 반사, 눈 중심 미포함</Text>
          </View>

          <View style={styles.exampleCard}>
            <Image
              source={require("../../assets/images/eye_good.jpg")}
              style={styles.exampleImage}
              resizeMode="cover"
            />
            <Text style={styles.exampleLabelGood}>올바른 예</Text>
            <Text style={styles.exampleExplain}>또렷하고 정면으로 촬영</Text>
          </View>
        </View>

        {/* 안내 문구 */}
        <Text style={styles.notice}>
          ※ 본 검사는 참고용이며, 이상 소견이 보일 경우{"\n"}반드시 동물병원에서 정확한 진단을 받으세요.
        </Text>

        {/* 시작 버튼 */}
        <TouchableOpacity onPress={handleStartDetection} style={styles.buttonWrapper}>
          <LinearGradient
            colors={["#A8DF8E", "#6FCF97"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.startButton}
          >
            <Text style={styles.startButtonText}>검사 시작하기</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const SHADOW = {
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 24, alignItems: "center" },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2E6A2E",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
    alignSelf: "flex-start",
    marginTop: 18,
    marginBottom: 8,
  },
  bulletBox: { alignSelf: "flex-start", marginBottom: 6 },
  bullet: { fontSize: 14, color: "#555", marginBottom: 6 },

  exampleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 24,
    marginBottom: 20,
  },
  exampleCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    padding: 10,
    ...SHADOW,
  },
  exampleImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 10,
    marginBottom: 10,
  },
  exampleLabelWrong: {
    color: "#E55353",
    fontWeight: "700",
    fontSize: 15,
  },
  exampleLabelGood: {
    color: "#2E6A2E",
    fontWeight: "700",
    fontSize: 15,
  },
  exampleExplain: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 2,
  },

  notice: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
    marginVertical: 16,
    paddingHorizontal: 10,
  },

  buttonWrapper: { width: "50%", marginTop: 10, ...SHADOW },
  startButton: {
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});