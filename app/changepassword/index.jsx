import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import BackIcon from "../../assets/images/back.svg"; // 경로 수정

export default function ChangePasswordScreen() {
  const navigation = useNavigation(); // ✅ 수정
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setError("");
    Alert.alert("비밀번호 변경 완료", "새 비밀번호가 저장되었습니다.");
    navigation.goBack(); // ✅ 수정
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
              <BackIcon width={24} height={24} />
            </Pressable>
            <Text style={styles.headerText}>비밀번호 변경하기</Text>
          </View>

          {/* 본문 */}
          <View style={styles.content}>
            <Text style={styles.description}>비밀번호는 최소 8자 이상 적어주세요</Text>

            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="새 비밀번호"
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="새 비밀번호 확인"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* 저장 버튼 */}
          <View style={styles.buttonContainer}>
            <Pressable onPress={handleSave}>
              <View style={styles.saveButton}>
                <Text style={styles.saveButtonText}>저장하기</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    position: "absolute",
    left: 0,
    zIndex: 2,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  saveButton: {
    width: 120,
    height: 40,
    borderWidth: 1,
    borderColor: "#A8DF8E",
    borderRadius: 20,
    backgroundColor: "#F3FDE8",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 14,
    color: "#333",
  },
});
