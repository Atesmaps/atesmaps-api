require('dotenv').config(); // Loads variables from .env
const mongoose = require('mongoose');

// ⚠️ Ensure this path points to your actual User model definition
const User = require('./model/User'); 

// Grab the connection string from your environment variables
const MONGO_URI = process.env.DATABASE_URI;

const EXEMPT_EMAILS = [
    "david@twonav.com",
    "bilbaokorta@gmail.com",
    "xavi_tos@hotmail.com"
];

const NEW_EXPIRY = 1751241600000; // June 30, 2025

async function runUpdate() {
    // Safety Check: Ensure URI exists
    if (!MONGO_URI) {
        console.error('❌ Error: DATABASE_URI is missing in your .env file.');
        process.exit(1);
    }

    try {
        console.log('⏳ Connecting to database...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected.');

        console.log(`🔍 Processing users (Excluding: ${EXEMPT_EMAILS.join(', ')})...`);

        const result = await User.updateMany(
            { 
                email: { $nin: EXEMPT_EMAILS },
                "license.pro": true // Only target users who are currently Pro
            },
            { 
                $set: { 
                    "license.expiresAt": NEW_EXPIRY,
                    "license.pro": false
                 } 
            }
        );

        console.log('---------------------------------------------------');
        console.log(`🎉 Update Complete`);
        console.log(`✅ Matched:  ${result.matchedCount} users`);
        console.log(`✅ Modified: ${result.modifiedCount} users`);
        console.log('---------------------------------------------------');

    } catch (error) {
        console.error('❌ Error executing update:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected');
        process.exit();
    }
}

runUpdate();