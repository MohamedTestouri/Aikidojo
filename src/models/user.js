const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {type: String, require: true},
    lastName: {type: String, require: true},
    gender: {type: String, require: true,},
    birthday: {type: Date, require: false},
    address: [{
        street: {type: String},
        city: {type: String},
        country: {type: String},
        zipCode: {type: String},
    }],
    nationality: {type: String},
    phone: {type: Number},
    email: {type: String, require: true, unique: true, lowercase: true},
    password: {type: String, require: true},
    image: {type: String, default: "avatar.jpeg"},
    role: {type: String, require: true},
    isActive: {type: Boolean, default: false},
    resetCode: {type: Number, require: true},
    grade: [{
        _id: mongoose.Schema.Types.ObjectId,
        belt: {type: String },
        date: {type: Date},
        place: [{
            longitude: {type: Number},
            latitude: {type: Number},
        }],
        examiner: {type: String},
        image: {type: String},
        video: {type: String},

    }],
    stage: [{
        _id: mongoose.Schema.Types.ObjectId,
        title: {type: String},
        date: {type: Date},
        place: [{
            longitude: {type: Number},
            latitude: {type: Number},
        }],
        category: {type: String},
        sensei: {type: String},
    }],
    attestation: [{
        _id: mongoose.Schema.Types.ObjectId,
        date: {type: Date},
        category: {type: String},
        logo: {type: String},
        signature: {type: String}
    }],
    club: [{_id: {type: String}}],
    socialMedia: [{
        facebook: String,
        instagram: String,
    }],
});

module.exports = mongoose.model('User', userSchema);