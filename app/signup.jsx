import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

function SignupScreen({ navigation }) {
  const [userlogin_id, setUserLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleDuplicateCheck = async () => {
    try {
      const response = await fetch(
        'http://dtopia.jumpingcrab.com:5151/api/signup/isEmailValid/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      );

      const text = await response.text();
      const data = JSON.parse(text);

      if (data.isAvailable) {
        setIsEmailValid(true);
        Alert.alert('Success', '사용 가능한 이메일입니다.');
      } else {
        setIsEmailValid(false);
        Alert.alert('Error', '이미 사용 중인 이메일입니다.');
      }
    } catch (error) {
      console.error('Error communicating with the server:', error);
      Alert.alert('Error', '서버와의 통신 중 문제가 발생했습니다.');
    }
  };

  const handleSignup = async () => {
    if (
      !userlogin_id ||
      !email ||
      !name ||
      !password ||
      !confirmPassword ||
      !phone ||
      !address
    ) {
      Alert.alert('Error', '모든 필드를 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('http://dtopia.jumpingcrab.com:5151/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userlogin_id,
          email,
          name,
          password,
          phone,
          address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', '회원가입이 완료되었습니다.');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('Error', '서버와의 통신 중 문제가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Image
            source={require('../assets/images/dtopia_logo.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>회원가입</Text>

          <TextInput
            style={styles.input}
            placeholder="아이디"
            placeholderTextColor="#A8DF8E"
            value={userlogin_id}
            onChangeText={setUserLoginId}
          />

          <View style={styles.emailContainer}>
            <TextInput
              style={styles.emailInput}
              placeholder="이메일"
              placeholderTextColor="#A8DF8E"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity
              style={styles.duplicateCheckButton}
              onPress={handleDuplicateCheck}>
              <Text style={styles.duplicateCheckText}>중복확인</Text>
            </TouchableOpacity>
          </View>
          {isEmailValid === false && (
            <Text style={styles.errorText}>이미 사용 중인 이메일입니다.</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="이름"
            placeholderTextColor="#A8DF8E"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor="#A8DF8E"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호 재입력"
            placeholderTextColor="#A8DF8E"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {password !== confirmPassword && confirmPassword !== '' && (
            <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="전화번호"
            placeholderTextColor="#A8DF8E"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="주소"
            placeholderTextColor="#A8DF8E"
            value={address}
            onChangeText={setAddress}
          />

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>가입하기</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'NanumGothicCoding',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 15,
  },
  emailInput: {
    flex: 1,
    height: 50,
    borderColor: '#A8DF8E',
    borderWidth: 1.5,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginRight: 10,
    fontFamily: 'NanumGothicCoding',
    color: '#000',
  },
  duplicateCheckButton: {
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: '#F3FDE8',
    borderColor: '#A8DF8E',
    borderWidth: 1.5,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  duplicateCheckText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'NanumGothicCoding',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#A8DF8E',
    borderWidth: 1.5,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontFamily: 'NanumGothicCoding',
    color: '#000',
  },
  signupButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#F3FDE8',
    borderColor: '#A8DF8E',
    borderWidth: 1.5,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'NanumGothicCoding',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});

export default SignupScreen;
