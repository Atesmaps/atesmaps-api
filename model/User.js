const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

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
    refreshToken: String,
    observations: [{
        type: Schema.Types.ObjectId,
        ref: "Observation",
        required: false
    }]
});

userSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

module.exports = mongoose.model('User', userSchema);