import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native";

// 이미지 매핑 (정적 require 방식)
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

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Image
          source={imageMap[product.id]}
          style={styles.productImage}
          resizeMode="contain"
        />
        <Text style={styles.productName}>{product["영양제명"]}</Text>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>제조사</Text>
          <Text style={styles.sectionText}>{product["브랜드"]}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>효능</Text>
          <Text style={styles.sectionText}>
            대상 연령: {product["대상 연령"]}{"\n"}
            대상 체형: {product["대상 체형"]}{"\n"}
            형태: {product["영양제 형태"]} / 크기: {product["크기"] || "-"}{"\n"}
            효능/목적: {product["효능/목적"]}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>성분</Text>
          <Text style={styles.sectionText}>{product["영양성분"]}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>주원료</Text>
          <Text style={styles.sectionText}>{product["주원료"]}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>원산지</Text>
          <Text style={styles.sectionText}>{product["원산지"]}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inner: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  productImage: {
    width: 160,
    height: 160,
    marginBottom: 10,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  section: {
    width: "100%",
    marginBottom: 20,
  },
  sectionLabel: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#6BCB77",
    color: "#2D6A4F",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});

export default ProductDetailScreen;