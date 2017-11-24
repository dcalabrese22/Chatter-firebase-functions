const admin = require("firebase-admin");
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

exports.sendNewMessageNotification = functions.database
    .ref('Notifications/{conversationId}/{pushId}')
    .onWrite(event => {
        console.log("starting send new message notification");
        let conversationId = event.params.conversationId;
        let pushId = event.params.pushId;
        let notificationData = event.data.val();
        let userId = notificationData.sentTo;
        let sender = notificationData.from;
        let body = notificationData.body;

        let sr1 = 'New message from ';
        let notificationTitle = sr1.concat(sender);
        let payload = {
            notification: {
                title: notificationTitle,
                body: body,
                id: conversationId
            }
        };
        let tokensArray = [];
        console.log(userId, payload);
        let getTokensArray = admin.database().ref('RefreshTokens').child(userId).once('value').then(snapshot => {
            snapshot.forEach(child => {
                tokensArray.push(child.key);
            });
            return Promise.all(tokensArray);
        });

        console.log(tokensArray);
        return admin.messaging().sendToDevice(tokensArray, payload).then(response => {
            response.results.forEach((result, index) => {
                const error = result.error;
                let tokensToRemove = [];
                if (error) {
                    console.error('Failure sending notification to ', tokensArray[index], error);

                    if (error.code === 'messaging/invalid-registration-token' ||
                    error.code === 'messaging/registration-token-not-registered') {
                        tokensToRemove.push(admin.database().ref('RefreshToken').child(userId)
                            .child(tokensArray[index]).remove());
                    }
                }
                return Promise.all(tokensToRemove)
            });
        })

    });