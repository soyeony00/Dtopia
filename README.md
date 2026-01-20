# 🐾 Dtopia
### Wearable-based Smart Pet Healthcare Platform

> **웨어러블 디바이스 + 모바일 앱 + AI 분석을 결합한  
반려동물 종합 건강 관리 시스템**

---

## 🔍 Overview

**Dtopia**는 반려동물의 생체 신호와 행동 데이터를 실시간으로 수집하고,  
AI 기반 분석을 통해 **질병 조기 발견 · 건강 리포트 · 맞춤형 케어**를 제공하는  
스마트 반려동물 헬스케어 플랫폼입니다.

반려동물은 아픔을 쉽게 드러내지 않는 특성으로 인해  
질병 발견이 늦어지는 경우가 많습니다.  
Dtopia는 이러한 문제를 해결하기 위해  
**웨어러블 디바이스 + 모바일 앱 + AI 진단**을 결합한  
데이터 기반 헬스케어 시스템을 설계·구현했습니다.

---

## 🧠 Key Features

### 📊 실시간 생체 데이터 모니터링
- 심박수, 체온, 소리(울음) 실시간 측정  
- Bluetooth / Wi-Fi 기반 데이터 수집  
- 모바일 앱에서 그래프 형태로 시각화  

### 🧬 AI 기반 질환 분석
- **안구 질환 진단 (3단계 AI 파이프라인)**
  - YOLOv8: 눈 영역 검출
  - EfficientNet-B0: 정상 / 비정상 판별
  - EfficientNet-B4: 5종 안구 질환 분류
- **이상 소리 감지**
  - Mel-Spectrogram + CNN 기반 음성 분류
  - 짖음(bark), 낑낑(moan), 기타(other)

### 📋 건강 리포트 & 알림
- 측정 데이터 기반 종합 건강 리포트 제공  
- 정상/이상 기준 초과 시 실시간 알림  
- 병원 방문 권고 및 기록 관리  

### 🛍️ AI 맞춤형 제품 추천
- 건강 상태·질환 결과 기반 사료/영양제 추천  
- 제품 상세 정보 제공 (효능, 성분, 주의사항)

### 🏥 병원 · 의약품 정보 제공
- 위치 기반 주변 동물병원 검색 (Kakao Map API)  
- 반려동물 의약품 검색 및 상세 정보 제공  

---

## 🏗 System Architecture

Wearable Device (Raspberry Pi / ESP32)
↓
Bluetooth / Wi-Fi / MQTT
↓
Flask API Server
↓
MongoDB (Health / AI / Product Data)
↓
React Native App (iOS / Android)


---

## 🛠 Tech Stack

### 📱 Frontend (App)
- React Native
- JavaScript
- Android Studio / Xcode / VS Code

### 🖥 Backend
- Flask (Python)
- MongoDB
- JWT Authentication
- Firebase, Twilio (알림)
- RESTful API (20+ endpoints)

### 🤖 AI / ML
- PyTorch
- YOLOv8
- EfficientNet (B0, B4)
- CNN (Audio Classification)
- librosa, torchvision, matplotlib

### 🔌 Hardware / IoT
- Raspberry Pi Pico WH
- ESP32
- Temperature Sensor (DS18B20)
- Heart Rate Sensor
- Microphone Sensor
- Bluetooth Module (HM-10)

---

## 👥 Team & Role

| Name | Role | Responsibility |
|---|---|---|
| **김소연** | **Team Lead / App Developer** | iOS 앱 개발, UI/UX 설계, 센서 데이터 시각화, API 연동 |
| 김도희 | App Developer | Android 앱 개발 |
| 백경준 | Hardware Engineer | 웨어러블 기기 제작, 센서 연동 |
| 손지호 | AI Engineer | 안구·소리 AI 모델 학습 및 개발 |
| 오준협 | Backend Engineer | 서버·DB 설계, API 개발, 배포 |

---

## ⏱ Development Period
- **2024.09.02 ~ 2025.06.11**
- 총 **9개월**
- **5인 팀 프로젝트 (졸업 연구)**

---

## 🎯 What We Achieved
- 웨어러블 기반 실시간 생체 데이터 수집 시스템 구현
- AI 기반 질환 진단 파이프라인 설계 및 실제 앱 연동
- 모바일 앱–서버–AI–하드웨어 **End-to-End 통합**
- 단순 모니터링을 넘어 **예방 중심 헬스케어 구조 구현**

---

## 📌 Future Work
- 전문 동물병원 연계 및 원격 진단 시스템 확장
- AI 모델 자동 재학습 파이프라인 구축
- 소형·저전력 디바이스로 하드웨어 개선
- 반려동물 종 다양화 및 장기 건강 데이터 분석

---

## 📎 Notes
- 본 프로젝트는 **팀 프로젝트**이며  
  해당 레포지토리는 **김소연 개인 포트폴리오 목적**으로 정리되었습니다.
- 상업적 목적이 아닌 **학술·연구 기반 프로젝트**입니다.

---

⭐ **If you’re interested,**  
이 프로젝트는 **IoT · 모바일 · AI · 백엔드가 유기적으로 결합된  
실제 서비스형 프로젝트**입니다.
