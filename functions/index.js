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

        return loadUserTokens(userId).then(tokens => {

            let payload = {
                data: {
                    title: notificationTitle,
                    body: body,
                    id: conversationId,
                    sound: 'default'
                }
            };

            return admin.messaging().sendToDevice(tokens, payload).then(response => {
                const tokensToRemove = [];
                response.results.forEach((result, index) => {
                    const error = result.error;
                    if (error) {
                        console.error('Failure sending notification to ', tokens[index], error);

                        if (error.code === 'messaging/registration-token-not-registered' ||
                            'messaging/invalid-registration-token') {
                            tokensToRemove.push(admin.database().ref('RefreshTokens').child(userId).child(tokens[index]).remove());
                        }
                    }
                });
                // return admin.database().ref('Notifications').child(conversationId).child(pushId).remove();
                return Promise.all(tokensToRemove);
            })

        });


        // let getDeviceTokensPromise = admin.database().ref(`RefreshTokens`).child(userId).once('value');
        // let getGarbasePromse = admin.database().ref(`users`).child(userId).once('value');
        //
        // return Promise.all([getDeviceTokensPromise, getGarbasePromse]).then(results => {
        //     const tokensSnapshot = results[0];
        //     const userSnapshot = results[1];
        //
        //     console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');
        //

        //
        //     const tokens = Object.keys(tokensSnapshot.val());
        //

        // });
    });

function loadUserTokens(userId) {
    let dbRef = admin.database().ref('RefreshTokens').child(userId);
    let defer = new Promise((resolve, reject) => {
        dbRef.once('value', (snap) => {
            let data = snap.val();
            let tokens = Object.keys(data);
            console.log(tokens);
            resolve(tokens);
        }, (err) => {
            reject(err);
        });
    });
    return defer;
}
