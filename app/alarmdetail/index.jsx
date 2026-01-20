import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  SafeAreaView,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import BackIcon from "../../assets/images/back.svg";

export const everyDateArray = ["매주", "매월"];
export const dateArray = ["월", "화", "수", "목", "금", "토", "일"];

const dayToNumber = {
  월: 1,
  화: 2,
  수: 3,
  목: 4,
  금: 5,
  토: 6,
  일: 7,
};

function getNextAlarmDateTime(selectedDay, selectedTime, eDate, timeEnabled) {
  const now = new Date();
  const targetDate = new Date(now);

  if (eDate === "매주") {
    const weekDays = ["월", "화", "수", "목", "금", "토", "일"];
    const selectedWeekDay = weekDays.indexOf(selectedDay);
    const today = now.getDay();
    const adjustedToday = today === 0 ? 6 : today - 1;

    let dayOffset = selectedWeekDay - adjustedToday;
    if (dayOffset < 0) dayOffset += 7;
    targetDate.setDate(now.getDate() + dayOffset);
  } else {
    targetDate.setDate(parseInt(selectedDay));
    if (targetDate < now) {
      targetDate.setMonth(targetDate.getMonth() + 1);
    }
  }

  if (timeEnabled) {
    targetDate.setHours(selectedTime.getHours());
    targetDate.setMinutes(selectedTime.getMinutes());
    targetDate.setSeconds(0);
  } else {
    targetDate.setHours(0, 0, 0, 0);
  }

  return `${targetDate.getFullYear()}년 ${targetDate.getMonth() + 1
    }월 ${targetDate.getDate()}일` + (timeEnabled ? ` ${targetDate.getHours()}시 ${targetDate.getMinutes()}분` : "");
}

export default function AlarmDetail() {
  const navigation = useNavigation();
  const route = useRoute();

  const [timeEnabled, setTimeEnabled] = useState(true);
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [eDate, setEdate] = useState(route.params?.eDate || "매주");
  const [date, setDate] = useState(route.params?.date || "월");
  const [nextDateTimeText, setNextDateTimeText] = useState("");

  useEffect(() => {
    const result = getNextAlarmDateTime(date, time, eDate, timeEnabled);
    setNextDateTimeText(result);
  }, [date, time, eDate, timeEnabled]);

  const saveData = async () => {
    try {
      const value = { time: timeEnabled ? time : null, eDate, date };
      await AsyncStorage.setItem("dateData", JSON.stringify(value));

      let notification_type = "weekly";
      let notification_days = [];

      if (eDate === "매월") {
        notification_type = "monthly";
        notification_days = [parseInt(date)];
      } else {
        notification_days = [dayToNumber[date]];
      }

      const payload = {
        notification_type,
        notification_days,
        notification_time: timeEnabled
          ? `${time.getHours().toString().padStart(2, "0")}:${time
            .getMinutes()
            .toString()
            .padStart(2, "0")}`
          : null,
      };

      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("인증 실패", "로그인이 필요합니다.");
        return;
      }

      const res = await axios.post(
        "http://dtopia.jumpingcrab.com:5151/api/user/notifytime",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ 서버 응답:", res.data);
      navigation.navigate("Profile");
    } catch (error) {
      console.error("❌ 알림 저장 또는 서버 전송 실패:", error);
      Alert.alert("알림 저장 실패", "서버 전송 중 오류가 발생했습니다.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <BackIcon />
        </Pressable>
        <Text style={styles.headerTitle}>알림 설정</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* 반복 주기 */}
        <Text style={styles.sectionTitle}>반복 주기</Text>
        <View style={styles.rowWrap}>
          {everyDateArray.map((item) => (
            <Pressable key={item} onPress={() => setEdate(item)}>
              <View
                style={[styles.chip, eDate === item && styles.activeChip]}
              >
                <Text
                  style={[
                    styles.chipText,
                    eDate === item && styles.activeChipText,
                  ]}
                >
                  {item}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* 요일 또는 날짜 */}
        <Text style={styles.sectionTitle}>
          {eDate === "매주" ? "요일" : "날짜"}
        </Text>
        <View style={styles.rowWrap}>
          {(eDate === "매주"
            ? dateArray
            : Array.from({ length: 31 }, (_, i) => (i + 1).toString())
          ).map((item) => (
            <Pressable key={item} onPress={() => setDate(item)}>
              <View
                style={[
                  styles.circleButton,
                  date === item && styles.activeCircle,
                ]}
              >
                <Text
                  style={[
                    styles.circleText,
                    date === item && styles.activeCircleText,
                  ]}
                >
                  {item}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* 시간 선택 */}
        <Text style={styles.sectionTitle}>시간</Text>
        <View style={styles.rowWrap}>
          <Pressable onPress={() => setTimeEnabled(true)}>
            <View style={[styles.chip, timeEnabled && styles.activeChip]}>
              <Text
                style={[styles.chipText, timeEnabled && styles.activeChipText]}
              >
                설정
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={() => setTimeEnabled(false)}>
            <View style={[styles.chip, !timeEnabled && styles.activeChip]}>
              <Text
                style={[styles.chipText, !timeEnabled && styles.activeChipText]}
              >
                미설정
              </Text>
            </View>
          </Pressable>
        </View>

        {timeEnabled && (
          <>
            <Pressable
              style={styles.timeButton}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.timeText}>
                {time.getHours().toString().padStart(2, "0")} :{" "}
                {time.getMinutes().toString().padStart(2, "0")}
              </Text>
            </Pressable>

            {showPicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display={Platform.OS === "ios" ? "spinner" : "clock"}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === "android") setShowPicker(false);
                  if (selectedDate) setTime(selectedDate);
                }}
              />
            )}
          </>
        )}

        {/* 미리보기 */}
        <View style={{ marginTop: 28, alignItems: "center" }}>
          <Text style={styles.previewLabel}>알림 예정</Text>
          <Text style={styles.previewMainText}>{nextDateTimeText}</Text>
        </View>

        {/* 저장 버튼 */}
        <Pressable onPress={saveData} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>저장하기</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: { marginRight: 10 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },

  // 반복 주기 & 시간 칩 (핑크 테마)
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  chipText: { fontSize: 14, color: "#555" },
  activeChip: {
    backgroundColor: "#FFE5E5",
    borderWidth: 1,
    borderColor: "#FF8A8A",
  },
  activeChipText: { color: "#FF5A5A", fontWeight: "700" },

  // 요일/날짜 버튼 (연두색 테마)
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  circleText: { fontSize: 14, color: "#333" },
  activeCircle: {
    backgroundColor: "#E6FAD6",
    borderWidth: 1,
    borderColor: "#A8DF8E",
  },
  activeCircleText: { color: "#1B3B1B", fontWeight: "700" },

  timeButton: {
    padding: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    alignItems: "center",
  },
  timeText: { fontSize: 24, fontWeight: "bold", color: "#333" },

  // 미리보기 박스 (핑크 카드)
  previewBox: {
    marginTop: 28,
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: "#FFF5F5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFD6D6",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  previewTag: {
    backgroundColor: "#FFEBEB",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  previewTagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#D33",
  },
  previewMainText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },

  // 저장 버튼 (연두색)
  saveButton: {
    backgroundColor: "#A8DF8E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
});
