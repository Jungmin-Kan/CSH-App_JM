/**
 * @title expo-server-sdk-node
 * @see https://github.com/expo/expo-server-sdk-node
 */

const express = require('express');
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

const router = express.Router();
router.use(express.json());

/**
 * @description 계정 풀 
 * @type {Array.<object>}
 */
let savedPushTokensRestaurant = [];

/** 
 * @description 메시지 풀
 * @type {Array.<object>}
 */
let notifications = [];

/**
 * 단말기 식별값 등록
 * @param {*} token 단말기 토큰
 * @param {*} id  단말기 접속 id
 * @returns {void}
 */
const saveToken = (type, token, id) => {
    if (savedPushTokensRestaurant.indexOf(token === -1)) {
        savedPushTokensRestaurant.push({ token: token, id: id });
    }
}

/**
 * @description 메시지 생성기
 * @param {string} target 메시지 대상
 * @param {string} message 전달하려는 메시지
 */
const handlePushTokens = (target = '', message = 'test broadcasting') => {
    if (target) {
        for (let pushToken of savedPushTokensRestaurant) {
            if(pushToken.id == target){
                if (!Expo.isExpoPushToken(pushToken.token)) {
                    console.error(`Push token ${pushToken} is not a valid Expo push token`);
                    continue;
                }
                notifications.push({
                    to: pushToken.token,
                    sound: 'default',
                    title: `${pushToken.id}님!`,
                    body: message,
                    data: { message }
                })
            }
        }
    } else {
        for (let pushToken of savedPushTokensRestaurant) {
            if (!Expo.isExpoPushToken(pushToken.token)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                continue;
            }
            notifications.push({
                to: pushToken.token,
                sound: 'default',
                title: `${pushToken.id}님!`,
                body: message,
                data: { message }
            })
        }
    }
}

/**
 * 다말기 명단
 */
router.get('/list', (req, res) => {
    res.json(savedPushTokensRestaurant);
});

/**
 * 단말기 접속 했을 경우 메시징 서버에 단말기 등록
 */
router.post('/', async (req, res) => {
    saveToken(req.body.token, req.body.id);
    console.log(`Received push token, ${req.body}`);
    res.send(`Received push token, ${req.body}`);
});


/**
 * 앱 스크린 별 메시지 요청
 */
router.post('/message', async(req, res) => {
    handlePushTokens(req.body.id, req.body.message);
    let chunks = expo.chunkPushNotifications(notifications);
    for (let chunk of chunks) {
        try {
            console.log(chunk);
            let receipts = await expo.sendPushNotificationsAsync(chunk);
            console.log(receipts);
        } catch (error) {
            console.error(error);
        }
    }
    setTimeout(() => {
        notifications.splice(0);
        console.log(`Received message, ${req.body}`);
        res.send(`Received message, ${req.body}`);
    }, 1000);
});

module.exports = router;