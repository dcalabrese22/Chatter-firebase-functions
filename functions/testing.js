var admin = require("firebase-admin");

var serviceAccount = require("/media/dan/Storage/Chatter-firebase-functions/functions/service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chatter-40b44.firebaseio.com"
});


const conversationRef = admin.database().ref('/conversations/');

conversationRef.orderByChild("user1").on('child_changed', function (snapshot) {

    const data = snapshot.val();
    console.log(data);

});