import { Dimensions } from "react-native";

const basicDimensions = {
  height: 844,
  width: 390,
};
const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);
const width = Dimensions.get("window").width / basicDimensions.width;
const height = Dimensions.get("window").height / basicDimensions.height;

export { basicDimensions, screenWidth, screenHeight, width, height };
