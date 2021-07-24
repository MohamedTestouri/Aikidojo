const mongoose = require('mongoose');

const clubSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, require: true},
    logo: {type: String, default: "logo.png"},
    image: {type: String, default: "banner.png"},
    category: {type: String, default: "Aikido"},
    place: [{
        longitude: {type: Number, require: true},
        latitude: {type: Number, require: true},
    }],
    sensei: [{_id: {type: String, require: true}}],
    members: [{_id: {type: String}}],
    contact: [{
        email: {type: String},
        webSite: {type: String},
        facebook: {type: String},
        phone: {type: String},
    }],
    invitations: [{_id: {type: String}}],
    lesson: [{
        _id: mongoose.Schema.Types.ObjectId,
        title: {type: String, require: true},
        date: {type: Date, require: false},
        presence: [{member: {type: String},
        date: {type: Date}}],
    }]

});

module.exports = mongoose.model('Club', clubSchema);