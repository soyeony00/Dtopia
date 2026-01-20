import React, { useState } from "react";
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

// 피부 질환 멘트 매핑
const skinDiseaseMessages = {
  0: "❗ 미란 또는 궤양(erosion/ulcer)이 의심됩니다. 피부에 상처나 벗겨짐이 있을 수 있습니다.",
  1: "❗ 태선화 및 과색소침착이 의심됩니다. 만성 염증의 신호일 수 있으니 병원 방문을 권장합니다.",
  2: "❗ 결절 또는 종괴(nodule/mass)가 의심됩니다. 정확한 조직검사가 필요할 수 있습니다.",
  3: "❗ 구진 또는 판(papule/plaque)이 의심됩니다. 알레르기나 감염 가능성이 있습니다.",
  4: "❗ 농포 또는 여드름(pustule/acne)이 의심됩니다. 세균성 감염일 수 있으니 진료를 권장합니다.",
  5: "❗ 인설 및 각질(scaling/keratin)이 의심됩니다. 피부 건조증 또는 피부염 증상일 수 있습니다.",
};

export default function SkinDetectionScreen() {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

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
          setResult("");
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
      name: asset.fileName || "skin.jpg",
    });

    try {
      const res = await axios.post(
        "http://dtopia.jumpingcrab.com:5151/api/health/skin",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("🧴 피부검사 결과:", res.data);

      const { m1_class_index, m2_class_index } = res.data;

      if (m1_class_index === 0) {
        setResult("✅ 피부가 정상으로 판단됩니다.");
      } else if (m1_class_index === 1) {
        const message = skinDiseaseMessages[m2_class_index];
        setResult(message || "❗ 질환은 감지되었으나 정확한 분류가 어렵습니다.");
      } else {
        setResult("❓ 예측 결과를 해석할 수 없습니다.");
      }
    } catch (err) {
      console.error("🚨 서버 에러:", err);
      Alert.alert("업로드 실패", "서버로 이미지 전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
        <Text style={styles.buttonText}>📷 사진 촬영</Text>
      </TouchableOpacity>

      {photo && <Image source={{ uri: photo.uri }} style={styles.previewImage} />}
      {loading && <ActivityIndicator size="large" color="#A8DF8E" />}

      {!loading && result !== "" && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>🧪 검사 결과</Text>
          <Text style={styles.resultText}>{result}</Text>

          <TouchableOpacity
            style={[styles.captureButton, { marginTop: 20 }]}
            onPress={handleTakePhoto}
          >
            <Text style={styles.buttonText}>🔁 다시 촬영</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", padding: 24 },
  captureButton: { backgroundColor: "#A8DF8E", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, marginBottom: 20 },
  buttonText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  previewImage: { width: 300, height: 300, borderRadius: 10, marginBottom: 20 },
  resultBox: { marginTop: 20, padding: 16, backgroundColor: "#E6FFE6", borderRadius: 10, width: "100%", alignItems: "center" },
  resultTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#333" },
  resultText: { fontSize: 15, color: "#444", textAlign: "center" },
});
