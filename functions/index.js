const admin = require("firebase-admin");
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

exports.sendNewMessageNotification = functions.database
    .ref('conversations/{userId}/{conversationId}')
    .onUpdate(event => {
        let userId = event.params.userId;
        let conversation = event.data.val();
        let lastMessageType = conversation.lastMessageType;
        let sender = conversation.user1;
        let sr1 = 'New message from ';
        let notificationTitle = sr1.concat(sender);
        let notificationBody = conversation.lastMessage;
        let payload = {
            notification: {
                title: notificationTitle,
                body: notificationBody
            }
        }
        let dbRefString = 'RefreshTokens/'.concat(userId);
        if (lastMessageType === "received") {
            const getTokenPromise = admin.database().ref(dbRefString).once('value');

            return Promise.all([getTokenPromise])
        } else {
            return 0;
        }


        /*let userId = event.params.userId;

        console.log('user id '.concat(userId));
		console.log('title '.concat(notificationTitle));
		console.log('body '.concat(notificationBody));

        if (lastMessageType === "received") {
			let deviceTokenPromise = admin.database().ref('RefreshTokens/'.concat(userId)).once('value');
			return Promise.all([deviceTokenPromise]).then(results => {
				let tokenSnapshot = results[0];
				let payload = {
                  notification: {
                      title: notificationTitle,
                      body: notificationBody
                  }
				}
				let tokens = Object.key(tokenSnapshot.val());
				let myToken = 'd5LFr4EchpY:APA91bH82SpnkXgZVjsft60h1M37NcXFhyCqaW-KarJO6nGJMgK8FzCMLLAqJ30lRTc1tFehxhV-y5cQf5WS6LFRqS0TSWK0nDNm13UfTVoZhp4Qs1AEEa-VNQJeqBHe5d3Ng2W1-Q3X'
				console.log(myToken);
				admin.messaging().sendToDevice(myToken, payload).then(function (response) {
					console.log('Successfully sent message: ', response);
				})
				.catch(function (error) {
					console.log.('Error sending message: ', error);
				});
			});
        } else {
            return 0;
        }*/
    });