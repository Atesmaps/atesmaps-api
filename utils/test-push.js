// test-push.js
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Adjust path to your key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// ⚠️ PASTE YOUR DEVICE TOKEN HERE
const registrationToken = 'c-jO0OqJQRarqsf2ZxDJjo:APA91bHdDXMMlOuZMMA-lLkc2yM2bDQzIWAa13qS0T8oIjaGqNmcMx8VNDy-fNtfuoMKRExvFAxfEkVdu47ro0lpVEiT3qESVBE-biSmv_HMn2bzXY5L0gw'; 

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