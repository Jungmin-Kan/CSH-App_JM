<h1>청신한 프로젝트</h1>

식중독 예방을 위한 식품 안전 관리 플랫폼



## 📚 Frontend

<p>청신한 일반 사용자 앱</p>

- 모범 음식점 리스트
  - 모범음식점 네비게이터

- 식중동 위험알리미 지도
  - 지역별 식중독 지수, 식재료 정보  


### Structures

```text
app/
├─ api
├─ assets
├─ dummy (사용안함)
│  └─ index.js
├─ navigator
├─ screen
│  └─ userChild
│  │  └─PoisonMap.js
│  │  RestaurantList.js
│  └─ HomeScreen.js
│  └─ UserMainScreen.js
├─ store
├─ App.js
├─ app.json
├─ babel.config.js
.
.
.
```

### INSTALL

```
npm install && npm start
// or
yarn && yarn start
// or
expo install
```

### Running the project

Running the project is as simple as running

```sh
expo start start
```

## 필수 수정사항

react-native-speedometer 모듈 하위 파일  Speedometer 객체 아래와 같이 수정할 것.

대상파일

- react-native-speedometer.cjs.js
- react-native-speedometer.esm.js
- react-native-speedometer.js

```jsx
Speedometer.defaultProps = {
  defaultValue: 50,
  minValue: 0,
  maxValue: 100,
  easeDuration: 500,
  allowedDecimals: 0,
  labels: [{
    name: '관심',
        labelColor: '#00ff6b',
            activeBarColor: '#00ff6b'
},
{
    name: '주의',
        labelColor: '#14eb6e',
            activeBarColor: '#14eb6e'
},
{
    name: '경고',
        labelColor: '#f4ab44',
            activeBarColor: '#f4ab44'
},
{
    name: '위험',
        labelColor: '#ff2900',
            activeBarColor: '#ff2900'
}],
  needleImage: require('../images/speedometer-needle.png'),
  wrapperStyle: {},
  outerCircleStyle: {},
  halfCircleStyle: {},
  imageWrapperStyle: {},
  imageStyle: {},
  innerCircleStyle: {},
  labelWrapperStyle: {},
  labelStyle: {},
  labelNoteStyle: {},
  useNativeDriver: true
};
```



## 📚 NotificationServer

<p>청신한 푸쉬 알림 서버</p>

- 접속 단말기 위치기반 식중독 위험지수 푸쉬 제공

- 기타 알림 제공 예정...

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
# or
yarn install
yarn dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.


## 📚 front-restaurant

<p>청신한 업소용 앱</p>

- 자재관리 시스템 제공

- 비대면 검사 제공

- 기관 광지 대쉬보드 


### INSTALL

```
npm install && npm start
// or
yarn && yarn start
// or
expo install
```

### Running the project

Running the project is as simple as running

```sh
expo start start
```
