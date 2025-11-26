// test-push.js
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Adjust path to your key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// ⚠️ PASTE YOUR DEVICE TOKEN HERE
const registrationToken = 'cU-E5yMJekwao9s3CPCCy6:APA91bGP0PISUBR-eEQF5Erf87Qin-E5jyBxfPnciiTH7tXGQRxekVOrrrXc0XqGxYmC9vAVNhVomttld4K8Nvggq83kUgMJVioK-CAASyAAAemxoxuQND8'; 

const message = {
  notification: {
    title: 'Backend Test',
    body: 'This is coming from Node.js!'
  },
  token: registrationToken,
  android: {
      notification: {
          channel_id: 'atesmaps-channel-id' // Must match your App.tsx config
      }
  }
};

admin.messaging().send(message)
  .then((response) => {
    console.log('✅ Successfully sent message:', response);
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ Error sending message:', error);
    process.exit(1);
  });