import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";

import HomeScreen from "./index";         // 홈
import RecommendScreen from "./recommend"; // 제품추천
import PetsScreen from "./pets";           // 반려동물
import AroundScreen from "./around";       // 근처병원
import ProfileScreen from "./profile";     // 마이페이지

// 아이콘
import HomeIcon from "../../assets/images/home.svg";
import ProductIcon from "../../assets/images/product.svg";
import PetIcon from "../../assets/images/pets.svg";
import PlusIcon from "../../assets/images/plus.svg";
import ProfileIcon from "../../assets/images/profile.svg";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  const marginTop = Platform.OS === "ios" ? 7 : 2;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          marginTop: marginTop,
          fontSize: 10,
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => <HomeIcon width={30} height={30} />,
        }}
      />
      <Tab.Screen
        name="Recommend"
        component={RecommendScreen}
        options={{
          title: "제품추천",
          tabBarIcon: ({ color, size }) => <ProductIcon width={30} height={30} />,
        }}
      />
      <Tab.Screen
        name="Pets"
        component={PetsScreen}
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => <PetIcon width={70} height={70} />,
          tabBarItemStyle: {
            height: 70,
            width: 70,
            borderRadius: 70,
            transform: [{ translateY: -15 }],
            zIndex: 99,
          },
        }}
      />
      <Tab.Screen
        name="Around"
        component={AroundScreen}
        options={{
          title: "근처병원",
          tabBarIcon: ({ color, size }) => <PlusIcon width={30} height={30} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "마이페이지",
          tabBarIcon: ({ color, size }) => <ProfileIcon width={30} height={30} />,
          tabBarStyle: { display: "none" }, // 마이페이지에서는 바텀탭 숨김
        }}
      />
    </Tab.Navigator>
  );
}
