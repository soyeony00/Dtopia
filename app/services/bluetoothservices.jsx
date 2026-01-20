// services/BluetoothService.js
import { BleManager } from 'react-native-ble-plx';

class BluetoothService {
  static instance = null;

  static getInstance() {
    if (!BluetoothService.instance) {
      BluetoothService.instance = new BluetoothService();
    }
    return BluetoothService.instance;
  }

  constructor() {
    this.manager = new BleManager();
    this.listeners = [];
    this.devices = [];
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter((cb) => cb !== callback);
  }

  notifyListeners() {
    for (const cb of this.listeners) {
      cb(this.devices);
    }
  }

  async startScan() {
    this.devices = [];
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('스캔 에러:', error);
        return;
      }
      if (device && device.name && !this.devices.find(d => d.id === device.id)) {
        this.devices.push(device);
        this.notifyListeners();
      }
    });
  }

  stopScan() {
    this.manager.stopDeviceScan();
  }

  async connectToDevice(device) {
    try {
      const connected = await this.manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();
      return connected;
    } catch (err) {
      console.error('연결 실패:', err);
      return null;
    }
  }

  async disconnectDevice() {
    const connectedDevices = await this.manager.connectedDevices([]);
    for (const dev of connectedDevices) {
      try {
        await dev.cancelConnection();
      } catch (e) {
        console.error('연결 해제 실패:', e);
      }
    }
  }
}

export default BluetoothService;
