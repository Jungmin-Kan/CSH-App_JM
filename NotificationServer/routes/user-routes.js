const express = require('express');
const { Expo } = require('expo-server-sdk');
const expo = new Expo();
let savedPushTokensUser = [];
const router = express.Router();
router.use(express.json());

const saveToken = (type, token) => { 
    console.log('일반 유저')
    if (savedPushTokensUser.indexOf(token === -1)) {
        savedPushTokensUser.push(token);
    }
}

router.post('/', (req, res) => {
    saveToken(false,req.body.token.value);
    console.log(`Received push token, ${req.body.token.value}`);
    let notifications = [];
    for (let pushToken of savedPushTokensUser) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }
        notifications.push({
            to: pushToken,
            sound: "default",
            title: req.body.token.value,
            body: '유저 토큰등록이 완료되었습니다.',
            data: {}
        });
    }

    let chunks = expo.chunkPushNotifications(notifications);

    (async () => {
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
    res.send(`Received push token, ${req.body.token.value}`);
});



router.get('/go', (req, res) => {
    
    let notifications = [];
    let pushToken;
    for (let x of savedPushTokensUser) {
        if (!Expo.isExpoPushToken(x)) {
            console.error(`Push token ${x} is not a valid Expo push token`);
            continue;
        }
        pushToken = x;
        notifications.push({
            to: x,
            sound: "default",
            title: pushToken + '님',
            body: '새로운 메시지.',
            data: {}
        });
    }

    let chunks = expo.chunkPushNotifications(notifications);

    (async () => {
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
    res.send(`유저 푸쉬 메시지 전송 ${pushToken}`);
});


router.post('/message', (req, res) => {
    handlePushTokens(req.body.message);
    console.log(`Received message, ${req.body.message}`);
    res.send(`Received message, ${req.body.message}`);
});


module.exports = router;