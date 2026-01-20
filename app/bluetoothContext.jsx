import React, { createContext, useState, useRef, useEffect } from "react";
import { BleManager } from "react-native-ble-plx";
import { Buffer } from "buffer";

export const BluetoothContext = createContext();

const SERVICE_UUID = "FFE0";
const SERVICE_UUID_FULL = "0000FFE0-0000-1000-8000-00805F9B34FB";
const CHARACTERISTIC_UUID = "FFE1";
const CHARACTERISTIC_UUID_FULL = "0000FFE1-0000-1000-8000-00805F9B34FB";

// 연결 대상 이름들
const TARGET_NAMES = ["PICO-BT", "HMSoft", "BT05", "JDY-08", "AT-09"];

export function BluetoothProvider({ children }) {
  const managerRef = useRef(new BleManager());
  const [btConnected, setBtConnected] = useState(false);
  const [bpm, setBpm] = useState(null);
  const [temp, setTemp] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const incomingBufferRef = useRef("");

  // 연결 시도 함수 (스캔 + 연결)
  const connect = async () => {
    const m = managerRef.current;
    if (!m) return;

    setConnecting(true);
    incomingBufferRef.current = "";

    m.startDeviceScan(null, null, async (error, device) => {
      if (error) {
        console.log("스캔 에러:", error);
        setConnecting(false);
        m.stopDeviceScan();
        return;
      }

      if (!device) return;
      const name = device.name || device.localName || "";
      const services = (device.serviceUUIDs || []).map((u) =>
        (u || "").toUpperCase()
      );

      const nameMatch = TARGET_NAMES.includes(name);
      const serviceMatch =
        services.includes(SERVICE_UUID) || services.includes(SERVICE_UUID_FULL);

      if (!(nameMatch || serviceMatch)) return;

      console.log("✅ 연결 후보 발견:", name, device.id);
      m.stopDeviceScan();

      try {
        try {
          await m.cancelDeviceConnection(device.id);
        } catch { }

        const connected = await m.connectToDevice(device.id);
        await connected.discoverAllServicesAndCharacteristics();

        connected.monitorCharacteristicForService(
          SERVICE_UUID_FULL,
          CHARACTERISTIC_UUID_FULL,
          (err, ch) => handleNotify(err, ch)
        );

        connected.monitorCharacteristicForService(
          SERVICE_UUID,
          CHARACTERISTIC_UUID,
          (err, ch) => handleNotify(err, ch)
        );

        setBtConnected(true);
        console.log("🔗 BLE 연결 성공:", name);
      } catch (e) {
        console.log("BLE 연결 실패:", e);
        setBtConnected(false);
      } finally {
        setConnecting(false);
      }
    });

    // 12초 타임아웃
    setTimeout(() => {
      try {
        m.stopDeviceScan();
      } catch { }
      setConnecting(false);
    }, 12000);
  };

  // Notify 처리
  const handleNotify = (err, ch) => {
    if (err) {
      console.log("Notify 에러:", err);
      return;
    }
    const base64 = ch?.value;
    if (!base64) return;

    try {
      const ascii = Buffer.from(base64, "base64").toString("ascii");
      incomingBufferRef.current += ascii;

      let idx;
      while ((idx = incomingBufferRef.current.indexOf("\n")) >= 0) {
        const line = incomingBufferRef.current.slice(0, idx).trim();
        incomingBufferRef.current = incomingBufferRef.current.slice(idx + 1);
        if (!line) continue;
        try {
          const obj = JSON.parse(line);
          if (typeof obj.b === "number") setBpm(Math.round(obj.b));
          if (typeof obj.t === "number") setTemp(parseFloat(obj.t.toFixed(1)));
        } catch { }
      }
    } catch (e) {
      console.log("Base64 decode error:", e);
    }
  };

  // 클린업
  useEffect(() => {
    return () => {
      try {
        managerRef.current?.stopDeviceScan();
        managerRef.current?.destroy();
      } catch { }
    };
  }, []);

  return (
    <BluetoothContext.Provider
      value={{
        btConnected,
        bpm,
        temp,
        connect,
        connecting,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
}
