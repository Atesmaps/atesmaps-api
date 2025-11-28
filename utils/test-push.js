// test-push.js
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Adjust path to your key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// ⚠️ PASTE YOUR DEVICE TOKEN HERE
const androidRegistrationToken = 'fU72nMdvQZeC0kolMp1wnv:APA91bHuHaK-zza-gMFKV3Sze88LIHtAycw8GRhxaCT2KwvcB3zEdSjmDQ8r_HZRJME6WekVBFGtXWJC9Bkee_NSZwTXZWOgqPP2X1Vd5FgbmYbmgjMWe1Q'; 
const iosRegistrationToken ='cU-E5yMJekwao9s3CPCCy6:APA91bGP0PISUBR-eEQF5Erf87Qin-E5jyBxfPnciiTH7tXGQRxekVOrrrXc0XqGxYmC9vAVNhVomttld4K8Nvggq83kUgMJVioK-CAASyAAAemxoxuQND8'

const message = {
  notification: {
    title:'🔍 Nueva Observación',
    body: 'Pas de la casa @ Andorra -\n ¡Míralo en el mapa!'
  },
  token: androidRegistrationToken,
   apns: {
            payload: {
                aps: {
                    sound: 'default', 
                    badge: 1, 
                },
            },
        },
  android: {
        priority: 'high',
        notification: {
            sound: 'default',
            channel_id: 'atesmaps-channel-id', 
            notification_count: 1
        },
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