const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, require: true},
    category: {type: String, require: true},
    date: {type: Date, require: true},
    place: [{
        longitude: {type: Number, require: true},
        latitude: {type: Number, require: true},
    }],
    description: {type: String, require: true},
    sensei: {type: String, require: true},
    organizer: {type: String},
    grades: [{
        _id: mongoose.Schema.Types.ObjectId,
        idUser: {type: String},
        result: {type: String},
        grade: {type: String},
        notes: {type: String},
    }],
    lesson: [{
        _id: mongoose.Schema.Types.ObjectId,
        title: {type: String},
        startTime: {type: Date},
        endTime: {type: Date},
        date: {type: Date},
        presence: [{_id: {type: String}}],
    }],
    members: [{_id: {type: String}}],
});

module.exports = mongoose.model('Event', eventSchema);