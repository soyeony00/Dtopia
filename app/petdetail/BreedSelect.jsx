// app/petdetail/BreedSelect.jsx
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Platform,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { width, height } from "../../globalDimension";
import BackIcon from "../../assets/images/back.svg";

const CATS = ["소형견", "중형견", "대형견"];

/** ✅ 한국어 견종명 -> 이미지 정적 매핑
 *  경로 규칙: ../../assets/images/dog/<파일명>.jpg
 *  실제 파일명이 다르면 해당 줄의 파일명만 맞춰주세요 (대소문자/띄어쓰기/언더스코어 포함 정확히!).
 */ 

const BREED_IMAGES = {
  // === 소형/중형 쪽에서 쓰는 것들 ===
  "말티즈": require("../../assets/images/dog/Maltese.jpg"),
  "포메라니안": require("../../assets/images/dog/Pomeranian.jpg"),
  "치와와": require("../../assets/images/dog/Chihuahua.jpg"),
  "요크셔테리어": require("../../assets/images/dog/Yorkshire terrier.jpg"),

  // 아래 3개는 제공 파일에 정확 매칭이 없어 보이면 주석 해제/수정해서 사용
  // "비숑프리제": require("../../assets/images/dog/Bichon_Frise.jpg"),
  // "미니핀": require("../../assets/images/dog/Miniature_Pinscher.jpg"),
  // 시츄(Shih Tzu)로 추정되는 이미지가 "Chichu.jpg" 로 보임
  "시츄": require("../../assets/images/dog/Chichu.jpg"),

  "푸들(토이)": require("../../assets/images/dog/poodle1.jpg"),
  "닥스훈트(미니)": require("../../assets/images/dog/dachshund.jpg"),

  "코카스파니엘": require("../../assets/images/dog/English Cocker Spaniel.jpg"),
  "웰시코기": require("../../assets/images/dog/Welsh_corgi.jpg"),
  // "슈나우저": require("../../assets/images/dog/Schnauzer.jpg"),
  // "스피츠": require("../../assets/images/dog/Spitz.jpg"),
  "비글": require("../../assets/images/dog/Beagle.jpg"),
  "보스턴테리어": require("../../assets/images/dog/Boston_Terrier.jpg"),
  // "바셋하운드": require("../../assets/images/dog/Basset_Hound.jpg"),
  // 제공 목록에 French Bulldog은 없어서 임시로 잉글리시 불독 이미지에 매핑
  "불독(프렌치)": require("../../assets/images/dog/english-bulldog.jpg"),
  "사모예드(소형)": require("../../assets/images/dog/Samoyed_dog.jpg"),

  // === 대형 쪽 ===
  "리트리버(골든)": require("../../assets/images/dog/Golden Retriever.jpg"),
  // "리트리버(래브라도)": require("../../assets/images/dog/Labrador_Retriever.jpg"),
  // "알래스칸 말라뮤트": require("../../assets/images/dog/Alaskan_Malamute.jpg"),
  "허스키": require("../../assets/images/dog/Siberian Husky.jpg"),
  "저먼셰퍼드": require("../../assets/images/dog/German Shepherd.jpg"),
  "도베르만": require("../../assets/images/dog/Doberman Pinscher.jpg"),
  // "로트와일러": require("../../assets/images/dog/Rottweiler.jpg"),
  // "그레이트 피레니즈": require("../../assets/images/dog/Great_Pyrenees.jpg"),
  "사모예드": require("../../assets/images/dog/Samoyed_dog.jpg"),

  // === 제공 파일에 있는 한국 토종/기타 (필요시 사용) ===
  "진돗개": require("../../assets/images/dog/jindo_dog.jpg"),
  "풍산개": require("../../assets/images/dog/Poongsan_dog.jpg"),
  "삽살개": require("../../assets/images/dog/Sapsal_Dog.jpg"),

  // === 기타 파일들 (원하면 항목 확장해서 사용) ===
  "달마시안": require("../../assets/images/dog/dalmatian.jpg"),
  "그레이하운드": require("../../assets/images/dog/greyhound.jpg"),
  "보더콜리": require("../../assets/images/dog/border_collie.jpg"),
  "불 테리어": require("../../assets/images/dog/Bull_Terrier.jpg"),
  "복서": require("../../assets/images/dog/boxer.jpg"),
  "차우차우": require("../../assets/images/dog/Chow_Chow.jpg"),
  "퍼그": require("../../assets/images/dog/Pug.jpg"),
  "아메리칸 코커 스파니엘": require("../../assets/images/dog/American_Cocker Spaniel.jpg"),
  "잉글리시 코커 스파니엘": require("../../assets/images/dog/English Cocker Spaniel.jpg"),
};

