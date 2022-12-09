const TEST_ENDPOINT = `http://cshserver.ga:8000/`;
const NOTIFICATION = `http://35.197.47.43:3001/Restaurant`;

export const SUCCESS = `success`;
export const FAIL = `fail`;


/** Notification */
/**
 * 푸쉬알링용 토큰 등록
 * @param {*} token 
 * @returns {Promise}
 */
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
 * @description '메시지 요청 api'
 * @param {object} value 
 * @param {string} message 
 * @returns {Promise}
 */
export const requestMessage = (value, message) => {
  return fetch(NOTIFICATION, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: value.token,
      id: value.id,
      message: message
    }),
  }).then((response) => response.text());

}


export const restPush = () => {
  return fetch(`${TEST_ENDPOINT}rest-push`)
    .then((response) => response.json())
    .then((data) => data);
}

/** API */
export const getInventory = (value) => {
  return fetch(`${TEST_ENDPOINT}get_inventory`, {
    method: 'GET',
    body: JSON.stringify(value),
  }).then((response) => response.json());
}

/**
 * **POST** /enroll_inventory  (재고 등록 , 직접 등록 + 바코드 등록을 포함함)
 * @param {*} value 
 * @returns 
 */
export const enrollInventory = (value) => {
  console.log(JSON.stringify(value))
  return fetch(`${TEST_ENDPOINT}enroll_inventory`, {
    method: 'POST',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  }).then((response) => response.json());
}




/**
 * @see https://stackoverflow.com/questions/44552073/upload-video-in-react-native
 * @description 비디오파일 전송(원격 검사 데이터)
 * @param {obejct} video 
 * @returns {Promise}
 */
export const sendVideo = (video,id = 2) => {

  let formData = new FormData();
  formData.append("video_file", {
    name: "name.mp4",  // 메뉴얼번호_검사날짜_사용자아이디
    uri: video.uri,
    type: 'video/mp4' // mime/type
  });
  console.log(video);
  return fetch(`${TEST_ENDPOINT}rest-fileUpload?restaurant_id=${id}`, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

// export const sendVideo = (video) => {
//   let formData = new FormData();
//   formData.append("videoFile", {
//     name: "name.mp4",  // 메뉴얼번호_검사날짜_사용자아이디
//     uri: video.uri,
//     type: 'video/quicktime' // mime/type
//   });
//   return fetch(`http://192.168.1.187:3001/File/`, {
//     method: 'POST',
//     body: formData,
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'multipart/form-data',
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => data);
// }



// http://192.168.0.66:8000/
// cshserver.ga:8000
export const restLogin = (value) =>{
  return fetch(`${TEST_ENDPOINT}rest-login`, {
    method: 'POST',
    body: JSON.stringify(value),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export const restSignup = (value) =>{
  return fetch(`${TEST_ENDPOINT}rest-signup`, {
    method: 'POST',
    body: JSON.stringify(value),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}