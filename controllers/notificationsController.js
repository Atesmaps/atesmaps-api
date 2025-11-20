// routes/userRoutes.js
const User = require('../model/User');


const registerToken = async (req, res) => {
    const { token, os } = req.body;
    const userId = req.user.id; // Get user ID from your auth middleware

    if (!token || !os) {
        return res.status(400).json({ message: 'Token and OS are required.' });
    }

    try {
        const newToken = { token, os };

        // We use $addToSet to add this token object to the array
        // ONLY if it doesn't already exist. This prevents duplicates.
        await User.findByIdAndUpdate(userId, {
            $addToSet: { deviceTokens: newToken }
        });

        res.status(200).json({ message: 'Token registered successfully.' });

    } catch (error) {
        console.error('Error registering device token:', error);
        res.status(500).json({ message: 'Server error' });
    }
}


module.exports = {
    registerToken,
}