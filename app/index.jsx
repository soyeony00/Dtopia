import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [userlogin_id, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!userlogin_id || !password) {
      Alert.alert('Error', '아이디와 비밀번호를 입력해주세요.');
      return;
    }

    if (userlogin_id === 'dtopia' && password === 'dtopia') {
      await AsyncStorage.setItem('authToken', 'local-dev-token');
      await AsyncStorage.setItem('userId', userlogin_id);
      Alert.alert('Success', '로컬 로그인 성공!');
      navigation.replace("Tabs");
      return;
    }

    try {
      const response = await fetch('http://dtopia.jumpingcrab.com:5151/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userlogin_id, password }),
      });

      const data = await response.json();
      console.log('Response Status:', response.status);
      console.log('Response Data:', data);

      if (response.ok && data.access_token) {
        await AsyncStorage.setItem('authToken', data.access_token);
        await AsyncStorage.setItem('userId', userlogin_id);
        Alert.alert('Success', '로그인 성공!');
        navigation.replace('Tabs');
      } else {
        Alert.alert('Error', data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', '서버와의 통신 중 문제가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/images/dtopia_logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>로그인</Text>

      <TextInput
        style={styles.input}
        placeholder="아이디"
        placeholderTextColor="#969696"
        value={userlogin_id}
        onChangeText={setUserId}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        placeholderTextColor="#969696"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/find')}>
        <Text style={styles.forgotPassword}>아이디 / 비밀번호 찾기</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>회원가입</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#A8DF8E',
    borderWidth: 1.5,
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    color: '#969696',
  },
  button: {
    width: '50%',
    height: 50,
    backgroundColor: '#F3FDE8',
    borderColor: '#A8DF8E',
    borderWidth: 1.5,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  forgotPassword: {
    color: 'gray',
    fontSize: 14,
    marginTop: 10,
  },
  signupText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    textDecorationLine: 'underline',
  },
});
