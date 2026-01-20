import { ServiceCard } from "../../components/shared/ServiceCard";
import BellIcon from "../../assets/images/bell_w.svg";
import { useNavigation } from "@react-navigation/native";
import { height, width } from "../../globalDimension";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

// ✅ 새 이미지 리소스 적용
const hospitalSrc = require("../../assets/images/hospital2.png");
const medicinSrc = require("../../assets/images/medicin2.png");

// ✅ 서비스 카드에 들어갈 데이터
const services = [
  {
    icon: hospitalSrc,
    titleMain: "집 근처 동물병원",
    titleHighlight: "알아보기",
    subTitle: `내 위치 등록 후 \n 가장 가까운 동물 병원 찾아보세요!`,
    buttonTitle: "바로가기",
    route: "HospitalMap",
    gradientColor: "#A8DF8E", // 초록 그림자
  },
  {
    icon: medicinSrc,
    titleMain: "의약품 정보",
    titleHighlight: "알아보기",
    subTitle: `의약품에 대한 정보를 \n 쉽고 빠르게 확인하세요!`,
    buttonTitle: "바로가기",
    route: "MedicineDetail",
    gradientColor: "#8BD8FF", // 파랑 그림자
  },
];

const AroundScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          {/* 알림 벨 아이콘 */}
          <Pressable
            onPress={() => navigation.navigate("PushDetail")}
            style={styles.bellButton}
          >
            <BellIcon width={width * 0.08} height={width * 0.08} />
          </Pressable>

          {/* 서비스 카드 리스트 */}
          {services.map((item, index) => (
            <ServiceCard
              key={index}
              source={item.icon}
              title={
                <Text style={styles.titleText}>
                  {item.titleMain}{" "}
                  <Text style={styles.highlightText}>{item.titleHighlight}</Text>
                </Text>
              }
              subTitle={item.subTitle}
              buttonTitle={item.buttonTitle}
              onClick={() => navigation.navigate(item.route)}
              shadowColor={item.gradientColor}
              buttonColor={index === 0 ? "#F3FDE8" : "#E0F7FF"} // ✅ 아래 카드 파랑 계열
              borderColor={index === 0 ? "#A8DF8E" : "#8BD8FF"} // ✅ 경계도 일치하게
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// ✅ 스타일 정의
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 60,
    gap: 20,
  },
  bellButton: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    elevation: 0,  
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  titleText: {
    color: "#A8DF8E",
    fontSize: 16,
    fontWeight: "bold",
  },
  highlightText: {
    color: "#000000",
  },
});

export default AroundScreen;
