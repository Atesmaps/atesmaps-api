const path = require('path'); 
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../model/User'); 

const nuclearRemove = async () => {
    try {
        console.log("🔥 Connecting to DB...");
        await mongoose.connect(process.env.DATABASE_URI); 
        console.log("✅ Connected.");

        console.log("⚠️ DELETING fields 'Ta' and 'Ra' from ALL documents...");

        // The empty string "" here is just syntax required by Mongo. 
        // It tells Mongo "Remove this key regardless of its value".
        const result = await User.collection.updateMany(
            {}, 
            { 
                $unset: { 
                    "experience": "", 
                    "riskExposure": ""
                } 
            }
        );

        console.log(`💥 DELETED attributes from ${result.modifiedCount} users.`);
        
        // Optional: Verification Check
        const checkUser = await User.findOne().lean();
        console.log("Sanity Check (Should NOT see Ta/Ra below):");
        console.log(checkUser);

        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

nuclearRemove();