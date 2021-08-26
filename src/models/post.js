const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    text: { type: String, require: true },
    likes: { type: Number, default: 0 },
    likedBy: [{ _id: { type: String } }],
    date: { type: Date },
    image: { type: String },
    idUser: { type: String, require: true },
    comments: [{
        _id: mongoose.Schema.Types.ObjectId,
        text: { type: String },
        date: { type: Date },
        idUser: { type: String },
    }],

});

module.exports = mongoose.model('Post', postSchema);