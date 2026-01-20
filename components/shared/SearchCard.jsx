import {
  View,
  Image,
  Text,
  Pressable,
  ImageSourcePropType,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import { height, width } from "../../globalDimension";

export const SearchCard = ({ source, title, subTitle, onClick }) => {
  return (
    <Pressable onPress={onClick}>
      <View style={styles.box} className="bg-white rounded-primary shadow-md">
        <View className="items-center ">
          <Image
            className=""
            style={{ width: width * 80, height: width * 80 }}
            source={source}
          />
          <View className="">
            <Text style={{ fontSize: width * 12, marginTop: height * 10 }}>
              <Text className="text-base font-bold">{title}</Text>
            </Text>
            <Text
              style={{ fontSize: width * 10 }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {subTitle}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box: {
    ...(Platform.OS === "android" && {
      elevation: 20,
      shadowColor: "rgba(0, 0, 0, 0.40)",
    }),
    width: width * 154,
    paddingHorizontal: width * 24,
    paddingVertical: height * 20,
    flexDirection: "row",
    marginBottom: height * 15, //플랙스 갭 + 나머지 입니다
  },
});
