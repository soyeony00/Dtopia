// app/petdetail/index.jsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  StatusBar,
  Alert,
  Platform,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { height, width } from "../../globalDimension";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";

import BackIcon from "../../assets/images/back.svg";
import ProfileIcon from "../../assets/images/profile.svg";

export default function PetDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = (route && route.params) || {};

  const [active, setActive] = useState((params.gender || "female") === "female");
  const [gender, setGender] = useState(params.gender || "female"); // "male" | "female"
  const [name, setName] = useState(params.name || "");
  const [nameActive, setNameActive] = useState(false);
  const [dogType, setDogType] = useState(params.dogType || "");
  const [dogTypeActive, setDogTypeActive] = useState(false);
  const [image, setImage] = useState(params.image || null);
  const [submitting, setSubmitting] = useState(false);

  // 생일: 캘린더로 선택 (내부 Date, 표시/전송은 YYYY-MM-DD)
  const [birthdayDate, setBirthdayDate] = useState(
    params.brithDay ? parseDotOrDashDate(params.brithDay) : null
  );
  const [showPicker, setShowPicker] = useState(false);

  // BreedSelect에서 돌아왔을 때 선택값 반영
  useEffect(() => {
    if (route?.params?.dogType) {
      setDogType(route.params.dogType);
      if (dogTypeActive && route.params.dogType.trim()) setDogTypeActive(false);
    }
  }, [route?.params?.dogType]);

  function parseDotOrDashDate(s) {
    if (!s) return null;
    const parts = s.replaceAll(".", "-").split("-");
    if (parts.length !== 3) return null;
    const [y, m, d] = parts.map((v) => parseInt(v, 10));
    if (!y || !m || !d) return null;
    const dt = new Date(Date.UTC(y, m - 1, d));
    return isNaN(dt.getTime()) ? null : dt;
  }

  const formatYMD = (date) => {
    if (!date) return "";
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, "0");
    const d = String(date.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // ===== 서버 전송 (multipart + 토큰) =====
  const submitToServer = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("로그인이 필요합니다. 다시 로그인해 주세요.");

    const birthdayForServer = formatYMD(birthdayDate); // YYYY-MM-DD
    const neutered = params?.neutered === true;
    const genderForServer = (gender === "male" ? "수컷" : "암컷") + (neutered ? "(중성화)" : "");

    // 요청 프리뷰 로그
    const requestPreview = {
      name: name.trim(),
      breed: dogType.trim(),
      birthday: birthdayForServer,
      gender: genderForServer,
      photo: image ? "(file:image/jpeg)" : "(no file)",
    };
    console.log("▶ POST /api/pet payload(preview):", requestPreview);

    const form = new FormData();
    form.append("name", name.trim());
    form.append("breed", dogType.trim());
    form.append("birthday", birthdayForServer);
    form.append("gender", genderForServer);

    if (image) {
      const fileName =
        ((image.split("/").pop() || "photo").replace(/\.(heic|HEIC)$/, "")) + ".jpg";
      form.append("photo", { uri: image, name: fileName, type: "image/jpeg" });
    }

    const res = await fetch("http://dtopia.jumpingcrab.com:5151/api/pet", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: form,
    });

    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch { }
    let data = null;
    try {
      data = bodyText ? JSON.parse(bodyText) : null;
    } catch { }
    console.log("◀ POST /api/pet status:", res.status, "body:", bodyText);

    if (!res.ok) {
      const msg = (data && (data.message || data.msg)) || bodyText || "변경에 실패했습니다.";
      throw new Error(msg);
    }
    return (data && (data.message || data.msg)) || "변경이 완료되었습니다.";
  };

  const onSubmit = async () => {
    setNameActive(name.trim() === "");
    setDogTypeActive(dogType.trim() === "");

    if (!birthdayDate) {
      Alert.alert("오류", "생년월일을 선택해 주세요.");
      return;
    }
    if (!name.trim() || !dogType.trim()) return;

    try {
      setSubmitting(true);
      const serverMsg = await submitToServer();

      // 로컬 저장(표시용 생일은 YYYY.MM.DD)
      const value = {
        name,
        dogType,
        brithDay: formatYMD(birthdayDate).replaceAll("-", "."),
        image,
        gender,
      };
      await AsyncStorage.setItem("data", JSON.stringify(value));

      Alert.alert("완료", serverMsg);
      // 뒤로가기 눌러도 PetDetail로 안 돌아오도록 스택 초기화
      navigation.reset({ index: 0, routes: [{ name: "Profile" }] });
    } catch (err) {
      Alert.alert("오류", err?.message || "변경에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const pickImage = () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 1, selectionLimit: 1, includeBase64: false },
      (response) => {
        if (response?.didCancel) return;
        if (response?.errorCode) {
          console.log("이미지 선택 에러:", response?.errorMessage);
          Alert.alert("에러", "이미지를 선택하는 도중 문제가 발생했습니다.");
          return;
        }
        const uri = response?.assets?.[0]?.uri;
        console.log("picked uri:", uri);
        if (uri) setImage(uri);
      }
    );
  };

  const onChangeDate = (event, selectedDate) => {
    // iOS/Android 모두: 날짜를 '선택(set)'했거나 '취소(dismissed)'했으면 닫기
    if (event?.type === "set" && selectedDate) {
      setBirthdayDate(selectedDate);
    }
    setShowPicker(false);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/dog_profile_back.png")}
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle={Platform.OS === "ios" ? "dark-content" : "default"} />

        {/* 헤더 */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <BackIcon />
          </Pressable>
          <Text style={styles.headerTitle}>강아지 정보 수정</Text>
          <View style={{ width: width * 24 }} />
        </View>

        {/* 메인 */}
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            {/* 프로필 이미지 */}
            <View style={styles.imageContainer}>
              <Pressable onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <View style={styles.defaultImage}>
                    <ProfileIcon width={70} height={100} />
                    <Text style={styles.addPhotoText}>사진 추가하기</Text>
                  </View>
                )}
              </Pressable>
            </View>

            {/* 이름 */}
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>🐶 이름</Text>
              <View style={styles.inputWrapper}>
                <ProfileIcon width={20} height={20} style={{ marginRight: 8 }} />
                <TextInput
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    if (nameActive && t.trim()) setNameActive(false);
                  }}
                  placeholder="이름을 입력해 주세요"
                  placeholderTextColor="#9AA0A6"
                  style={styles.inputBox}
                />
              </View>
              {nameActive && <Text style={styles.errorText}>이름을 입력해 주세요</Text>}
            </View>

            {/* 성별 */}
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>⚥ 성별</Text>
              <View style={styles.genderButtonContainer}>
                <Pressable
                  onPress={() => {
                    setActive(true);
                    setGender("female");
                  }}
                  style={[styles.genderButton, active && styles.genderButtonActive]}
                >
                  <Text style={[styles.genderButtonText, active && { color: "#fff" }]}>
                    암컷
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setActive(false);
                    setGender("male");
                  }}
                  style={[styles.genderButton, !active && styles.genderButtonActive]}
                >
                  <Text style={[styles.genderButtonText, !active && { color: "#fff" }]}>
                    수컷
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* 생년월일: 캘린더 */}
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>📅 생년월일</Text>
              <Pressable
                onPress={() => setShowPicker((prev) => !prev)}
                style={[styles.inputWrapper, { justifyContent: "space-between" }]}
              >
                <Text style={styles.smallIconText}>YYYY-MM-DD</Text>
                <Text style={[styles.inputBox, { color: birthdayDate ? "#333" : "#9AA0A6" }]}>
                  {birthdayDate ? formatYMD(birthdayDate) : "날짜를 선택해 주세요"}
                </Text>
              </Pressable>

              {showPicker && (
                <DateTimePicker
                  value={birthdayDate || new Date()}
                  mode="date"
                  display={Platform.select({ ios: "inline", android: "calendar" })}
                  onChange={onChangeDate}
                  maximumDate={new Date()}
                />
              )}
            </View>

            {/* 견종: 선택화면으로 이동 */}
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>🐾 견종</Text>
              <Pressable
                onPress={() =>
                  navigation.navigate("BreedSelect", {
                    currentBreed: dogType,
                    defaultCat: "소형견",
                    // ✅ 콜백 전달: BreedSelect에서 저장 시 이 콜백을 호출하고 goBack()
                    onSelect: (pickedName) => {
                      setDogType(pickedName);        // 선택한 '이름(견종)'만 반영
                      setDogTypeActive(false);       // 에러표시 끄기 등
                    },
                  })
                }
                style={[styles.inputWrapper, { justifyContent: "space-between" }]}
              >
                <Text style={styles.smallIconText}>Breed</Text>
                <Text style={[styles.inputBox, { color: dogType ? "#333" : "#9AA0A6" }]} numberOfLines={1}>
                  {dogType || "견종을 선택해 주세요"}
                </Text>
              </Pressable>
              {dogTypeActive && <Text style={styles.errorText}>견종을 선택해 주세요</Text>}
            </View>
          </View>

          {/* 저장 버튼 */}
          <View style={{ alignItems: "center", marginBottom: height * 20 }}>
            <Pressable
              onPress={onSubmit}
              disabled={submitting}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && { transform: [{ scale: 0.98 }] },
                submitting && { opacity: 0.6 },
              ]}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>저장하기</Text>
              )}
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const SHADOW =
  Platform.OS === "ios"
    ? {
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    }
    : { elevation: 3 };

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { resizeMode: "cover", opacity: 0.12 },
  safe: { flex: 1, backgroundColor: "transparent" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 20,
    marginTop: height * 10,
    marginBottom: height * 12,
  },
  backButton: { width: width * 24, height: width * 24, justifyContent: "center" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: width * 16, fontWeight: "700", color: "#333" },

  imageContainer: { alignItems: "center", marginBottom: height * 16, marginTop: height * 8 },
  defaultImage: {
    backgroundColor: "#F9FAFB",
    width: width * 167,
    height: width * 167,
    borderRadius: width * 150,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#A8DF8E",
    ...SHADOW,
  },
  image: { width: width * 167, height: width * 167, borderRadius: width * 150, ...SHADOW },
  addPhotoText: { marginTop: 8, color: "#6FCF97", fontWeight: "600" },

  fieldBlock: { marginTop: height * 14, paddingHorizontal: width * 24 },
  label: { fontSize: 14, color: "#5F6368", marginBottom: 8, fontWeight: "600" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7F9",
    paddingHorizontal: 12,
    borderRadius: 14,
    height: 52,
    borderWidth: 1,
    borderColor: "#E6EBF0",
    ...SHADOW,
  },
  inputBox: { flex: 1, paddingVertical: 10, fontSize: 16, color: "#333" },
  smallIconText: { fontSize: 12, color: "#9AA0A6", marginRight: 8 },
  errorText: { color: "#E74C3C", fontSize: 12, marginTop: 6, marginLeft: 6 },

  genderButtonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  genderButton: {
    backgroundColor: "#EFEFEF",
    flex: 1,
    height: 50,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6EBF0",
    ...SHADOW,
  },
  genderButtonActive: { backgroundColor: "#A8DF8E", borderColor: "#8AD76F" },
  genderButtonText: { fontSize: 16, fontWeight: "700", color: "#5F6368" },

  saveButton: {
    width: "86%",
    height: 56,
    backgroundColor: "#6FCF97",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW,
  },
  saveButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 18, letterSpacing: 0.2 },
});
