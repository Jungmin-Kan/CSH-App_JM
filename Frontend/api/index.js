const IP = 'http://172.26.126.163';
const PORT = ':3000';

const NOTIFICATION = `http://35.197.47.43:3001/User`;

export const userPush = () => {
  return fetch(`http://cshserver.ga:8000/user-push`)
    .then((response) => response.json())
    .then((data) => data);
}

export const registerToken = (token, id) => {
  return fetch(NOTIFICATION, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token,
      id: id
    }),
  }).then((response) => response.text());
}

/**
 * 모범식당 데이터 호출 함수
 * @param {String} setLoc
 * @param {Array} setList
 * @returns 
 *  */
export const storeList = (setLoc, setFilteredDataSource, setMasterDataSource) => {
  let _array = [];
  fetch(`http://cshserver.ga:8000/store_list`, {
    method: 'POST',
    headers: { "Content-Type" : "application/json"},
    body: JSON.stringify({ "location": setLoc }),
    redirect: 'follow'
  })
  .then(response => response.json())
  .then(data => {
    for (const property in data) { _array.push({ title: property, address: data[property] })}
    setFilteredDataSource(_array);
    setMasterDataSource(_array);
  })
  .catch(error => console.log('error', error));

}


/**
 * 하위 행정구역 식중독 지수 요청
 * @param {String} sendLocation
 * @param {Array} setChildList
 * @returns 
 *  */
export const fetchCildCity = (sendLocation, setChildList) => {
  console.log(sendLocation);
  let _array = [];
  let _count = 0;
  let CHILD_CITY = `http://cshserver.ga:8000/fpsiren?userCityName=${sendLocation}&day=today`;
  fetch(CHILD_CITY)
    .then((response) => response.json())
    .then((data) => {
      for (const [key, value] of Object.entries(data)) {
        console.log(`${key}: ${value}`);
        _array.push({
          id: _count,
          title: key,
          jisu: value
        })
        _count++;
      }
      setChildList(_array);
    });
}
/**
 * 사용자 위치 기반 게이지 데이터 요청
 * @param {String} geo
 * @param {Int} setGage
 * @param {String} day
 * @param {setVirus} setVirus
 * */
export const fetchMapGaguer = (geo, setGage, day, setVirus = '', setWarningFood) => {
  // "tomorrow","afterTomorrow"
  //  {fp_score : 12, fp_bst_virus: '',danger_food_lst: []}
  geo = '서울시';
  let GAGERURL = `http://cshserver.ga:8000/fpsirenMy?userCityName=${geo}&day=${day}`;
  fetch(GAGERURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.fp_score);
      console.log(data);
      setGage(data.fp_score);
      setVirus(data.fp_bst_virus);
      // setWarningFood(data.danger_food_lst);
      setWarningFood(['helloworld', 'byeworld']);
    });
}

/**
 * Big city average score
 */
export const fetchBigCity = () => {
  // return fetch(ALL_VALUE_BIGCITY)
  // .then((response) => response.json())
  // .then((data) => data);

  return {
    "강원도": 79,
    "경기도": 70,
    "경상남도": 60,
    "경상북도": 70,
    "광주시": 67,
    "대구시": 73,
    "대전시": 59,
    "부산시": 72,
    "서울시": 59,
    "세종시": 66,
    "울산시": 68,
    "인천시": 71,
    "전라남도": 65,
    "전라북도": 65,
    "제주도": 54,
    "충청남도": 69,
    "충청북도": 61,
  };
}


// export const findImgApi = (title, setImg) => {
//   fetch("https://www.mangoplate.com/search/%EB%AC%B4%EB%B4%89%EB%A6%AC%ED%86%A0%EC%A2%85%EC%88%9C%EB%8C%80%EA%B5%AD", {
//     "headers": {
//       "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//       "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
//       "cache-control": "max-age=0",
//       "if-none-match": "W/\"5b4070dfa8b24bfb567234794563264b\"",
//       "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
//       "sec-ch-ua-mobile": "?0",
//       "sec-ch-ua-platform": "\"macOS\"",
//       "sec-fetch-dest": "document",
//       "sec-fetch-mode": "navigate",
//       "sec-fetch-site": "same-origin",
//       "sec-fetch-user": "?1",
//       "upgrade-insecure-requests": "1"
//     },
//     "referrer": "https://www.mangoplate.com/",
//     "referrerPolicy": "strict-origin-when-cross-origin",
//     "body": null,
//     "method": "GET",
//     "mode": "cors",
//     "credentials": "include"
//   }).then((response) => response.text())
//     .then(data => {
//       console.log(data);

//     }).catch(e => console.log(e));
// }