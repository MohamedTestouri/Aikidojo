const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

const Event = require('../models/event');

/** Event functions **/
exports.showEvent = (req, res) =>{};
exports.addEvent = (req, res) =>{};
exports.editEvent = (req, res) =>{};
exports.removeEvent = (req, res) =>{};

/** Lesson functions **/
exports.addLesson = (req, res) => {
    Event.updateOne({_id: req.body.id}, {
        $addToSet: {
            lesson: [{
                _id: new mongoose.Types.ObjectId(),
                title: req.body.title,
                date: req.body.date,
            }],
        }
    }, function (error, result) {
        if (error) {
            return res.status(error.code).json({error: error});
        }
        return res.status(200).json(result);
    });
};
exports.editLesson = (req, res) => {
    Event.findOneAndUpdate({_id: req.body.id, 'lesson._id': req.body.lesson}, {
        $set: {
            'lesson.$.title': req.body.title,
            'lesson.$.date': req.body.date,
        }
    }, function (error, result) {
        if (error) {
            return res.status(error.code).json(error);
        }
        return res.status(200).json(result);
    });
};
exports.removeLesson = (req, res) => {
    Event.findOneAndUpdate(
        {_id: req.body.id},
        {$pull: {lesson: {_id: req.body.lesson}}},
        function (error, result) {
            if (error) {
                return res.status(error.code).json({error: error});
            }
            return res.status(200).json(result);
        });
};
exports.addPresence = (req, res) => {};

/** Grade functions **/
exports.addGrade = (req, res) =>{};