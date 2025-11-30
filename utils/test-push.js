// test-push.js
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Adjust path to your key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// ⚠️ PASTE YOUR DEVICE TOKEN HERE
const androidRegistrationToken = 'fU72nMdvQZeC0kolMp1wnv:APA91bHuHaK-zza-gMFKV3Sze88LIHtAycw8GRhxaCT2KwvcB3zEdSjmDQ8r_HZRJME6WekVBFGtXWJC9Bkee_NSZwTXZWOgqPP2X1Vd5FgbmYbmgjMWe1Q'; 
const iosRegistrationToken ='cf2Zc0LtS09EgbW00elZ98:APA91bG_zmvwGQiOI5A_B5zxGBZ0cCX9vcpcT0vX-kkFqZJGGoEOcbf7mvGSzRmPtcbpQSXU4nqs84hljcBilI82XSRF8xUivOU-eZgUvVM2gzDal5r2WgQ';



const message = {
  notification: {
    title:'🔍 Nueva Observación',
    body: 'Pas de la casa @ Andorra -\n ¡Míralo en el mapa!',
  },
  data: { observationId: '69299adb583fd03ffb30d7f5' }, 
  token: iosRegistrationToken,
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