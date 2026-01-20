import React from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TipScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>촬영 팁</Text>

      <View style={styles.exampleContainer}>
        <Text style={styles.label}>✅ 올바른 예</Text>
        <Image source={require('../../assets/images/dog.png')} style={styles.image} />
      </View>

      <View style={styles.exampleContainer}>
        <Text style={styles.label}>❌ 잘못된 예</Text>
        <Image source={require('../../assets/images/dog.png')} style={styles.image} />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Login')}>
        <Text style={styles.buttonText}>촬영 시작</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  exampleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#A8DF8E',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
