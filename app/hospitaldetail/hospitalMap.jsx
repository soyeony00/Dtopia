// src/screens/HospitalDetail/index.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  FlatList,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
import BackIcon from "../../assets/images/back.svg";

const KAKAO_REST_API_KEY = "8c33432bf2577f08b42a4c51693ab56a";

// ── 거리 계산 함수(km)
const haversineKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // 지구 반경 km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

export default function HospitalDetail() {
  const navigation = useNavigation();

  const [hospitals, setHospitals] = useState([]);
  const [myPos, setMyPos] = useState(null);

  const [radius, setRadius] = useState(3000); // m
  const [onlyPhone, setOnlyPhone] = useState(false);
  const [sortByDist, setSortByDist] = useState(true);

  // 병원 조회
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        if (Platform.OS === "android") {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert("권한 필요", "위치 권한을 허용해주세요.");
            return;
          }
        }

        Geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            setMyPos({ lat: latitude, lng: longitude });

            const query = `https://dapi.kakao.com/v2/local/search/keyword.json?query=동물병원&x=${longitude}&y=${latitude}&radius=${radius}&size=15`;

            const res = await fetch(query, {
              headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` },
            });
            const json = await res.json();

            if (json.documents && json.documents.length > 0) {
              const enriched = json.documents.map((place, idx) => {
                const lat = Number(place.y);
                const lng = Number(place.x);
                const distKm = haversineKm(latitude, longitude, lat, lng);

                return {
                  id: idx + 1,
                  name: place.place_name,
                  phone: place.phone || null,
                  road_address: place.road_address_name || null,
                  address: place.address_name || null,
                  location_link: `https://map.kakao.com/link/to/${encodeURIComponent(
                    place.place_name
                  )},${place.y},${place.x}`,
                  distKm,
                };
              });
              setHospitals(enriched);
            } else {
              setHospitals([]);
            }
          },
          (err) => {
            console.error("❌ 위치 가져오기 실패:", err);
            Alert.alert("위치 에러", "현재 위치를 가져오지 못했습니다.");
          },
          { enableHighAccuracy: true }
        );
      } catch (e) {
        console.error("🚨 예외 발생:", e);
        Alert.alert("오류", "병원 데이터를 불러오는 중 문제가 발생했습니다.");
      }
    };

    fetchHospitals();
  }, [radius]);

  // 필터 + 정렬 적용
  const filteredHospitals = useMemo(() => {
    let list = hospitals;
    if (onlyPhone) list = list.filter((h) => !!h.phone);
    if (sortByDist) list = [...list].sort((a, b) => a.distKm - b.distKm);
    return list;
  }, [hospitals, onlyPhone, sortByDist]);

  const handleCall = (phone) => {
    if (phone) Linking.openURL(`tel:${phone}`);
    else Alert.alert("전화 불가", "전화번호 정보가 없습니다.");
  };

  const handleDirection = (link) => {
    Linking.openURL(link);
  };

  const renderHospital = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.address}>{item.road_address || item.address}</Text>
      {item.phone && <Text style={styles.phone}>{item.phone}</Text>}
      {item.distKm && (
        <Text style={styles.distance}>{item.distKm.toFixed(1)} km</Text>
      )}

      <View style={styles.actions}>
        <Pressable
          style={[styles.actionButton, { backgroundColor: "#FFDADA" }]}
          onPress={() => handleDirection(item.location_link)}
        >
          <Text style={styles.actionText}>길찾기</Text>
        </Pressable>
        <Pressable
          style={[
            styles.actionButton,
            { backgroundColor: item.phone ? "#DFF4C8" : "#E0E0E0" },
          ]}
          onPress={() => item.phone && handleCall(item.phone)}
        >
          <Text style={styles.actionText}>전화</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon />
        </Pressable>
        <Text style={styles.headerTitle}>주변 동물병원</Text>
      </View>
      <View style={styles.divider} />

      {/* 필터 바 */}
      <View style={styles.filterRow}>
        <Pressable
          style={[styles.filterBtn, radius === 1000 && styles.filterActive]}
          onPress={() => setRadius(1000)}
        >
          <Text style={styles.filterText}>1km</Text>
        </Pressable>
        <Pressable
          style={[styles.filterBtn, radius === 3000 && styles.filterActive]}
          onPress={() => setRadius(3000)}
        >
          <Text style={styles.filterText}>3km</Text>
        </Pressable>
        <Pressable
          style={[styles.filterBtn, radius === 5000 && styles.filterActive]}
          onPress={() => setRadius(5000)}
        >
          <Text style={styles.filterText}>5km</Text>
        </Pressable>

        <Pressable
          style={[styles.filterBtn, onlyPhone && styles.filterActive]}
          onPress={() => setOnlyPhone((v) => !v)}
        >
          <Text style={styles.filterText}>전화있음</Text>
        </Pressable>

        <Pressable
          style={[styles.filterBtn, sortByDist && styles.filterActive]}
          onPress={() => setSortByDist((v) => !v)}
        >
          <Text style={styles.filterText}>거리순</Text>
        </Pressable>
      </View>

      {/* 리스트 */}
      <FlatList
        data={filteredHospitals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderHospital}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  backButton: { marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#222" },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 16,
    marginBottom: 20,
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  filterActive: {
    backgroundColor: "#DFF4C8",
    borderColor: "#A8DB8F",
  },
  filterText: { fontSize: 13, fontWeight: "600", color: "#333" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: "700", marginBottom: 6, color: "#333" },
  address: { fontSize: 14, color: "#666", marginBottom: 4 },
  phone: { fontSize: 14, color: "#444", marginBottom: 4 },
  distance: { fontSize: 13, color: "#888", marginBottom: 12 },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    marginHorizontal: 6,
    alignItems: "center",
  },
  actionText: { fontSize: 15, fontWeight: "600", color: "#333" },
});
