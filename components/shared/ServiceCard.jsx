import {
  View,
  Image,
  Text,
  Pressable,
  Platform,
  StyleSheet,
} from "react-native";

export const ServiceCard = ({
  source,
  title,
  subTitle,
  buttonTitle,
  onClick,
  shadowColor = "#A8DF8E",
  buttonColor = "#F3FDE8", // ✅ 기본값 초록
  borderColor = "#A8DF8E", // ✅ 테두리색도 받기
}) => {
  return (
    <View
      style={[
        styles.card,
        {
          shadowColor: shadowColor,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.8,
          shadowRadius: 24,
        },
      ]}
    >
      <View style={styles.inner}>
        <Image source={source} style={styles.icon} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subTitleText}>{subTitle}</Text>
        </View>
        <Pressable
          onPress={onClick}
          style={[
            styles.button,
            {
              backgroundColor: buttonColor,
              borderColor: borderColor,
            },
          ]}
        >
          <Text style={styles.buttonText}>{buttonTitle}</Text>
        </Pressable>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
  },
  inner: {
    width: "100%",
    alignItems: "center",
  },
  icon: {
    width: 75,
    height: 75,
    marginBottom: 15,
  },
  textContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#A8DF8E",
    textAlign: "center",
    marginBottom: 5,
  },
  subTitleText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  button: {
    borderWidth: 2,
    borderColor: "#A8DF8E",
    backgroundColor: "#F3FDE8",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
});
