
const admin = require('firebase-admin');

try {
    const serviceAccount = require('../serviceAccountKey.json'); // Your secret key
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin SDK initialized.");
} catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error.message);
}

/**
 * Sends a push notification to a list of device tokens.
 *
 * @param {Array<string>} targetTokens - An array of FCM device tokens.
 * @param {string} title - The notification title.
 * @param {string} body - The notification body.
 * @param {object} data - Custom data to send for deep-linking (e.g., { observationId: '123' }).
 */
async function sendNotification(targetTokens, title, body, data = {}) {
    if (!targetTokens || targetTokens.length === 0) {
        console.log("No target tokens provided. Skipping notification.");
        return;
    }

    const message = {
        notification: {
            title: title,
            body: body,
        },
        data: data, 
        tokens: targetTokens, 
        
 
        apns: { // iOS specific
            payload: {
                aps: {
                    sound: 'default', // Plays the default sound
                    badge: 1, // Or logic to calculate badge count
                },
            },
        },
        android: { // Android specific
            notification: {
                sound: 'default',
                // This MUST match the Channel ID you create on the client (React Native)
                channel_id: 'atesmaps-notifications', 
            },
        },
    };

    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log('Successfully sent message:', `${response.successCount} messages`);

        if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(targetTokens[idx]);
                }
            });
            console.log('List of failed tokens:', failedTokens);
            // You could add logic here to find these tokens in your DB and remove them
        }

    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

module.exports = { sendNotification };