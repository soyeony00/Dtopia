import React, { useEffect, useState, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import products from "../data/products.json";


const imageMap = {
  1: require("../../assets/images/product1.png"),
  2: require("../../assets/images/product2.png"),
  3: require("../../assets/images/product3.png"),
  4: require("../../assets/images/product4.png"),
  5: require("../../assets/images/product5.png"),
  6: require("../../assets/images/product6.png"),
  7: require("../../assets/images/product7.png"),
  8: require("../../assets/images/product8.png"),
  9: require("../../assets/images/product9.png"),
  10: require("../../assets/images/product10.png"),
  11: require("../../assets/images/product11.png"),
  12: require("../../assets/images/product12.png"),
  13: require("../../assets/images/product13.png"),
  14: require("../../assets/images/product14.png"),
  15: require("../../assets/images/product15.png"),
  16: require("../../assets/images/product16.png"),
  17: require("../../assets/images/product17.png"),
  18: require("../../assets/images/product18.png"),
  19: require("../../assets/images/product19.png"),
  20: require("../../assets/images/product20.png"),
  21: require("../../assets/images/product21.png"),
  22: require("../../assets/images/product22.png"),
  23: require("../../assets/images/product23.png"),
};

const RecommendScreen = () => {
  const [dogName, setDogName] = useState("");
  const [query, setQuery] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPetName = async () => {
      try {
        const data = await AsyncStorage.getItem("data");
        if (data) {
          const petInfo = JSON.parse(data);
          setDogName(petInfo.name || "");
        }
      } catch (error) {
        console.error("강아지 이름 불러오기 실패:", error);
      }
    };
    fetchPetName();
  }, []);

  // 간단한 이름 검색 필터 (제품명 기준)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      String(p["영양제명"] || "").toLowerCase().includes(q)
    );
  }, [query]);

  const renderCard = ({ item }) => {
    const img = imageMap[item.id];
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("ProductDetail", { product: item })}
      >
        {/* 🔼 사진 영역: 흰색 + 배지 zIndex */}
        <View style={styles.cardTop}>
          <View style={styles.recoBadge}>
            <Text style={styles.recoBadgeText}>맞춤</Text>
          </View>
          <Image source={img} resizeMode="contain" style={styles.cardImage} />
        </View>

        {/* 🔽 이름 영역: 연한 초록 배경 */}
        <View style={styles.cardBottom}>
          <Text numberOfLines={2} style={styles.productName}>
            {item["영양제명"]}
          </Text>
          <Text numberOfLines={1} style={styles.productSub}>
            {dogName || "반려견"}에게 추천
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 요약 헤더 */}
      <View style={styles.headerBox}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(dogName || "댕댕이").slice(0, 2)}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            {dogName || "반려견"} 에게 추천해요!
          </Text>
          <Text style={styles.headerDesc}>
            건강을 바탕으로 {filtered.length}가지 제품을 골라봤어요.
          </Text>
        </View>
      </View>

      {/* 검색 인풋 */}
      <View style={styles.searchRow}>
        <View style={styles.searchIconBubble}>
          <Text style={styles.searchIcon}></Text>
        </View>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="제품명으로 검색"
          placeholderTextColor="#9AA1A9"
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>

      {/* 추천 제품 그리드 */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCard}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>검색 결과가 없어요 😿</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const CARD_RADIUS = 16;

function shadow(level = 3) {
  const opacity = [0, 0.06, 0.08, 0.1, 0.12][Math.min(level, 4)];
  const radius = [0, 6, 10, 14, 18][Math.min(level, 4)];
  const height = [0, 6, 8, 10, 12][Math.min(level, 4)];
  return {
    shadowColor: "#000",
    shadowOpacity: opacity,
    shadowRadius: radius,
    shadowOffset: { width: 0, height: height },
    elevation: Math.max(2, level + 1),
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // 밝은 회색 배경
  },

  // ===== Header =====
  headerBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 16,
    ...shadow(3),
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E3F2FD", // 파스텔 블루
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1976D2", // 진한 블루
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212121",
  },
  headerDesc: {
    marginTop: 4,
    fontSize: 13,
    color: "#607D8B",
  },

  // ===== Search =====
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F1F3F5", // 연한 회색 배경
    borderRadius: 50, // pill 스타일
  },
  searchIconBubble: {
    marginRight: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#212121",
  },

  // ===== Grid =====
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 32,
    paddingTop: 6,
  },
  gridRow: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },

  // ===== Card =====
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: CARD_RADIUS,
    marginVertical: 10,
    overflow: "hidden",
    ...shadow(2),
  },

  cardTop: {
    position: "relative",
    height: 130,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  cardImage: {
    width: "75%",
    height: "75%",
  },

  recoBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "rgba(76, 175, 80, 0.1)", // 투명한 연두
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  recoBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#388E3C", // 진한 그린
  },

  cardBottom: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#212121",
    minHeight: 36,
  },
  productSub: {
    marginTop: 6,
    fontSize: 12,
    color: "#4CAF50", // 포인트 그린
    fontWeight: "500",
  },

  // ===== Empty =====
  emptyWrap: {
    paddingVertical: 50,
    alignItems: "center",
  },
  emptyText: {
    color: "#9E9E9E",
    fontSize: 14,
  },
});


export default RecommendScreen;
