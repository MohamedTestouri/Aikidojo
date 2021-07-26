const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

const Event = require('../models/event');

/** Event functions **/
exports.showEvent = (req, res) =>{
    Event.find().exec().then(event => {
        console.log(event);
        res.status(200).json(event);
    }).catch(error => {
        console.log(error);
        res.status(error.code).json({error: error});
    });
};
exports.addEvent = (req, res) =>{
    const event = new Event({_id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        category: req.body.category,
        date: req.body.date,
        place: [{
            longitude: req.body.longitude,
            latitude: req.body.latitude,
        }],
        description: req.body.description,
        sensei: req.body.sensei,
        organizer: req.body.organizer,
    });
    event.save().then(result => {
        console.log(result._id);
        return res.status(200).json(result);
    }).catch(error => {
        return res.status(error.code).json(error);
    });
};
exports.editEvent = (req, res) =>{
    Event.findOneAndUpdate({_id: req.body.id}, {
        $set: {
            title: req.body.title,
            category: req.body.category,
            date: req.body.date,
            place: [{
                longitude: req.body.longitude,
                latitude: req.body.latitude,
            }],
            description: req.body.description,
            sensei: req.body.sensei,
            organizer: req.body.organizer,
        }
    }, function (error, result) {
        if (error) {
            return res.status(error.code).json({error: error});
        }
        return res.status(200).json(result);
    });
};
exports.removeEvent = (req, res) =>{
    Event.remove({_id: req.body.id}).exec().then(result => {
        return res.status(200).json(result);
    }).catch(error => {
        console.log(error);
        return res.status(error.code).json(error);
    });
};

exports.getEvent = (req, res) =>{
    Event.findById(req.body.id).exec().then(event => {
    console.log(event);
    res.status(200).json(event);
}).catch(error => {
    console.log(error);
    res.status(error.code).json(error);
});};

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
exports.addPresence = (req, res) => {
    Event.updateOne({_id: req.body.id, 'lesson._id': req.body.lesson}, {
        $push: {
            'lesson.$.presence': {
                member: req.body.member,
                date: Date.now(),
            },
        }
    }, function (error, result) {
        if (error) {
            return res.status(error.code).json({error: error});
        }
        console.log(result);
        console.log(req.body);
        return res.status(200).json(result);
    });
};

/** Grade functions **/
exports.addGrade = (req, res) =>{
Event.findOneAndUpdate({_id: req.body.id}, {
        $addToSet: {
            grades: [{
                _id: new mongoose.Types.ObjectId(),
                idUser: req.body.user,
                grade: req.body.grade,
                notes: null,
                result: null,
            }],
        }
    }, function (error, result) {
        if (error) {
            console.log(req.body);
            return res.status(error.code).json({error: error});
        }
        return res.status(200).json(result);
    });
};

exports.editGrade = (req, res) =>{
Event.findOneAndUpdate({_id: req.body.id, 'grades._id': req.body.grade}, {
        $set: {
            'grades.$.notes': req.body.notes,
            'grades.$.result': req.body.result,
            },
    }, function (error, result) {
        if (error) {
            console.log(req.body);
            return res.status(error.code).json({error: error});
        }
        return res.status(200).json(result);
    });
};

/** Member function **/
exports.joinEvent = (req, res) => {
  Event.findOneAndUpdate({_id : req.body.id}, {$addToSet:{
          members: [{
              _id: req.body.members
          }]
      }}, function (error, result) {
      if (error) {
          console.log(req.body);
          return res.status(error.code).json({error: error});
      }
      return res.status(200).json(result);
  })  ;
};

exports.leaveEvent = (req, res) => {
  Event.findOneAndUpdate({_id : req.body.id}, {$pull:{
          members: {
              _id: req.body.members
          }
      }}, function (error, result) {
      if (error) {
          console.log(req.body);
          return res.status(error.code).json({error: error});
      }
      return res.status(200).json(result);
  })  ;
};