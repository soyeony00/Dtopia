import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BluetoothProvider } from "./app/bluetoothContext"; // 블루투스 Context
import Tabs from './app/(tabs)/_layout';

import AlarmDetailScreen from './app/alarmdetail/index';
import ChangePasswordScreen from './app/changepassword/index';
import HospitalDetailScreen from './app/hospitaldetail/index';
import HospitalMap from './app/hospitaldetail/hospitalMap';
import HospitalSearchScreen from './app/hospitalsearch/index';
import MedicineDetailScreen from './app/medicinedetail/index';
import PetDetailScreen from './app/petdetail/index';
import ProfileDetailScreen from './app/profiledetail/index';
import PushDetailScreen from './app/pushdetail/index';
import QuestionScreen from './app/question/index';
import SearchDetailScreen from './app/searchdetail/index';
import EyeDetectionScreen from './app/eyedetection/index';
import EyeGuideScreen from './app/eyedetection/eyeguide';
import BluetoothScreen from "./app/bluetooth/bluetoothscreen";
import ProfileScreen from './app/(tabs)/profile';
import TipScreen from './app/tip/index';
import ProductDetailScreen from './app/productdetail/index';
import BreedSelect from "./app/petdetail/BreedSelect";
import LoginScreen from './app/index';
import SignupScreen from './app/signup';
import ComprehensiveInspectionScreen from './app/comprehensivedetail';

// 🔽 피부질환 검사 기능 추가
import SkinGuideScreen from './app/skindetection/skinguidescreen';
import SkinDetectionScreen from './app/skindetection/index';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <BluetoothProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          {/* 로그인/회원가입 */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />

          {/* 메인 탭 */}
          <Stack.Screen name="Tabs" component={Tabs} />

          {/* 상세 페이지 */}
          <Stack.Screen name="AlarmDetail" component={AlarmDetailScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="HospitalDetail" component={HospitalDetailScreen} />
          <Stack.Screen name="HospitalMap" component={HospitalMap} />
          <Stack.Screen name="HospitalSearch" component={HospitalSearchScreen} />
          <Stack.Screen name="MedicineDetail" component={MedicineDetailScreen} />
          <Stack.Screen name="PetDetail" component={PetDetailScreen} />
          <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
          <Stack.Screen name="PushDetail" component={PushDetailScreen} />
          <Stack.Screen name="Question" component={QuestionScreen} />
          <Stack.Screen name="SearchDetail" component={SearchDetailScreen} />
          <Stack.Screen name="EyeDetection" component={EyeDetectionScreen} />
          <Stack.Screen name="EyeGuide" component={EyeGuideScreen} />
          <Stack.Screen name="Bluetooth" component={BluetoothScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Tip" component={TipScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="SkinGuide" component={SkinGuideScreen} />
          <Stack.Screen name="SkinDetection" component={SkinDetectionScreen} />
          <Stack.Screen name="ComprehensiveDetail" component={ComprehensiveInspectionScreen} />
          <Stack.Screen name="BreedSelect" component={BreedSelect} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </BluetoothProvider>
  );
}
