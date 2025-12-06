const path = require('path'); 
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../model/User'); // Adjust path to your User model

const updateAllUsers = async () => {
    try {
        console.log("⏳ Connecting to DB...");
        await mongoose.connect(process.env.DATABASE_URI); // Ensure this matches your .env key
        console.log("✅ Connected.");

        console.log("⏳ Fetching all users...");
        const users = await User.find({});
        console.log(`found ${users.length} users.`);

        let updatedCount = 0;

        for (const user of users) {
            // We don't need to change anything manually.
            // Calling .save() triggers the pre('save') hook we wrote earlier,
            // which recalculates 'Ta' and 'Ra' based on existing fields.
            await user.save();
            
            updatedCount++;
            if (updatedCount % 10 === 0) {
                console.log(`... processed ${updatedCount} users`);
            }
        }

        console.log(`🎉 Successfully updated ${updatedCount} users.`);
        process.exit(0);

    } catch (error) {
        console.error("❌ Error updating users:", error);
        process.exit(1);
    }
};

updateAllUsers();