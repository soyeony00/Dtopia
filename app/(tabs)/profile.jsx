import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  StatusBar,
  Alert,
  Dimensions,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";

import BackIcon from "../../assets/images/back.svg";
import PanIcon from "../../assets/images/pan.svg";
import BellIcon from "../../assets/images/bell.svg";
import TipIcon from "../../assets/images/tip.svg";
import ProfileIcon from "../../assets/images/profile.svg";

const { width, height } = Dimensions.get("window");

const ProfileScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    image: null,
    phone: "",
    email: "",
    address: "",
  });
  const [dateData, setDateData] = useState({
    activeAmPm: "",
    hour: "",
    minute: "",
    eDate: "",
    date: "",
  });
  const [petData, setPetData] = useState({
    name: "",
    dogType: "",
    brithDay: "2025.01.01",
    image: null,
    gender: "",
  });

  // ---- 로컬(AsyncStorage) 불러오기
  const loadFromStorage = useCallback(async () => {
    try {
      const [userDataStr, dateDataStr, petDataStr] = await Promise.all([
        AsyncStorage.getItem("userData"),
        AsyncStorage.getItem("dateData"),
        AsyncStorage.getItem("data"),
      ]);

      if (userDataStr) setProfileData(JSON.parse(userDataStr));
      if (dateDataStr) setDateData(JSON.parse(dateDataStr));
      if (petDataStr) setPetData(JSON.parse(petDataStr));
    } catch (e) {
      console.error("스토리지 데이터 불러오기 실패", e);
    }
  }, []);

  // ---- 서버에서 최신 유저 프로필 가져오기
  const fetchUserFromServer = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("로그인이 필요합니다.");

      const res = await fetch("http://dtopia.jumpingcrab.com:5151/api/user/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => null);
      console.log("GET /api/user/profile:", res.status, data);

      if (!res.ok) {
        const msg = (data && (data.message || data.msg)) || "유저 정보를 가져오지 못했습니다.";
        throw new Error(msg);
      }

      // 서버 응답 형태에 맞춰 매핑
      const user = data?.user || {};
      const nextProfile = {
        name: user.name ?? "",
        image: user.image ?? null, // 서버가 프로필 이미지 URL을 준다면 반영
        phone: user.phone ?? "",
        email: user.email ?? "",
        address: user.address ?? "",
      };

      setProfileData(nextProfile);
      // 로컬도 동시에 갱신 (다음 진입 시 바로 보이도록)
      await AsyncStorage.setItem("userData", JSON.stringify(nextProfile));
    } catch (e) {
      console.warn("유저 프로필 불러오기 실패:", e?.message);
      // 실패해도 화면은 로컬 값으로 계속 표시
    }
  }, []);

  // 최초 마운트: 로컬 → 서버 순서로 갱신
  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadFromStorage();
      await fetchUserFromServer();
      setLoading(false);
    })();
  }, [loadFromStorage, fetchUserFromServer]);

  // 화면 포커스될 때마다 서버 재조회 (프로필 수정 후 돌아왔을 때 반영)
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        try {
          await fetchUserFromServer();
        } finally {
          if (alive) setLoading(false);
        }
      })();
      return () => { alive = false; };
    }, [fetchUserFromServer])
  );

  const pickImage = async () => {
    launchImageLibrary(
      { mediaType: "photo", maxWidth: 1024, maxHeight: 1024, quality: 0.8 },
      (response) => {
        if (!response.didCancel && !response.errorCode) {
          const uri = response.assets?.[0]?.uri;
          if (uri) {
            setProfileData((prev) => ({ ...prev, image: uri }));
          }
        }
      }
    );
  };

  const calculateAge = (birthDateString) => {
    if (!birthDateString?.includes(".")) return "";
    const [year, month, day] = birthDateString.split(".").map(Number);
    const today = new Date();
    let age = today.getFullYear() - year;
    if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) {
      age--;
    }
    return age;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["userData", "dateData", "data", "authToken"]);
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const moveToAlarm = () => navigation.navigate("AlarmDetail", dateData);
  const moveToProfileEdit = () => navigation.navigate("ProfileDetail", profileData);
  const moveToPetEdit = () => navigation.navigate("PetDetail", petData);

  const petAge = calculateAge(petData.brithDay);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
        <StatusBar barStyle="dark-content" />

        {/* 상단 바 */}
        <Pressable
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Tabs", state: { routes: [{ name: "HomeScreen" }] } }],
            });
          }}
          style={styles.iconButton}
        >
          <BackIcon />
        </Pressable>

        {/* 본문 */}
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* 로딩 인디케이터 (첫 로딩 시) */}
          {loading && (
            <View style={{ paddingVertical: 20, alignItems: "center" }}>
              <ActivityIndicator />
            </View>
          )}

          {/* 프로필 카드 */}
          <View style={[styles.card, styles.profileCard]}>
            <Pressable onPress={pickImage} style={styles.profileAvatarWrapper}>
              {profileData.image ? (
                <Image source={{ uri: profileData.image }} style={styles.profileAvatar} />
              ) : (
                <View style={styles.profileAvatarFallback}>
                  <ProfileIcon width={40} height={40} />
                </View>
              )}
            </Pressable>

            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>
                {profileData.name || "닉네임을 설정해 주세요"}
              </Text>
              <Text style={styles.profileSub}>
                {profileData.email || profileData.phone || "연락처 정보를 추가해 보세요"}
              </Text>
            </View>

            <Pressable onPress={moveToProfileEdit} style={styles.editPill}>
              <PanIcon width={16} height={16} />
              <Text style={styles.editPillText}>프로필 편집</Text>
            </Pressable>
          </View>

          {/* 알림 카드 */}
          <Pressable onPress={moveToAlarm} style={[styles.card, styles.tipCard]}>
            <TipIcon style={{ position: "absolute", right: 14, top: 12 }} />
            <View style={styles.cardHeader}>
              <BellIcon width={width * 0.05} height={width * 0.05} />
              <Text style={styles.cardHeaderTitle}>알림</Text>
            </View>
            <Text style={styles.tipText}>
              {dateData.activeAmPm
                ? `${dateData.eDate} ${dateData.activeAmPm === "am" ? "오전" : "오후"} ${dateData.hour}:${dateData.minute}`
                : "알림을 설정해 반려견 스케줄을 챙겨보세요!"}
            </Text>
          </Pressable>

          {/* 반려견 카드 */}
          <Pressable onPress={moveToPetEdit} style={[styles.card, styles.petCard]}>
            <View style={styles.petRow}>
              <View style={styles.petImageWrapper}>
                {petData.image ? (
                  <Image source={{ uri: petData.image }} style={styles.petImage} />
                ) : (
                  <Image source={require("../../assets/images/undefind.png")} style={styles.petImage} />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.petTitleRow}>
                  <Text style={styles.petNameText}>
                    {petData.name || "강아지 이름 미설정"}
                  </Text>
                  {!!petData.gender && (
                    <View
                      style={[
                        styles.genderBadge,
                        petData.gender === "female" ? styles.badgePink : styles.badgeBlue,
                      ]}
                    >
                      <Text
                        style={[
                          styles.genderBadgeText,
                          { color: petData.gender === "female" ? "#B04A7E" : "#2A79C5" },
                        ]}
                      >
                        {petData.gender === "female" ? "암컷" : "수컷"}
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={styles.petMetaText}>
                  {petData.dogType || "견종 미설정"}
                  {petAge !== "" ? ` · ${petAge}살` : ""}
                </Text>

                {petData.brithDay ? (
                  <Text style={styles.petSubText}>생일: {petData.brithDay}</Text>
                ) : (
                  <Text style={styles.petSubText}>생일 정보 없음</Text>
                )}
              </View>
            </View>
          </Pressable>

          {/* 메뉴 리스트 */}
          <View style={styles.menuList}>
            <Pressable style={[styles.menuItem, styles.menuTop]} onPress={() => navigation.navigate("ChangePassword")}>
              <Text style={styles.menuText}>비밀번호 변경</Text>
              <Text style={styles.menuArrow}>›</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => navigation.navigate("Question")}>
              <Text style={styles.menuText}>자주 묻는 질문</Text>
              <Text style={styles.menuArrow}>›</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={logout}>
              <Text style={styles.menuText}>로그아웃</Text>
              <Text style={styles.menuArrow}>›</Text>
            </Pressable>
            <Pressable style={[styles.menuItem, styles.menuBottom]} onPress={() => Alert.alert("개발 예정")}>
              <Text style={[styles.menuText, { color: "#E55353" }]}>탈퇴하기</Text>
              <Text style={[styles.menuArrow, { color: "#E55353" }]}>›</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ProfileScreen;

// ===== 공통 섀도우 =====
const SHADOW =
  Platform.OS === "ios"
    ? { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } }
    : { elevation: 4 };

const styles = StyleSheet.create({
  /* 상단 심플 바 */
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.05, // 이미 있음
    paddingVertical: 12,
  },

  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,      // 👈 왼쪽 여백 추가
  },
  topTitle: { flex: 1, textAlign: "center", fontSize: width * 0.05, fontWeight: "800", color: "#1B3B1B" },

  /* 공통 카드 레이아웃 */
  card: {
    marginHorizontal: width * 0.05,
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    ...SHADOW,
  },

  /* 프로필 카드 */
  profileCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  profileAvatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#F1F7EE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  profileAvatar: { width: "100%", height: "100%" },
  profileAvatarFallback: { width: "100%", height: "100%", alignItems: "center", justifyContent: "center" },
  profileName: { fontSize: 18, fontWeight: "800", color: "#273B2F" },
  profileSub: { fontSize: 12, color: "#6B7D6E", marginTop: 4 },
  editPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3FDE8",
    borderColor: "#A8DF8E",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  editPillText: { marginLeft: 6, color: "#2E6A2E", fontSize: 12, fontWeight: "700" },

  /* 알림 카드 */
  tipCard: { backgroundColor: "#F5FFF0", borderWidth: 1, borderColor: "#DFF2D5" },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 },
  cardHeaderTitle: { fontSize: 16, fontWeight: "800", color: "#2A3E2A" },
  tipText: { fontSize: 14, color: "#456045" },

  /* 반려견 카드 */
  petCard: { backgroundColor: "#FFEEF0", borderWidth: 1, borderColor: "#FFD6DD" },
  petRow: { flexDirection: "row", alignItems: "center" },
  petImageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 14,
    overflow: "hidden",
    marginRight: 14,
    backgroundColor: "#FFF6F7",
    borderWidth: 1,
    borderColor: "#FFD6DD",
  },
  petImage: { width: "100%", height: "100%" },
  petTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  petNameText: { fontSize: 18, fontWeight: "800", color: "#333" },
  petMetaText: { marginTop: 4, fontSize: 14, color: "#666" },
  petSubText: { marginTop: 4, fontSize: 12, color: "#888" },
  genderBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  genderBadgeText: { fontSize: 12, fontWeight: "800" },
  badgePink: { backgroundColor: "#FFF1F6", borderColor: "#F4B8D1" },
  badgeBlue: { backgroundColor: "#EEF4FF", borderColor: "#BBD3F8" },

  /* 메뉴 리스트 */
  menuList: {
    marginTop: 18,
    marginHorizontal: width * 0.05,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    ...SHADOW,
  },
  menuItem: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F2F2F2",
  },
  menuTop: { borderTopWidth: 0 },
  menuBottom: { borderBottomWidth: 0 },
  menuText: { fontSize: 15, color: "#2D2D2D", fontWeight: "600" },
  menuArrow: { fontSize: 20, color: "#B0B0B0" },
});
