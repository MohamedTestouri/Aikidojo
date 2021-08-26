const mongoose = require('mongoose');

const clubSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, require: true }, //required
    logo: { type: String, default: "logo.jpeg" },
    image: { type: String, default: "banner.png" },
    category: { type: String, default: "Aikido" },
    place: [{
        longitude: { type: Number, require: true },//required
        latitude: { type: Number, require: true },//required
    }],
    sensei: [{ _id: { type: String, require: true } }],//required
    members: [{ _id: { type: String } }],
    contact: [{
        email: { type: String },
        webSite: { type: String },
        facebook: { type: String },
        phone: { type: String },
    }],
    invitations: [{ _id: { type: String } }],
    lesson: [{
        _id: mongoose.Schema.Types.ObjectId,
        title: { type: String, require: true },//required
        date: { type: Date, require: false },
        presence: [{
            member: { type: String },
            date: { type: Date }
        }],
    }]

});

module.exports = mongoose.model('Club', clubSchema);