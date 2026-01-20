import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { BluetoothContext } from "../bluetoothContext";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function ComprehensiveInspection() {
  const { btConnected, connect, bpm, temp } = useContext(BluetoothContext);
  const [step, setStep] = useState(0);
  const [bpmSamples, setBpmSamples] = useState([]);
  const [tempSamples, setTempSamples] = useState([]);
  const [result, setResult] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const getAverage = (arr) =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : null;

  useEffect(() => {
    fadeIn();
  }, [step]);

  // 준비 단계 타이머
  useEffect(() => {
    if (btConnected && step === 0) {
      const timer = setTimeout(() => {
        setStep(1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [btConnected, step]);

  // 데이터 수집
  useEffect(() => {
    let interval;
    if (btConnected && step === 1) {
      interval = setInterval(() => {
        if (bpm) {
          setBpmSamples((prev) => {
            const updated = [...prev, bpm];
            if (updated.length >= 10) {
              clearInterval(interval);
              setTimeout(() => setStep(2), 500);
            }
            return updated;
          });
        }
      }, 1000);
    } else if (btConnected && step === 2) {
      interval = setInterval(() => {
        if (temp) {
          setTempSamples((prev) => {
            const updated = [...prev, temp];
            if (updated.length >= 10) {
              clearInterval(interval);
              setResult({
                avgBpm: getAverage(bpmSamples),
                avgTemp: getAverage(updated),
                date: new Date().toLocaleString(),
              });
              setTimeout(() => setStep(3), 500);
            }
            return updated;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, btConnected, bpm, temp]);

  // 블루투스 미연결
  if (!btConnected) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Icon name="bluetooth-off" size={60} color="#bbb" />
          <Text style={styles.warningText}>
            블루투스 기기가 연결되지 않았습니다
          </Text>
          <TouchableOpacity onPress={connect} style={{ marginTop: 20 }}>
            <LinearGradient colors={["#6FCF97", "#3CA55C"]} style={styles.button}>
              <Text style={styles.buttonText}>기기 연결하기</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ 견종별 팁 데이터 (확장)
  const breedTips = {
    말티즈: {
      tips: ["슬개골 탈구에 취약하니 미끄러운 바닥 주의", "눈물자국 관리 필요", "저혈당 주의"],
      cautions: ["짖음이 스트레스 신호일 수 있음", "장모라 빗질 자주 필요"],
    },
    포메라니안: {
      tips: ["기관허탈 주의", "피부질환 예방 위해 털 관리 필요"],
      cautions: ["더위 취약", "과흥분 시 호흡곤란 주의"],
    },
    치와와: {
      tips: ["체온 변동 심하니 보온 필요", "치아 질환 많아 양치 필수"],
      cautions: ["떨림은 스트레스·저혈당 신호", "높은 곳 점프 금지"],
    },
    비숑: {
      tips: ["피부 알러지 예방", "활발하니 놀이 필요"],
      cautions: ["눈 주위 털 관리", "비만 시 관절·심장질환 위험"],
    },
    요크셔테리어: {
      tips: ["저혈당 주의", "치석 예방 필요"],
      cautions: ["털이 엉키니 빗질 필수", "짖음이 많을 수 있음"],
    },
    미니핀: {
      tips: ["운동량 많음", "추위에 취약"],
      cautions: ["골절 주의", "불안 짖음 발생 가능"],
    },
    시츄: {
      tips: ["단두종이라 호흡기 질환 주의", "눈병 예방 필요"],
      cautions: ["장모 관리 필요", "비만 시 호흡곤란"],
    },
    푸들: {
      tips: ["두뇌 활동 필요", "피부질환·귀병 예방"],
      cautions: ["털 자라서 미용 필수", "관절질환 예방"],
    },
    닥스훈트: {
      tips: ["디스크 주의", "후각 발달"],
      cautions: ["점프 금지", "비만 시 디스크 위험"],
    },
    코카스파니엘: {
      tips: ["외이염 예방", "활동량 많음"],
      cautions: ["눈 질환 주의", "귀 청결 유지"],
    },
    웰시코기: {
      tips: ["디스크 취약", "활발한 운동 필요"],
      cautions: ["비만 시 관절·허리 문제", "계단 오르내리기 금지"],
    },
    슈나우저: {
      tips: ["피부 알러지 주의", "훈련 잘 따름"],
      cautions: ["췌장염 가능성 있어 고지방 음식 금지", "수염 청결 필요"],
    },
    스피츠: {
      tips: ["피부질환 예방", "경계심 강해 사회화 필요"],
      cautions: ["짖음 많음", "털빠짐 많음"],
    },
    비글: {
      tips: ["운동량 많음", "외이염 예방"],
      cautions: ["산책 시 리드줄 필수", "비만 위험 높음"],
    },
    보스턴테리어: {
      tips: ["호흡기 질환 주의", "분리불안 생기기 쉬움"],
      cautions: ["안구 돌출 주의", "더위 취약"],
    },
    바셋하운드: {
      tips: ["귀병 예방", "냄새 추적 본능 강함"],
      cautions: ["허리질환 주의", "비만 위험"],
    },
    불독: {
      tips: ["호흡곤란 잦음", "피부 주름 청결 필요"],
      cautions: ["더위 취약", "운동 과부하 주의"],
    },
    사모예드: {
      tips: ["털 관리 필수", "활발한 성격"],
      cautions: ["피부 질환 주의", "더위 취약"],
    },
    리트리버: {
      tips: ["관절 관리 필요", "활동량 많음"],
      cautions: ["외이염 주의", "비만 예방"],
    },
    말라뮤트: {
      tips: ["체력 강함", "추위에 강함"],
      cautions: ["더위 취약", "분리불안 가능"],
    },
    허스키: {
      tips: ["지구력 강함", "추위에 강함"],
      cautions: ["더위 취약", "울음소리 많음"],
    },
    도베르만: {
      tips: ["규칙적 운동 필요", "충성심 강함"],
      cautions: ["심장병 주의", "추위 취약"],
    },
  };

  // 실제 앱에서는 petInfo.breed 같은 값을 사용
  const currentBreed = "말티즈"; // 예시
  const currentTips = breedTips[currentBreed];

  // ✅ 결과 리포트 화면
  const renderReport = () => {
    if (!result) return null;
    return (
      <ScrollView style={styles.reportContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.reportTitle}>건강관리 리포트</Text>
        <Text style={styles.reportDate}>{result.date}</Text>

        {/* 요약 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>검사 요약</Text>
          <Text style={styles.cardDesc}>심박수 평균: {result.avgBpm} bpm</Text>
          <Text style={styles.cardDesc}>체온 평균: {result.avgTemp} °C</Text>
        </View>

        {/* 그래프 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>측정 그래프</Text>
          <LineChart
            data={{
              labels: bpmSamples.map((_, i) => `${i + 1}`),
              datasets: [
                { data: bpmSamples, color: () => "#1E88E5", strokeWidth: 2 },
                { data: tempSamples, color: () => "#E64A19", strokeWidth: 2 },
              ],
              legend: ["심박수", "체온"],
            }}
            width={screenWidth - 48}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              labelColor: () => "#666",
              propsForDots: { r: "4", strokeWidth: "1", stroke: "#fff" },
            }}
            bezier
            style={{ marginTop: 12, borderRadius: 16 }}
          />
        </View>

        {/* 건강 팁 */}
        {currentTips && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>견종별 건강 팁</Text>
            {currentTips.tips.map((tip, idx) => (
              <Text key={idx} style={styles.tip}>- {tip}</Text>
            ))}
          </View>
        )}

        {/* 관리 주의사항 */}
        {currentTips && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>관리 주의사항</Text>
            {currentTips.cautions.map((caution, idx) => (
              <Text key={idx} style={styles.cardDesc}>✔ {caution}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  // 단계별 UI
  const renderStep = () => {
    if (step === 0) {
      return (
        <View style={styles.stepCard}>
          <Icon name="dog" size={56} color="#555" />
          <Text style={styles.title}>검사 준비 중</Text>
          <Text style={styles.desc}>기기를 강아지에게 가까이 대주세요</Text>
          <ActivityIndicator size="large" color="#555" style={{ marginTop: 16 }} />
        </View>
      );
    }
    if (step === 1) {
      return (
        <View style={styles.stepCard}>
          <Icon name="heart-pulse" size={56} color="#1E88E5" />
          <Text style={styles.title}>심박수 측정 중</Text>
          <Text style={styles.desc}>현재: {bpm || "-"} bpm</Text>
          <Text style={styles.desc}>평균: {getAverage(bpmSamples) || "-"} bpm</Text>
          <ActivityIndicator size="large" color="#1E88E5" style={{ marginTop: 16 }} />
          <Text style={styles.progress}>{bpmSamples.length}/10 수집중..</Text>
        </View>
      );
    }
    if (step === 2) {
      return (
        <View style={styles.stepCard}>
          <Icon name="thermometer" size={56} color="#E64A19" />
          <Text style={styles.title}>체온 측정 중</Text>
          <Text style={styles.desc}>현재: {temp || "-"} °C</Text>
          <Text style={styles.desc}>평균: {getAverage(tempSamples) || "-"} °C</Text>
          <ActivityIndicator size="large" color="#E64A19" style={{ marginTop: 16 }} />
          <Text style={styles.progress}>{tempSamples.length}/10 수집중..</Text>
        </View>
      );
    }
    if (step === 3 && result) {
      return renderReport();
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={{ opacity: fadeAnim, flex: 1, width: "100%" }}>
          {renderStep()}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  stepCard: {
    flex: 1,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fafafa",
    width: "100%",
  },
  title: { fontSize: 20, fontWeight: "bold", marginTop: 12, color: "#333" },
  desc: { fontSize: 16, color: "#555", marginTop: 6, textAlign: "center" },
  progress: { fontSize: 14, color: "#777", marginTop: 10 },
  warningText: { fontSize: 16, marginTop: 12, color: "#444", fontWeight: "600" },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 60,
    alignItems: "center",
  },
  buttonText: { fontSize: 16, fontWeight: "700", color: "#fff" },

  reportContainer: { flex: 1 },
  reportTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 8, color: "#2E7D32" },
  reportDate: { fontSize: 14, color: "#888", marginBottom: 16 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  cardDesc: { fontSize: 15, color: "#555", marginTop: 4 },
  tip: { fontSize: 14, color: "#333", marginTop: 6 },
});