const BREEDS = {
  소형견: [
    { key: "말티즈" }, { key: "포메라니안" }, { key: "치와와" },
    { key: "요크셔테리어" }, { key: "비숑프리제" }, { key: "미니핀" },
    { key: "시츄" }, { key: "푸들(토이)" }, { key: "닥스훈트(미니)" },
  ],
  중형견: [
    { key: "코카스파니엘" }, { key: "웰시코기" }, { key: "슈나우저" },
    { key: "스피츠" }, { key: "비글" }, { key: "보스턴테리어" },
    { key: "바셋하운드" }, { key: "불독(프렌치)" }, { key: "사모예드(소형)" },
  ],
  대형견: [
    { key: "리트리버(골든)" }, { key: "리트리버(래브라도)" }, { key: "알래스칸 말라뮤트" },
    { key: "허스키" }, { key: "저먼셰퍼드" }, { key: "도베르만" },
    { key: "로트와일러" }, { key: "그레이트 피레니즈" }, { key: "사모예드" },
  ],
};

const SHADOW = Platform.select({
  ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  android: { elevation: 3 },
});

const COLS = 3;
const H_PADDING = width * 16;
const GAP = 18;
const CELL_WIDTH = (width - H_PADDING * 2 - GAP * (COLS - 1)) / COLS;
const AVATAR = width * 80;

export default function BreedSelect() {
  const navigation = useNavigation();
  const route = useRoute();
  const currentBreed = route?.params?.currentBreed || "";
  const onSelect = route?.params?.onSelect;
  const [tab, setTab] = useState(
    CATS.includes(route?.params?.defaultCat) ? route.params.defaultCat : "소형견"
  );
  const [selected, setSelected] = useState(currentBreed || "");

  const data = useMemo(() => BREEDS[tab] ?? [], [tab]);

  const handleSave = () => {
    if (!selected) return;
    if (typeof onSelect === "function") onSelect(selected);
    navigation.goBack();
  };

  const renderItem = ({ item }) => {
    const isActive = selected === item.key;
    const src = BREED_IMAGES[item.key];
    return (
      <Pressable onPress={() => setSelected(item.key)} style={styles.item}>
        <View style={[styles.avatar, isActive && styles.avatarActive]}>
          {src ? (
            <Image source={src} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarEmoji}>🐶</Text>
          )}
        </View>
        <Text style={[styles.breedName, isActive && styles.breedNameActive]}>
          {item.key}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <BackIcon />
        </Pressable>
        <Text style={styles.headerTitle}>견종 선택</Text>
        <View style={{ width: width * 24 }} />
      </View>

      {/* 카테고리 탭 */}
      <View style={styles.tabs}>
        {CATS.map((c) => {
          const active = tab === c;
          return (
            <Pressable
              key={c}
              onPress={() => setTab(c)}
              style={[styles.tabBtn, active && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{c}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* 3열 그리드 */}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: H_PADDING, paddingBottom: height * 16 }}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: height * 12 }}
        data={data}
        keyExtractor={(it) => it.key}
        renderItem={renderItem}
        numColumns={COLS}
        showsVerticalScrollIndicator={false}
      />

      {/* 하단 저장 버튼 */}
      <View style={styles.footer}>
        <Pressable
          onPress={handleSave}
          disabled={!selected}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && { transform: [{ scale: 0.98 }] },
            !selected && { opacity: 0.5 },
          ]}
        >
          <Text style={styles.saveButtonText}>
            {selected ? `"${selected}" 선택 완료` : "견종을 선택해 주세요"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 20,
    marginTop: height * 10,
    marginBottom: height * 6,
  },
  backButton: { width: width * 24, height: width * 24, justifyContent: "center" },
  headerTitle: {
    flex: 1, textAlign: "center", fontSize: width * 16, fontWeight: "700", color: "#333",
  },

  tabs: {
    flexDirection: "row", justifyContent: "space-between",
    paddingHorizontal: H_PADDING, marginBottom: height * 12,
  },
  tabBtn: {
    flex: 1, height: 42, marginHorizontal: 6, borderRadius: 12,
    borderWidth: 1, borderColor: "#E6EBF0", alignItems: "center",
    justifyContent: "center", backgroundColor: "#F7F9FB", ...SHADOW,
  },
  tabBtnActive: { backgroundColor: "#A8DF8E", borderColor: "#8AD76F" },
  tabText: { color: "#5F6368", fontWeight: "700" },
  tabTextActive: { color: "#fff" },

  item: { width: CELL_WIDTH, alignItems: "center" },

  avatar: {
    width: width * 80, height: width * 80, borderRadius: (width * 80) / 2,
    backgroundColor: "#F1F5F9", alignItems: "center", justifyContent: "center",
    marginBottom: 8, borderWidth: 3, borderColor: "#E6EBF0", ...SHADOW,
  },
  avatarActive: { backgroundColor: "#ECFDF5", borderColor: "#6FCF97" },

  avatarImg: {
    width: width * 80 - 10, height: width * 80 - 10,
    borderRadius: (width * 80 - 10) / 2, resizeMode: "cover",
  },
  avatarEmoji: { fontSize: Math.floor(width * 80 * 0.45) },

  breedName: { fontSize: 14, color: "#333", textAlign: "center", fontWeight: "600" },
  breedNameActive: { color: "#2B8259", fontWeight: "800" },

  footer: {
    paddingHorizontal: H_PADDING, paddingTop: 4, paddingBottom: height * 16,
  },
  saveButton: {
    height: 56, borderRadius: 18, backgroundColor: "#6FCF97",
    alignItems: "center", justifyContent: "center", ...SHADOW,
  },
  saveButtonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});