import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { height, width } from "../../globalDimension";
import { SearchCard } from "../../components/shared/SearchCard";
import { useNavigation } from "@react-navigation/native";
import BackIcon from "../../assets/images/back.svg";

const item = require("../../assets/images/item.png");
const item1 = require("../../assets/images/item1.png");
const item2 = require("../../assets/images/item2.png");
const item3 = require("../../assets/images/item3.png");
const item4 = require("../../assets/images/item4.png");

export default function HopitalScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("전체");

  // 화면 내 고정 데이터
  const services = [
    {
      icon: item,
      title: "아이메딘 10정",
      subTitle: `포도상구균에 의한 농피증,\n결막염`,
      description: `다음 환축에는 투여하지 말 것.\n본제 및 macrolide계 항생제에 대한 쇼크와 \n괴민반응이 있었던 동물에는 사용하지 말 것`,
      company: "이엘티사이언스",
      tags: ["결막염", "항생제", "농피증"],
    },
    {
      icon: item1,
      title: "티어가드 100정",
      subTitle: `포도상구균에 의한 농피증,\n결막염의 치료`,
      description: `다음 환축에는 투여하지 말 것.\n본제 및 macrolide계 항생제에 대한 쇼크와 \n괴민반응이 있었던 동물에는 사용하지 말 것`,
      company: "이엘티사이언스",
      tags: ["결막염", "항생제", "농피증"],
    },
    {
      icon: item2,
      title: "마보클린 겔",
      subTitle: `마보플록사신에 감수성이 있는 세균 및 진균에 의한 외이도염의 치료`,
      description: `본 약품은 GMP 시설에서 위생적으로 제조되며 엄격한 품질관리를 필한 제품입니다. 만일 구입시 유효기한이 경과되었거나 변질된 제품은 구입처를 통해 교환해 드립니다.`,
      company: "이엘티사이언스",
      tags: ["외이도염", "항균", "겔"],
    },
    {
      icon: item3,
      title: "브레비콕스",
      subTitle: `개에서 골관절염과 관련한 염증의 치료 및 통증경감에 사용`,
      description: "사용설명서 참조",
      company: "Ashish Life Science Pvt Limited",
      tags: ["관절", "통증", "염증완화"],
    },
    {
      icon: item4,
      title: "프레비콕스",
      subTitle: `개에서 골관절염과 관련한 염증의 치료 및 통증경감에 사용`,
      description: `1. 임신/수유 중 사용 금지\n2. 10주령 미만 또는 3kg 미만 개 금지\n3. 위장관계 출혈, 혈액학적 이상 동물 사용 금지`,
      company: "MERIAL",
      tags: ["관절", "통증", "염증완화"],
    },
  ];

  const allTags = useMemo(() => {
    const set = new Set(["전체"]);
    services.forEach((s) => (s.tags || []).forEach((t) => set.add(t)));
    return Array.from(set);
  }, []);

  // 검색/태그 필터링
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      const text =
        `${s.title} ${s.subTitle} ${s.company} ${(s.tags || []).join(" ")}`.toLowerCase();
      const matchText = q ? text.includes(q) : true;
      const matchTag = activeTag === "전체" ? true : (s.tags || []).includes(activeTag);
      return matchText && matchTag;
    });
  }, [query, activeTag]);

  return (
    <SafeAreaProvider>
      {/* iOS 상단 안전영역 색상 */}
      <View style={{ height: insets.top, backgroundColor: "#A8DF8E" }}>
        <StatusBar barStyle="dark-content" />
      </View>

      {/* 헤더(뒤로가기 + 타이틀) */}
      <View style={{ backgroundColor: "#A8DF8E", paddingTop: height * 10, paddingBottom: height * 12 }}>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <BackIcon />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>의약품 검색</Text>
            <Text style={styles.headerDesc}>증상/성분/제품명으로 찾아보세요</Text>
          </View>
          {/* 오른쪽 공간 균형 */}
          <View style={{ width: width * 40 }} />
        </View>

        {/* 검색바 */}
        <View style={styles.searchBarView}>
          <View style={styles.searchIconWrap}>
            <Image
              width={width * 16}
              height={width * 16}
              source={require("../../assets/images/search_w.png")}
            />
          </View>
          <TextInput
            style={styles.searchBarInput}
            placeholder="의약품에 대해 검색해 보세요"
            placeholderTextColor="#9AA1A9"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 필터 칩 + 결과 카운트 */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: width * 16 }}>
          {allTags.map((tag) => {
            const active = activeTag === tag;
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setActiveTag(tag)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{tag}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.resultCount}>{filtered.length}개</Text>
      </View>

      {/* 약품 리스트 */}
      <View style={{ paddingHorizontal: width * 20, paddingBottom: height * 20, flex: 1 }}>
        {filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Image
              source={require("../../assets/images/search_w.png")}
              style={{ width: width * 40, height: width * 40, opacity: 0.25 }}
            />
            <Text style={styles.emptyTitle}>검색 결과가 없어요</Text>
            <Text style={styles.emptyDesc}>철자를 확인하거나 다른 키워드를 시도해보세요.</Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              gap: width * 15,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {filtered.map((it, index) => (
              <SearchCard
                key={index}
                source={it.icon}
                title={it.title}
                subTitle={it.subTitle}
                onClick={() =>
                  navigation.navigate("searchDetail", {
                    data: it.title,
                    index,
                    company: it.company,
                    description: it.description,
                    subTitle: it.subTitle,
                  })
                }
              />
            ))}
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    paddingHorizontal: width * 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    left: 0,
    zIndex: 2,
    width: width * 40,
    height: width * 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#184A2C",
  },
  headerDesc: {
    marginTop: 2,
    fontSize: 12,
    color: "#2F5D3B",
    opacity: 0.9,
  },

  searchBarView: {
    marginTop: height * 10,
    marginHorizontal: width * 16,
    paddingVertical: height * 10,
    paddingHorizontal: width * 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: width * 14,
    borderWidth: 1,
    borderColor: "#D6EFD8",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  searchIconWrap: {
    width: width * 24,
    height: width * 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 8,
  },
  searchBarInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: "white",
    borderRadius: width * 8,
    paddingVertical: height * 6,
    paddingHorizontal: width * 6,
    color: "#263238",
  },
  clearBtn: {
    width: width * 26,
    height: width * 26,
    borderRadius: width * 13,
    backgroundColor: "#EEF7EB",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: width * 6,
  },
  clearBtnText: {
    fontSize: 16,
    color: "#2F5D3B",
    fontWeight: "800",
    lineHeight: width * 26,
    includeFontPadding: false,
    textAlignVertical: "center",
  },

  filterRow: {
    paddingTop: height * 14,
    paddingBottom: height * 8,
    paddingLeft: width * 16,
    backgroundColor: "#F8FFF7",
    borderBottomWidth: 1,
    borderColor: "#EEF5EC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chip: {
    paddingHorizontal: width * 12,
    paddingVertical: height * 6,
    borderRadius: 999,
    backgroundColor: "#E9F6E5",
    borderWidth: 1,
    borderColor: "#D6EFD8",
    marginRight: width * 8,
  },
  chipActive: {
    backgroundColor: "#A8DF8E",
    borderColor: "#9ED784",
  },
  chipText: {
    fontSize: 12,
    color: "#3C5E47",
    fontWeight: "700",
  },
  chipTextActive: {
    color: "#184A2C",
  },
  resultCount: {
    marginRight: width * 16,
    fontSize: 12,
    color: "#4E6B57",
    fontWeight: "700",
  },

  emptyWrap: {
    marginTop: height * 40,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: height * 12,
    fontSize: 16,
    fontWeight: "800",
    color: "#2F5D3B",
  },
  emptyDesc: {
    marginTop: height * 6,
    fontSize: 12,
    color: "#6F8B7A",
  },
});
