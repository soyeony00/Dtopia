import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Row } from "../../components/ui/Row";
import { FilterButton } from "../../components/shared/FilterButton";
import { HospitalItem } from "../../components/shared/HospitalItem";
import BackIcon from "../../assets/images/back.svg";

const filters = [
  { id: 1, title: "가까운 거리순" },
  { id: 2, title: "진료 중" },
  { id: 3, title: "평점 높은 순" },
];

const hospitals = [
  {
    id: 1,
    name: "삼송동물병원",
    location_link: "https://goo.gl/maps/SeoulGardenBBQ",
    rating: 4.7,
    total_rating: 1253,
    status: 1,
    open_time: "10:00",
    close_time: "20:00",
    description: "경기 고양시 덕양구 삼송로 92 우영프라자 2층",
  },
  {
    id: 2,
    name: "동물의료센터",
    location_link: "https://goo.gl/maps/GwangjangMarket",
    rating: 4.5,
    total_rating: 872,
    status: 1,
    open_time: "09:00",
    close_time: "21:00",
    description: "경기 고양시 덕양구 삼송로 154-1",
  },
  {
    id: 3,
    name: "24시라인동물의료센터",
    location_link: "https://goo.gl/maps/JejuBlackPorkHouse",
    rating: 4.8,
    total_rating: 523,
    status: 1,
    open_time: "11:00",
    close_time: "22:00",
    description: "경기 고양시 덕양구 동송로 70 힐스테이트 삼송역",
  },
  {
    id: 4,
    name: "웰니스동물병원",
    location_link: "https://goo.gl/maps/BusanFishMarket",
    rating: 4.6,
    total_rating: 398,
    status: 1,
    open_time: "10:30",
    close_time: "19:30",
    description: "경기도 고양시 덕양구 고양대로 1955 스타필드 고양",
  },
  {
    id: 5,
    name: "포근한 동물병원",
    location_link: "https://goo.gl/maps/IncheonChicken",
    rating: 4.9,
    total_rating: 763,
    status: 0,
    open_time: "12:00",
    close_time: "23:00",
    description: "경기 고양시 덕양구 동세로 63 강남프라자 103호",
  },
];

export default function HospitalDetail() {
  const navigation = useNavigation(); // ✅ 수정
  const [selectedFilter, setSelectedFilter] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Row gap={8}>
            <Text style={styles.headerTitle}>고양시 덕양구</Text>
            <Pressable onPress={() => navigation.navigate("hospitalSearch")}>
              <Image
                style={{ width: 16, height: 16 }}
                source={require("../../assets/images/search.png")}
              />
            </Pressable>
          </Row>

          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon />
          </Pressable>
        </View>

        <View style={styles.filterButtonContainer}>
          {filters.map((item) => (
            <FilterButton
              key={item.id}
              title={item.title}
              onClick={() => setSelectedFilter(item)}
              isSelected={item === selectedFilter}
            />
          ))}
        </View>
      </View>

      <FlatList
        data={hospitals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <HospitalItem hospital={item} />}
        contentContainerStyle={{ paddingVertical: 10 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  filterButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
});
