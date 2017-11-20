var admin = require("firebase-admin");
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

exports.sendNewMessageNotification = functions.database
    .ref('conversations/{userId}/{conversationId}')
    .onWrite(event => {

        var userId = event.params.userId;
        var conversationId = event.pararms.conversationId;
        // console.log('event data:'.concat(event.data.val()));
        // const conversation = event.data.val();
        // const lastMessageType = conversation.lastMessageType;
        // const sender = conversation.user1;
        // const sr1 = 'New message from ';
        // const notificationTitle = sr1.concat(sender);
        // const notificationBody = conversation.lastMessage
        //
        // console.log('last message type is: '.concat(lastMessageType));

        // if (lastMessageType === "received") {
        //     console.log("last message was received");
        //     const deviceRefreshTokens = admin.database.ref('RefreshTokens/${userId}')
        //         .once('value');
        //
        //     console.log('refresh tokens: '.concat(deviceRefreshTokens));
        //
        //     const payload = {
        //         notification: {
        //             title: notificationTitle,
        //             body: notificationBody
        //         }
        //     }
        //
        //     return admin.messaging().sendToDevice(deviceRefreshTokens, payload);
        // }
});