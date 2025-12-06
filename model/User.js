const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const DeviceTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    os: {
        type: String,
        required: true,
        enum: ['ios', 'android']
    },
    language: { 
        type: String, 
        default: 'en' 
    }
}, {_id: false});

const userSchema = new Schema({
    status: {
        type: Boolean,
        default: false
    },
    blocked: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        required: false
    },
    email:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    lastName:{
        type: String,
        required: false
    },
    gender:{
        type: String,
        required: false
    },
    birthday: {
        type: Date,
        required: false
    },
    age: {
        type: Number,
        required: false
    },
    instagraProfile:{
        type: String,
        required: false
    }, 
    twitterProfile:{
        type: String,
        required: false
    },
    professionalOrientation: {
        type: Number,
        required: false
    },
    snowEducationLevel:{
        type: Number,
        required: false
    },
    snowExperienceLevel:{
        type: Number,
        required: false
    },
    avalanchExposure: {
        type: Number,
        required: false
    },
    terrainType:{
        type: Number,
        required: false
    },
    conditionsType:{
        type: Number,
        required: false
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    password: {
        type: String,
        required: true
    },
    socialLogin: {
        type: Boolean,
        default: false
    },
    license:{
        pro: {
            type: Boolean, 
            default: false
        },
        expiresAt:{
            type: Number,
            required: false
        },
        last_invoice: {
            type: String,
            required: false,
        },
        stripeId: {
            type: String,
            unique: true,
        },
    },
   
    googleUserId: String,
    appleUserId: String,
    refreshToken: String,
    observations: [{
        type: Schema.Types.ObjectId,
        ref: "Observation",
        required: false
    }],
    tracks: [{
        type: Schema.Types.ObjectId,
        ref: "Track",
        required: false
    }],
    unreadCount: { 
        type: Number, 
        default: 0 
    },
    terrainExperience: { type: Number, default: -1 },
    avalancheExperience: { type: Number, default: -1 },
    deviceTokens: [DeviceTokenSchema],
},
{
  timestamps: true
});

const calculateScores = (data) => {
    let terrainScore = 0;
    
    switch (data.terrainType) {
        case 1: terrainScore = 0.5; break;
        case 2: terrainScore = 1; break;
        case 3: terrainScore = 3; break;
        default: terrainScore = 0;
    }

    // Calculate Ta
    const userTa = (data.professionalOrientation - 1) + 
                   (data.snowEducationLevel - 1) + 
                   (data.snowExperienceLevel * terrainScore);

    // Calculate Ra
    const userRa = data.avalanchExposure + data.conditionsType;

    return { terrainExperience: userTa, avalancheExperience: userRa };
};

userSchema.pre('save', function(next) {
    const scores = calculateScores(this);
    
    this.terrainExperience = scores.terrainExperience;
    this.avalancheExperience = scores.avalancheExperience;
    
    next();
});

userSchema.pre(['findOneAndUpdate', 'updateOne'], async function(next) {
    // 'this' refers to the Query, not the document.
    const updateData = this.getUpdate();

    // Only calculate if relevant fields are changing
    if (updateData.terrainType || updateData.professionalOrientation || 
        updateData.snowEducationLevel || updateData.snowExperienceLevel || 
        updateData.avalanchExposure || updateData.conditionsType) {
        
        try {
            // We need the current document from DB to merge with updates
            // (in case the update only changes 1 field, we need the other 5 to calculate)
            const docToUpdate = await this.model.findOne(this.getQuery());

            if (docToUpdate) {
                // Merge existing data with new updates
                // Note: handles if updateData has $set operator or direct fields
                const dataToCalculate = { 
                    ...docToUpdate.toObject(), 
                    ...(updateData.$set || updateData) 
                };
                
                const scores = calculateScores(dataToCalculate);

                // Inject the calculated scores into the update
                if (updateData.$set) {
                    updateData.$set.terrainExperience = scores.terrainExperience;
                    updateData.$set.avalancheExperience = scores.avalancheExperience;
                } else {
                    this.set({ terrainExperience: scores.terrainExperience, avalancheExperience: scores.avalancheExperience });
                }
            }
        } catch (err) {
            return next(err);
        }
    }
    next();
});

userSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

module.exports = mongoose.model('User', userSchema);