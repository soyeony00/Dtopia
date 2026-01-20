import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

/* ================== Main Screen ================== */

export default function PetScreen() {
  const navigation = useNavigation();

  const handleComprehensiveInspection = () => {
    navigation.navigate("ComprehensiveDetail");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Hero ===== */}
        <View style={[styles.heroCard, styles.heroShadow]}>
          <LinearGradient
            colors={["#DFF4C8", "#F5FFE9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBorder}
          >
            <View style={styles.heroInner}>
              <Text style={styles.heroEyebrow}>WELLNESS</Text>
              <Text style={styles.heroTitle} numberOfLines={2}>
                종합 건강 체크
              </Text>
              <Text style={styles.heroDesc} numberOfLines={2}>
                실시간 심박수 및 체온을 기반으로 한 반려견 종합 리포트
              </Text>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleComprehensiveInspection}
                style={styles.heroBtn}
              >
                <Text style={styles.heroBtnText}>검사 시작</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* ===== Self-check Section ===== */}
        <SectionHeader
          title="스마트 질환검사"
          subtitle="AI 기반 질환검사"
        />

        <View style={styles.rowWrap}>
          <HalfTile
            title="안구질환 검사"
            subtitle="눈물/충혈/이물감"
            icon="eye-outline"
            tint="#E6F0FF"
            iconColor="#3A6FF7"
            onPress={() => navigation.navigate("EyeGuide")}
          />
          <HalfTile
            title="피부질환 검사"
            subtitle="발진/탈모/가려움"
            icon="texture-box"
            tint="#FFF1E6"
            iconColor="#E67E22"
            onPress={() => navigation.navigate("SkinGuide")}
          />
        </View>

        {/* ===== Live monitors ===== */}
        <SectionHeader
          title="실시간 측정"
          subtitle="심장 박동, 체온, 소리 패턴을 확인하세요."
        />

        <FullTile
          title="심장박동 체크"
          subtitle="안정·활동 시 비교"
          icon="heart-pulse"
          tint="#FFE6E6"
          iconColor="#E63946"
          onPress={() =>
            Alert.alert("심장박동", "심장박동 체크 화면으로 이동합니다.")
          }
        />
        <FullTile
          title="체온 체크"
          subtitle="정상 37–39°C"
          icon="thermometer"
          tint="#E6F0FF"
          iconColor="#457B9D"
          onPress={() => Alert.alert("체온", "체온 체크 화면으로 이동합니다.")}
        />
        <FullTile
          title="소리 인식"
          subtitle="짖음/낑낑거림 감지"
          icon="volume-high"
          tint="#E6FFE6"
          iconColor="#2A9D8F"
          onPress={() =>
            Alert.alert("소리 인식", "소리 인식 화면으로 이동합니다.")
          }
        />

        {/* ===== Tip ===== */}
        <View style={[styles.tipCard, shadow(1)]}>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}
          >
            <Icon
              name="lightbulb-on-outline"
              size={18}
              color="#F4A261"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.tipTitle}>작은 변화도 기록하세요</Text>
          </View>
          <Text style={styles.tipDesc}>
            식욕·활동량·수면 패턴의 변화는 건강 신호일 수 있어요. 이상을 느끼면
            자가검사 후 수의사 상담을 권장합니다.
          </Text>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================== Sub Components ================== */

function SectionHeader({ title, subtitle }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  );
}

function IconCapsule({ name, bgColor = "#F0F2F0", color = "#184A2C" }) {
  return (
    <View style={[styles.iconCapsule, { backgroundColor: bgColor }]}>
      <Icon name={name} size={20} color={color} />
    </View>
  );
}

function HalfTile({ title, subtitle, onPress, icon, tint, iconColor }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.halfTile, shadow(2)]}
    >
      <View style={styles.tileInner}>
        <IconCapsule name={icon} bgColor={tint} color={iconColor} />
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.tileTitle}>
            {title}
          </Text>
          <Text numberOfLines={1} style={styles.tileSubtitle}>
            {subtitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FullTile({ title, subtitle, onPress, icon, tint, iconColor }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.fullTile, shadow(2)]}
    >
      <IconCapsule name={icon} bgColor={tint} color={iconColor} />
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={styles.tileTitle}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.tileSubtitle}>
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

/* ================== Styles ================== */

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

const CARD_R = 14;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF7",
  },
  scrollContainer: {
    paddingBottom: 12,
  },

  /* Hero */
  heroCard: {
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  heroShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  heroBorder: {
    borderRadius: 20,
    padding: 1.2,
  },
  heroInner: {
    borderRadius: 18,
    backgroundColor: "#F7FFF1",
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6FA66D",
    letterSpacing: 1.2,
  },
  heroTitle: {
    marginTop: 6,
    fontSize: 21,
    fontWeight: "800",
    color: "#1F3326",
  },
  heroDesc: {
    marginTop: 6,
    fontSize: 13,
    color: "#54705E",
  },
  heroBtn: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: "#184A2C",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  heroBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  /* Section */
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#263238",
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7A89",
  },

  /* Row */
  rowWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  /* Tiles */
  halfTile: {
    flexBasis: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: CARD_R,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  tileInner: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  iconCapsule: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E3A2A",
  },
  tileSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: "#567A68",
  },

  fullTile: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: CARD_R,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  /* Tip */
  tipCard: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: CARD_R,
    padding: 14,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#184A2C",
  },
  tipDesc: {
    marginTop: 6,
    fontSize: 12,
    color: "#567A68",
    lineHeight: 18,
  },
});
