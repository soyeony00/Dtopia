import React, { useState, useRef, useCallback, useContext } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import LinearGradient from "react-native-linear-gradient";
import { Buffer } from "buffer";
import { BluetoothContext } from "../bluetoothContext";
const backgroundImage = require("../../assets/images/homeback.png");

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [petInfo, setPetInfo] = useState(null);
  const [loadingPet, setLoadingPet] = useState(true);
  const [errorPet, setErrorPet] = useState(null);

  // ✅ Context에서 Bluetooth 값 가져오기
  const { btConnected, bpm, temp, connect, connecting } = useContext(BluetoothContext);
  const [showConnectedBanner, setShowConnectedBanner] = useState(false);

  // 센서 상태
  const animatedBpm = useRef(new Animated.Value(0)).current;
  const [bpmDisplay, setBpmDisplay] = useState(null);

  const [soundLabel, setSoundLabel] = useState(null);
  const [soundError, setSoundError] = useState(null);
  const [error, setError] = useState(null);

  const soundLabelText = {
    bark: "짖는 소리가 감지되었어요",
    moan: "낑낑거리는 소리가 감지되었어요",
    other : "알 수 없는 소리가 감지되고 있어요."
  };

  // Wave Lottie Ref
  const waveRef = useRef(null);

  // -------- 펫 프로필 (로컬에서 불러오기) --------
  const calculateAge = (birthDots) => {
    if (!birthDots || !birthDots.includes(".")) return "";
    const [year, month, day] = birthDots.split(".").map(Number);
    const today = new Date();
    let age = today.getFullYear() - year;
    if (
      today.getMonth() + 1 < month ||
      (today.getMonth() + 1 === month && today.getDate() < day)
    ) {
      age--;
    }
    return age;
  };

  const getPetDataFromStorage = async () => {
    try {
      setLoadingPet(true);
      const storedData = await AsyncStorage.getItem("data");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        const pet = {
          name: parsed.name,
          breed: parsed.dogType,
          birthday: parsed.brithDay,
          gender: parsed.gender === "male" ? "수컷" : "암컷",
          image: parsed.image || null,
        };

        if (pet.birthday) {
          const birthYear = parseInt(pet.birthday.split(".")[0]);
          const thisYear = new Date().getFullYear();
          pet.age = thisYear - birthYear;
        }

        setPetInfo(pet);
        setErrorPet(null);
      } else {
        setErrorPet("등록된 반려동물 정보가 없어요.");
        setPetInfo(null);
      }
    } catch (err) {
      console.error("펫 정보 불러오기 실패:", err);
      setErrorPet("펫 정보를 불러오지 못했습니다.");
      setPetInfo(null);
    } finally {
      setLoadingPet(false);
    }
  };

  // 화면 들어올 때마다 최신 데이터 로딩
  useFocusEffect(
    useCallback(() => {
      getPetDataFromStorage();
    }, [])
  );

  // bpm 애니메이션 반영
  React.useEffect(() => {
    if (bpm !== null) {
      Animated.timing(animatedBpm, {
        toValue: bpm,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [bpm, animatedBpm]);

  React.useEffect(() => {
    const id = animatedBpm.addListener(({ value }) =>
      setBpmDisplay(Math.round(value))
    );
    return () => animatedBpm.removeListener(id);
  }, [animatedBpm]);

  // -------- 소리 라벨만 주기적으로 폴링 (BT와 무관) --------
  const fetchSoundLabel = async () => {
    try {
      const res = await fetch("http://dtopia.jumpingcrab.com:5151/api/health/sound/result");
      if (!res.ok) throw new Error();
      const data = await res.json();

      if (data?.label) {
        const cleanLabel = data.label.trim().toLowerCase();
        setSoundLabel(cleanLabel);
      }
    } catch {
      
    }
  };

  React.useEffect(() => {
    fetchSoundLabel();
    const soundInterval = setInterval(fetchSoundLabel, 1000);
    return () => clearInterval(soundInterval);
  }, []);

  const [soundMessage, setSoundMessage] = useState(null);

  React.useEffect(() => {
    if (soundLabel) {
      setSoundMessage(soundLabel);

      // 3초 후 문구만 사라지게
      const timeout = setTimeout(() => setSoundMessage(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [soundLabel]);

  // -------- UI 표시용 --------
  const showLiveBadge = btConnected;
  const displayBpm = btConnected ? bpmDisplay ?? bpm : "-";
  const displayTemp = btConnected ? temp : "-";

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ position: "relative" }}>
        <ImageBackground
          source={backgroundImage}
          style={{ height: 330, width: "100%" }}
          resizeMode="cover"
        >
          <LinearGradient
            pointerEvents="none"
            colors={[
              "rgba(255,255,255,0)",
              "rgba(255,255,255,0.8)",
              "#ffffff",
            ]}
            style={styles.bottomFade}
          />
          <View style={styles.topContainer}>
            <View style={styles.petCard}>
              <View style={styles.petAvatarWrap}>
                {petInfo?.image ? (
                  <Image source={{ uri: petInfo.image }} style={styles.petAvatar} />
                ) : (
                  <Image
                    source={require("../../assets/images/dog1.png")}
                    style={styles.petAvatar}
                  />
                )}
              </View>

              <View style={styles.petInfoTextBoxOverlay}>
                {loadingPet ? (
                  <Text style={styles.noPetText}>로딩 중...</Text>
                ) : petInfo ? (
                  <>
                    <Text style={styles.petNameText}>
                      {petInfo.name || "이름 미등록"}
                    </Text>
                    <Text style={styles.petDetailText}>
                      {petInfo.breed || "견종 미등록"}
                      {petInfo.age !== "" && petInfo.age !== null
                        ? ` · ${petInfo.age}살`
                        : ""}
                    </Text>
                    <Text style={styles.petDetailMinor}>
                      성별: {petInfo.gender || "미등록"} | 생일:{" "}
                      {petInfo.birthday || "미등록"}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.noPetText}>
                    {errorPet || "등록된 반려동물 정보가 없어요."}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.deviceStatusRow}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            {connecting && <ActivityIndicator size="small" color="#007bff" />}
            {showConnectedBanner ? (
              <Text
                style={[
                  styles.statusText,
                  styles.successText,
                  { marginLeft: 8 },
                ]}
              >
                ✅ HM-10(PICO-BT) 연결됨
              </Text>
            ) : (
              !connecting &&
              !btConnected && (
                <Text style={[styles.statusText, { marginLeft: 0 }]}>
                  ⚠️ 기기가 연결되지 않았습니다.
                </Text>
              )
            )}
          </View>

          {!btConnected && (
            <TouchableOpacity
              style={styles.deviceButton}
              onPress={() => connect(/* 필요 시 device */)}
              disabled={connecting}
            >
              <Text style={styles.deviceButtonText}>
                {connecting ? "연결 중..." : "기기 설정"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.petStateContainer}>
          <Text style={styles.currentStateTitle}>
            {petInfo?.name ? `${petInfo.name}의 현재 상태는?` : "반려동물 상태 확인"}
          </Text>

          <View style={[styles.card, styles.stateBox]}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.stateTitle}>♥ 심박수</Text>
              {showLiveBadge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>실시간</Text>
                </View>
              )}
            </View>

            <View style={styles.heartRow}>
              <LottieView
                source={require("../../assets/animations/heartbeat.json")}
                autoPlay
                loop
                style={styles.heartbeatAnim}
              />
              <Text style={styles.bpmBigText}>
                {displayBpm === "-" ? "-" : displayBpm} bpm
              </Text>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <View style={styles.rowBoxes}>
            <View
              style={[styles.card, styles.stateBox, styles.flex1, styles.rightGap]}
            >
              <View style={styles.cardHeaderRow}>
                <Text style={styles.stateTitle}>체온</Text>
                {showLiveBadge && (
                  <View style={[styles.badge, { backgroundColor: "#FFF1EF" }]}>
                    <Text style={[styles.badgeText, { color: "#FF5A3C" }]}>
                      실시간
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.tempBigText}>
                {displayTemp === "-" ? "-" : displayTemp}°C
              </Text>
              <Text style={styles.metricHint}>정상 범위: 37~39°C</Text>
            </View>

            <View
              style={[styles.card, styles.stateBox, styles.flex2, styles.leftGap]}
            >
              <Text style={styles.stateTitle}>실시간 소리 감지</Text>

              {/* ✅ 애니메이션은 항상 표시 */}
              <View style={styles.waveWrapper}>
                <LottieView
                  ref={waveRef}
                  source={require("../../assets/animations/Wave.json")}
                  autoPlay
                  loop
                  style={{ width: 100, height: 80 }}
                />
              </View>

              {/* ✅ 문구는 감지된 경우에만 표시 */}
              {soundMessage && (
                <View style={{ alignItems: "center", marginTop: 10 }}>
                  <Text style={styles.soundLabelText}>
                    {soundLabelText[soundMessage]}
                  </Text>
                </View>
              )}
            </View>

          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const SHADOW = {
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  petCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    ...SHADOW,
  },
  petAvatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  petAvatar: { width: 64, height: 64, resizeMode: "cover" },

  petInfoTextBoxOverlay: { flex: 1 },
  petNameText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  petDetailText: { fontSize: 16, color: "#555", marginTop: 2 },
  petDetailMinor: { fontSize: 13, color: "#777", marginTop: 4 },
  noPetText: { fontSize: 16, color: "#666" },

  deviceStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  statusText: {
    fontSize: 16,
    color: "#333",
  },
  successText: {
    color: "#0A7A2F",
    fontWeight: "700",
  },

  deviceButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    ...SHADOW,
  },
  deviceButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  petStateContainer: { padding: 20 },
  currentStateTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 10 },

  card: { backgroundColor: "#fff", borderRadius: 14, padding: 14, marginVertical: 6, ...SHADOW },
  stateBox: {},
  stateTitle: { fontSize: 16, fontWeight: "bold", color: "#111" },
  bpmText: { fontSize: 16, color: "#007bff", marginTop: 5 },
  errorText: { fontSize: 14, color: "red", marginTop: 8 },

  cardHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  badge: { backgroundColor: "#E7F3FF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 12, color: "#0A7AFF", fontWeight: "700" },

  heartRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 },
  heartbeatAnim: { width: 200, height: 60, transform: [{ scale: 4 }] },
  bpmBigText: { fontSize: 20, color: "#0A7AFF", marginLeft: 30, paddingBottom: 20, fontWeight: "700" },

  rowBoxes: { flexDirection: "row", marginTop: 6 },
  flex1: { flex: 2, minWidth: 0 },
  flex2: { flex: 3, minWidth: 0 },
  rightGap: { marginRight: 6 },
  leftGap: { marginLeft: 6 },

  tempBigText: { fontSize: 24, fontWeight: "800", color: "#FF5A3C", marginTop: 8 },
  metricHint: { fontSize: 12, color: "#8A8A8A", marginTop: 4 },

  waveWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  soundLabelText: { fontSize: 16, color: "#333", textAlign: "center" },

  bottomFade: { position: "absolute", bottom: 0, width: "100%", height: 80 },
});

export default HomeScreen;
