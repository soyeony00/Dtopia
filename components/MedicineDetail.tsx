import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { height, width } from "@/globalDimension";
import { SearchCard } from "@/components/shared/SearchCard";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
const item = require("@/assets/images/item.png");
const item1 = require("@/assets/images/item1.png");
const item2 = require("@/assets/images/item2.png");
const item3 = require("@/assets/images/item3.png");
const item4 = require("@/assets/images/item4.png");

export default function HopitalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const services = [
    {
      icon: item,
      title: "아이메딘 10정",
      subTitle: `포도상구균에 의한 농피증,\n결막염`,
      description: `다음 환축에는 투여하지 말 것.\n본제 및 macrolide계 항생제에 대한 쇼크와 \n괴민반응이 있었던 동물에는 사용하지 말 것`,
      company: "이엘티사이언스",
    },
    {
      icon: item1,
      title: "티어가드 100정",
      subTitle: `포도상구균에 의한 농피증,\n결막염의 치료`,
      description: `다음 환축에는 투여하지 말 것.\n본제 및 macrolide계 항생제에 대한 쇼크와 \n괴민반응이 있었던 동물에는 사용하지 말 것`,
      company: "이엘티사이언스",
    },
    {
      icon: item2,
      title: "마보클린 겔",
      subTitle: `마보플록사신에 감수성이 있는 세균 및 진균에 의한 외이도염의 치료`,
      description: `본 약품은 GMP 시설에서 위생적으로 제조되며 엄격한 품질관리를 필한 제품입니다. 만일 구입시 유효기한이 경과되었거나 변질된 제품은 구입처를 통해 교환해 드립니다.`,
      company: "이엘티사이언스",
    },
    {
      icon: item3,
      title: "브레비콕스",
      subTitle: `개에서 공관절염과 관련한 염증의 치료 및 통증경감에 사용한다. 개에서 연부조직, 정형외과수술 및 치과수술과 관련한 수술 후 통증경감에 사용한다.`,
      description: "사용설명서 참조",
      company: "Ashish Life Science Pvt Limited",
    },
    {
      icon: item4,
      title: "프레비콕스",
      subTitle: `개에서 골관절염과 관련한 염증의 치료 및 통증경감에 사용한다.\n개에서 연부조직, 정형외과수술 및 치과수술과 관련한 수술 후 통증경감에 사용한다.`,
      description: `1.임신 또는 수유 중에 사용하지 말 것.\n2.10주령 미만 또는 3kg 미만의 개에는 투여하지 말 것.\n3.위장관계 출혈 또는 출혈성 및 혈액학적 이상을 가지고 있는 개체에 사용하지 말 것.\n4.코티코스테로이드 또는 다른 비스테로이드성 소염제와 병용투여시, 위장관계에 궤양을 유발할 수 있으므로 병`,
      company: "MERIAL",
    },
  ];
  return (
    <SafeAreaProvider>
      <View style={{ height: insets.top }} className="bg-primary">
        <StatusBar barStyle="default" />
      </View>
      <View
        className="bg-primary rounded-b-primary"
        style={styles.searchBarView}
      >
        <View
          style={{
            position: "absolute",
            bottom: height * 34,
            left: width * 46,
            zIndex: 2,
          }}
        >
          <Image
            width={width * 16}
            height={width * 16}
            source={require("@/assets/images/search_w.png")}
          />
        </View>
        <TextInput
          style={styles.searchBarInput}
          placeholder="의약품에 대해 검색해 보세요"
          multiline
        />
      </View>
      <View
        style={{ paddingHorizontal: width * 30, paddingVertical: height * 20 }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: width * 15,
            flexWrap: "wrap",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {services.map((item, index) => (
            <SearchCard
              key={index}
              source={item.icon}
              title={item.title}
              subTitle={item.subTitle}
              onClick={() => {
                console.log(item.title, "item");

                router.push({
                  pathname: "/searchDetail",
                  params: {
                    data: item.title,
                    index: index,
                    company: item.company,
                    description: item.description,
                    subTitle: item.subTitle,
                  },
                });
              }}
            />
          ))}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  searchBarView: {
    paddingHorizontal: width * 32,
    paddingVertical: height * 22,
    flexDirection: "row",
    position: "relative",
  },
  searchBarInput: {
    borderWidth: width * 1,
    backgroundColor: "white",
    borderRadius: width * 15,
    paddingVertical: height * 9,
    paddingHorizontal: width * 35,
    flex: 1,
  },
});
