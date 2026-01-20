import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { launchCamera } from "react-native-image-picker";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

const diseaseNames = {
  0: "백내장 (Cataract)",
  1: "결막염 (Conjunctivitis)",
  2: "안검 종양 (Eyelid tumor)",
  3: "색소침착형 각막염 (Pigmentary keratitis)",
  4: "궤양성 각막염 (Ulcerative keratitis)",
};

const diseaseMessages = {
  0: "시력 저하 가능성이 있어 수의사의 상담을 권장합니다.",
  1: "세균성, 알레르기성 등 원인 확인이 필요합니다.",
  2: "빠른 시일 내에 병원 진료를 권장합니다.",
  3: "지속적인 자극 또는 유전적 원인이 있을 수 있습니다.",
  4: "통증이 심할 수 있으므로 신속한 진료가 필요합니다.",
};

export default function EyeDetectionScreen() {
  const route = useRoute();
  const autoStart = route.params?.autoStart;

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // {status, disease, message}

  useEffect(() => {
    if (autoStart && !photo && !result) {
      handleTakePhoto();
    }
  }, [autoStart]);

  const handleTakePhoto = () => {
    launchCamera(
      {
        mediaType: "photo",
        cameraType: "back",
        saveToPhotos: true,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert("에러", response.errorMessage || "카메라 실행 실패");
          return;
        }

        const asset = response.assets?.[0];
        if (asset) {
          setPhoto(asset);
          setResult(null);
          sendImageToServer(asset);
        }
      }
    );
  };

  const sendImageToServer = async (asset) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", {
      uri: asset.uri,
      type: asset.type || "image/jpeg",
      name: asset.fileName || "eye.jpg",
    });

    try {
      const response = await axios.post(
        "http://dtopia.jumpingcrab.com:5151/api/health/eye",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { m1_class_index, m2_class_index } = response.data;

      if (m1_class_index === 0) {
        setResult({
          status: "normal",
          disease: null,
          message: "✅ 정상으로 판단됩니다.",
        });
      } else if (m1_class_index === 1) {
        setResult({
          status: "abnormal",
          disease: diseaseNames[m2_class_index],
          message: diseaseMessages[m2_class_index],
        });
      } else {
        setResult({
          status: "unknown",
          disease: null,
          message: "❓ 예측 결과를 해석할 수 없습니다.",
        });
      }
    } catch (err) {
      console.error("🚨 서버 에러:", err);
      Alert.alert("업로드 실패", "서버로 이미지 전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getCardStyle = () => {
    if (!result) return {};
    if (result.status === "normal") return styles.cardNormal;
    if (result.status === "abnormal") return styles.cardAbnormal;
    return styles.cardUnknown;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 로딩 */}
      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={{ marginTop: 12, color: "#555" }}>검사 중입니다...</Text>
        </View>
      )}

      {/* 결과 */}
      {!loading && result && (
        <View style={[styles.resultCard, getCardStyle()]}>
          <Text style={styles.resultTitle}>검사 결과</Text>

          {photo && <Image source={{ uri: photo.uri }} style={styles.previewImage} />}

          {result.status === "normal" && (
            <Text style={styles.resultNormal}>{result.message}</Text>
          )}

          {result.status === "abnormal" && (
            <>
              <Text style={styles.diseaseName}>{result.disease}</Text>
              <Text style={styles.resultAbnormal}>{result.message}</Text>
            </>
          )}

          {result.status === "unknown" && (
            <Text style={styles.resultUnknown}>{result.message}</Text>
          )}

          <TouchableOpacity
            style={[styles.captureButton, { marginTop: 20 }]}
            onPress={handleTakePhoto}
          >
            <Text style={styles.buttonText}>다시 검사</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FFF9",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingBox: { alignItems: "center", justifyContent: "center" },
  previewImage: {
    width: 240,
    height: 240,
    borderRadius: 16,
    marginVertical: 16,
  },
  resultCard: {
    padding: 24,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    width: "100%",
  },
  cardNormal: { backgroundColor: "#E9FCE9" },
  cardAbnormal: { backgroundColor: "#FDEAEA" },
  cardUnknown: { backgroundColor: "#EEE" },

  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#D32F2F",
    marginBottom: 6,
  },
  resultNormal: {
    fontSize: 16,
    color: "#2E7D32",
    textAlign: "center",
    lineHeight: 22,
  },
  resultAbnormal: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
  },
  resultUnknown: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
  captureButton: {
    backgroundColor: "#ddd",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 14,
    elevation: 3,
  },
  buttonText: { color: "#000", fontWeight: "bold", fontSize: 17 },
});
