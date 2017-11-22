const admin = require("firebase-admin");
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

exports.sendNewMessageNotification = functions.database
    .ref('conversations/{userId}/{conversationId}')
    .onWrite(event => {
        let userId = event.params.userId;
        let conversation = event.data.val();
        let lastMessageType = conversation.lastMessageType;
        let id = conversation.conversationId;
        let sender = conversation.user1;
        let sr1 = 'New message from ';
        let notificationTitle = sr1.concat(sender);
        let notificationBody = conversation.lastMessage;
        let payload = {
            notification: {
                title: notificationTitle,
                body: notificationBody,
                id: id
            }
        };
        let tokenStrings = [];
        let dbRefString = '/RefreshTokens/'.concat(userId);
        console.log(dbRefString);
        if (lastMessageType === "received") {
            return admin.database().ref(dbRefString).once('value', snapshot => {
                snapshot.forEach(child => {
                    tokenStrings.push(child.key);
                });
                console.log(tokenStrings);
                admin.messaging().sendToDevice(tokenStrings, payload).then(response => {
                    console.log("successfully sent ", payload, ": ", response);
                })
                    .catch(error => {
                        console.log("error sending message: ", error);
                    })
            });
        } else {
            return 0;
        }
    });