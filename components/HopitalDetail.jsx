import { FilterButton } from "@/components/shared/FilterButton";
import { HospitalItem } from "@/components/shared/HospitalItem";
import { Row } from "@/components/ui/Row";
import { useState } from "react";
import BackIcon from "@/assets/images/back.svg";
import {
  StyleSheet,
  Image,
  View,
  SafeAreaView,
  Text,
  Pressable,
  FlatList,
} from "react-native";
import { router } from "expo-router";

const filters = [
  {
    id: 1,
    title: "가까운 거리순",
  },
  {
    id: 2,
    title: "진료 중",
  },
  {
    id: 3,
    title: "평점 높은 순",
  },
];

const hospitals = [
  {
    id: 1,
    name: "서울 가든 BBQ",
    location_link: "https://goo.gl/maps/SeoulGardenBBQ",
    rating: 4.7,
    total_rating: 1253,
    status: 1,
    open_time: "10:00",
    close_time: "20:00",
    description:
      "다양한 양념 고기와 신선한 채소로 즐길 수 있는 정통 한국식 BBQ 경험.",
  },
  {
    id: 2,
    name: "광장 시장 푸드코트",
    location_link: "https://goo.gl/maps/GwangjangMarket",
    rating: 4.5,
    total_rating: 872,
    status: 1,
    open_time: "09:00",
    close_time: "21:00",
    description:
      "떡볶이, 빈대떡, 김밥 등 전통 한국 길거리 음식을 제공하는 활기찬 시장.",
  },
  {
    id: 3,
    name: "제주 흑돼지 하우스",
    location_link: "https://goo.gl/maps/JejuBlackPorkHouse",
    rating: 4.8,
    total_rating: 523,
    status: 1,
    open_time: "11:00",
    close_time: "22:00",
    description:
      "제주의 유명한 흑돼지를 독특한 소스와 함께 완벽하게 구워낸 요리 전문점.",
  },
  {
    id: 4,
    name: "부산 어시장 식당",
    location_link: "https://goo.gl/maps/BusanFishMarket",
    rating: 4.6,
    total_rating: 398,
    status: 1,
    open_time: "10:30",
    close_time: "19:30",
    description:
      "신선한 해산물을 시장에서 직접 선택하여 생으로 또는 조리해서 제공.",
  },
  {
    id: 5,
    name: "인천 치킨 하우스",
    location_link: "https://goo.gl/maps/IncheonChicken",
    rating: 4.9,
    total_rating: 763,
    status: 0,
    open_time: "12:00",
    close_time: "23:00",
    description:
      "다양한 소스와 사이드 메뉴로 선택 가능한 바삭한 한국식 프라이드 치킨 전문점.",
  },
];

export default function HopitalDetail() {
  const [selectedFilter, setSelectedFilter] = useState();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 fixed top-0 left-0 bg-white right-0 border-b border-gray-100">
        <View className="relative flex flex-row justify-center mb-5">
          <Row gap={8}>
            <Text className="text-center text-base font-bold">
              고양시 덕양구
            </Text>
            <Image
              width={16}
              height={16}
              source={require("@/assets/images/search.png")}
            />
          </Row>
          <Pressable
            className="absolute left-0 top-0"
            onPress={() => router.back()}
          >
            <BackIcon />
          </Pressable>
        </View>
        <View style={styles.filterButton}>
          {filters.map((item, index) => {
            return (
              <FilterButton
                key={index}
                title={item.title}
                onClick={() => setSelectedFilter(item)}
                isSelected={item === selectedFilter}
              />
            );
          })}
        </View>
      </View>

      <FlatList
        className="bg-transparent"
        data={hospitals}
        ListHeaderComponent={() => <View className="h-5"></View>}
        ListFooterComponent={() => <View className="h-5"></View>}
        ItemSeparatorComponent={() => <View className="h-5"></View>}
        renderItem={({ item }) => <HospitalItem hospital={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterButton: { display: "flex", flexDirection: "row", gap: 6 },
});
