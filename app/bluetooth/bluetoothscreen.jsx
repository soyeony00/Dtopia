import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';
import { Buffer } from 'buffer';

const SERVICE_UUID = 'FFE0';
const CHARACTERISTIC_UUID = 'FFE1';

export default function BluetoothScreen() {
  const managerRef = useRef(new BleManager());
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);

  // 센서 값
  const [temperature, setTemperature] = useState(null);
  const [bpm, setBpm] = useState(null);

  // Android 권한 요청
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]);
    }
  };

  const addDevice = (device) => {
    if (!device || !device.id) return;
    setDevices((prevDevices) => {
      if (prevDevices.find((d) => d.id === device.id)) return prevDevices;
      return [...prevDevices, device];
    });
  };

  const startScan = () => {
    console.log('🔍 스캔 시작');
    setIsScanning(true);
    managerRef.current.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('스캔 에러:', error);
        return;
      }
      if (device?.name || device?.localName) {
        console.log('📡 발견:', device.name || '이름 없음', device.id);
        addDevice(device);
      }
    });

    setTimeout(() => {
      managerRef.current.stopDeviceScan();
      setIsScanning(false);
      console.log('⏹ 스캔 중지');
    }, 10000);
  };

  const connectToDevice = async (device) => {
    try {
      console.log('연결 시도:', device.name, device.id);
      const connected = await managerRef.current.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connected);

      // notify 구독
      connected.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error('Notify 에러:', error);
            return;
          }
          if (characteristic?.value) {
            const ascii = Buffer.from(characteristic.value, 'base64').toString('ascii').trim();
            console.log('📥 수신:', ascii);
            try {
              const obj = JSON.parse(ascii);
              if (obj.t !== undefined) setTemperature(obj.t);
              if (obj.b !== undefined) setBpm(obj.b);
            } catch (e) {
              console.warn('JSON 파싱 실패:', ascii);
            }
          }
        }
      );

      Alert.alert('연결 성공', `${device.name || '기기'}에 연결되었습니다.`);
    } catch (err) {
      console.error('연결 실패:', err);
      Alert.alert('연결 실패', err.message);
    }
  };

  useEffect(() => {
    requestPermissions();
    startScan();

    return () => {
      managerRef.current.stopDeviceScan();
      managerRef.current.destroy();
    };
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.deviceContainer}
      onPress={() => connectToDevice(item)}
    >
      <Text style={styles.deviceName}>{item.name || '이름 없는 기기'}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔵 HM-10 기기 검색</Text>

      <TouchableOpacity style={styles.scanButton} onPress={startScan}>
        <Text style={styles.scanButtonText}>{isScanning ? '스캔 중...' : '다시 검색'}</Text>
      </TouchableOpacity>

      {connectedDevice ? (
        <View style={styles.dataBox}>
          <Text style={styles.dataText}>🌡 체온: {temperature ?? '-'} °C</Text>
          <Text style={styles.dataText}>❤️ 심박수: {bpm ?? '-'} bpm</Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.noDeviceText}>검색된 기기가 없습니다.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  scanButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  scanButtonText: { color: 'white', fontWeight: 'bold' },
  noDeviceText: { textAlign: 'center', marginTop: 20, color: 'gray' },
  deviceContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  deviceName: { fontWeight: 'bold' },
  deviceId: { color: 'gray' },
  dataBox: { marginTop: 20, padding: 20, borderRadius: 10, backgroundColor: '#f2f2f2' },
  dataText: { fontSize: 18, marginBottom: 10 },
});
