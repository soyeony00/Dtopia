import { View, Text, StyleSheet, Platform, Linking } from "react-native";
import { FilterButton } from "./FilterButton";
import PointerIcon from "../../assets/images/pointer.svg";

export const HospitalItem = ({ hospital }) => {
  const handleNavigate = () => {
    // Kakao 길찾기 링크 생성
    if (hospital.lat && hospital.lng) {
      const kakaoUrl = `https://map.kakao.com/link/to/${encodeURIComponent(hospital.name)},${hospital.lat},${hospital.lng}`;
      Linking.openURL(kakaoUrl);
    } else if (hospital.location_link) {
      Linking.openURL(hospital.location_link); // fallback
    }
  };

  return (
    <View key={hospital.id} style={styles.container}>
      <View style={styles.wrapper}>
        {/* 병원 이름 + 길찾기 버튼 */}
        <View style={styles.itemHeader}>
          <Text style={styles.hospitalName}>{hospital.name}</Text>
          <FilterButton
            title="길찾기"
            onClick={handleNavigate}
            icon={<PointerIcon />}
          />
        </View>

        {/* 전화번호 */}
        {hospital.phone && (
          <Text style={styles.phone}>📞 {hospital.phone}</Text>
        )}

        {/* 주소 */}
        {hospital.road_address && (
          <Text style={styles.address}>{hospital.road_address}</Text>
        )}
        {hospital.address && hospital.address !== hospital.road_address && (
          <Text style={styles.subAddress}>({hospital.address})</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  wrapper: {
    padding: 28,
    backgroundColor: "white",
    borderRadius: 15,
    flexDirection: "column",
    gap: 6,
    ...(Platform.OS === "android" && {
      elevation: 20,
      shadowColor: "rgba(0, 0, 0, 0.4)",
    }),
    ...(Platform.OS === "ios" && {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }),
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  phone: {
    fontSize: 13,
    color: "#000",
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    color: "#666",
  },
  subAddress: {
    fontSize: 12,
    color: "#999",
  },
});
