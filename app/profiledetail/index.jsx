import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";
import LinearGradient from "react-native-linear-gradient";

// 아이콘
import BackIcon from "../../assets/images/back.svg";
import PanIcon from "../../assets/images/pan.svg";
import ProfileIcon from "../../assets/images/profile.svg";

const { width, height } = Dimensions.get("window");

export default function ProfileDetail() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const res = await fetch("http://dtopia.jumpingcrab.com:5151/api/user/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setPhone(data.user.phone || "");
          setAddress(data.user.address || "");
        } else {
          Alert.alert("불러오기 실패", data.message || "유저 정보를 가져오지 못했습니다.");
        }
      } catch (error) {
        console.error("통신 에러:", error);
        Alert.alert("에러", "서버와 통신 중 문제가 발생했습니다.");
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 1 },
      (response) => {
        if (!response.didCancel && !response.errorCode) {
          setImage(response.assets[0].uri);
        } else if (response.errorMessage) {
          Alert.alert("에러", "이미지를 선택하는데 실패했습니다.");
        }
      }
    );
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await fetch("http://dtopia.jumpingcrab.com:5151/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, phone, address }),
      });

      if (res.ok) {
        Alert.alert("저장 완료", "프로필이 성공적으로 저장되었습니다.");
        navigation.goBack();
      } else {
        const data = await res.json();
        Alert.alert("저장 실패", data.message || "프로필 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("저장 중 오류:", error);
      Alert.alert("에러", "저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
          <BackIcon />
        </Pressable>
        <Text style={styles.headerTitle}>프로필 편집</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* 프로필 이미지 */}
        <View style={styles.profileImageWrapper}>
          <Pressable onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <View style={styles.defaultImage}>
                <ProfileIcon width={70} height={100} />
              </View>
            )}
          </Pressable>
          <Text style={styles.imageHint}>프로필 사진 변경</Text>
        </View>

        {/* 입력 필드 */}
        <View style={styles.formSection}>
          <View style={styles.inputCard}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              ref={nameRef}
              value={name}
              onChangeText={setName}
              placeholder="이름을 입력하세요"
              style={styles.inputField}
            />
            <PanIcon />
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              ref={emailRef}
              value={email}
              onChangeText={setEmail}
              placeholder="이메일을 입력하세요"
              style={styles.inputField}
            />
            <PanIcon />
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.label}>전화번호</Text>
            <TextInput
              ref={phoneRef}
              value={phone}
              onChangeText={setPhone}
              placeholder="전화번호를 입력하세요"
              style={styles.inputField}
            />
            <PanIcon />
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.label}>주소</Text>
            <TextInput
              ref={addressRef}
              value={address}
              onChangeText={setAddress}
              placeholder="주소를 입력하세요"
              style={styles.inputField}
            />
            <PanIcon />
          </View>
        </View>

        {/* 저장 버튼 */}
        <Pressable onPress={handleSave} style={{ marginTop: 30 }}>
          <LinearGradient
            colors={["#A8DF8E", "#6FCF97"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>저장하기</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const SHADOW =
  Platform.OS === "ios"
    ? {
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    }
    : { elevation: 3 };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  iconButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "#333",
  },

  profileImageWrapper: { alignItems: "center", marginTop: 20 },
  defaultImage: {
    backgroundColor: "#F5F5F5",
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: width * 0.18,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW,
  },
  profileImage: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: width * 0.18,
    ...SHADOW,
  },
  imageHint: { marginTop: 10, fontSize: 13, color: "#777" },

  formSection: { marginTop: 30, paddingHorizontal: width * 0.06 },

  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 16,
    ...SHADOW,
  },
  label: { flex: 1, fontSize: 14, fontWeight: "600", color: "#333" },
  inputField: { flex: 3, fontSize: 14, color: "#333", padding: 0 },

  saveButton: {
    marginHorizontal: width * 0.3,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    height: 70,
    ...SHADOW,
  },
  saveButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
