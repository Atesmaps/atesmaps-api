// routes/userRoutes.js
const User = require('../model/User');


const registerToken = async (req, res) => {
    const { token, os, language } = req.body;
    const userId = req.userId; // Get user ID from your auth middleware

    console.log(req.body);

    if (!token || !os) {
        return res.status(400).json({ message: 'Token and OS are required.' });
    }

    try {

        // const user = await User.findByIdAndUpdate(userId, {
        //     $pull: { deviceTokens: { token: token } }
        // });

        await User.updateMany(
            { "deviceTokens.token": token }, // Query: Find any doc containing this token
            { $pull: { deviceTokens: { token: token } } } // Update: Remove the specific object
        );

        // Add new token with language
        await User.findByIdAndUpdate(userId, {
            $addToSet: { 
                deviceTokens: { 
                    token, 
                    os, 
                    language: language || 'es' // Default to 'en'
                } 
            }
        });

        res.status(200).json({ message: 'Token registered successfully.' });

    } catch (error) {
        console.error('Error registering device token:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const unregisterToken = async (req, res) => {
    const { token } = req.body;
    const userId = req.userId;

    try {
        // Remove specific token from this user
        await User.findByIdAndUpdate(userId, {
            $pull: { deviceTokens: { token: token } }
        });

        res.status(200).json({ message: 'Token removed.' });
    } catch (error) {
        console.error("Token Unregister Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const resetBadgeCount = async (req, res) => {
    const userId = req.userId; 

    if (!userId) {
        return res.status(400).json({ message: "User ID is missing" });
    }

    try {
        await User.findByIdAndUpdate(userId, { unreadCount: 0 });
        res.status(200).json({ message: "Badge reset" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting badge" });
    }
};


module.exports = {
    registerToken,
    unregisterToken,
    resetBadgeCount
}