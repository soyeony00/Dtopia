import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const IMAGE_SIZE = width * 0.42;

export default function SkinGuideScreen() {
  const navigation = useNavigation();

  const handleStart = () => {
    navigation.navigate("SkinDetection"); // index.jsx의 컴포넌트
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>🧴 반려동물 피부질환 검사 가이드</Text>
        <Text style={styles.description}>
          피부 사진을 AI가 분석해 피부염, 탈모, 피부 종양 등 질환 여부를 진단합니다.{"\n"}
          사진은 서버로 전송되어 학습된 모델을 통해 분석됩니다.
        </Text>

        <Text style={styles.sectionTitle}>🔍 진단 가능한 주요 질환</Text>
        <Text style={styles.bullet}>• 피부염 (Dermatitis)</Text>
        <Text style={styles.bullet}>• 탈모 (Alopecia)</Text>
        <Text style={styles.bullet}>• 피부 종양 (Skin tumor)</Text>
        <Text style={styles.bullet}>• 감염증 (Infection)</Text>

        <Text style={styles.sectionTitle}>💡 검사 전 유의사항</Text>
        <Text style={styles.bullet}>• 털을 걷고 피부가 보이도록 근접 촬영</Text>
        <Text style={styles.bullet}>• 초점이 흐릿하거나 반사된 이미지는 피해주세요</Text>

        <View style={styles.exampleRow}>
          <View style={styles.exampleBox}>
            <Image
              source={require("../../assets/images/skin_bad.jpg")}
              style={styles.exampleImage}
            />
            <Text style={styles.exampleLabelWrong}>❌ 잘못된 예</Text>
          </View>

          <View style={styles.exampleBox}>
            <Image
              source={require("../../assets/images/skin_good.png")}
              style={styles.exampleImage}
            />
            <Text style={styles.exampleLabelGood}>✅ 올바른 예</Text>
          </View>
        </View>

        <Text style={styles.notice}>
          ※ 본 검사는 참고용이며, 반드시 동물병원에서 정확한 진단을 받으시길 권장합니다.
        </Text>

        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>검사 시작하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 24, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  description: { fontSize: 14, textAlign: "center", marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", alignSelf: "flex-start", marginVertical: 8 },
  bullet: { fontSize: 13, alignSelf: "flex-start", marginBottom: 4 },
  exampleRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginVertical: 20 },
  exampleBox: { width: "48%", alignItems: "center" },
  exampleImage: { width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: 10 },
  exampleLabelWrong: { color: "#ff4d4d", fontWeight: "bold", fontSize: 15, marginTop: 8 },
  exampleLabelGood: { color: "#28a745", fontWeight: "bold", fontSize: 15, marginTop: 8 },
  notice: { fontSize: 13, color: "#999", textAlign: "center", marginVertical: 20 },
  startButton: { backgroundColor: "#A8DF8E", paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12 },
  startButtonText: { fontWeight: "bold", fontSize: 16 },
});
