const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

const Club = require('../models/club');
const User = require('../models/user');

/** Club functions **/
exports.showClub = (req, res) => {
    Club.find().exec().then(club => {
        console.log(club);
        res.status(200).json(club);
    }).catch(error => {
        console.log(error);
        res.status(error.code).json({error: error});
    });
};
exports.addClub = (req, res) => {
    const club = new Club({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        logo: req.body.logo,
        image: req.body.image,
        category: req.body.category,
        sensei: {_id: req.body.sensei},
        place: {
            longitude: req.body.longitude,
            latitude: req.body.latitude,
        },
    });
    club.save().then(result => {
        console.log(result._id);
        return res.status(200).json(result);
    }).catch(error => {
        return res.status(error.code).json(error);
    });
};
exports.editClub = (req, res) => {
    Club.findOneAndUpdate({_id: req.body.id}, {
        $set: {
            name: req.body.name,
            logo: req.body.logo,
            image: req.body.image,
            category: req.body.category,
            sensei: {_id: req.body.sensei},
            place: {
                longitude: req.body.longitude,
                latitude: req.body.latitude,
            },
        }
    }, function (error, result) {
        if (error) {
            return res.status(error.code).json({error: error});
        }
        //  console.log(updateOptions);
        return res.status(200).json(result);
    });
};
exports.removeClub = (req, res) => {
    Club.remove({_id: req.body.id}).exec().then(result => {
        return res.status(200).json(result);
    }).catch(error => {
        console.log(error);
        return res.status(error.code).json(error);
    });
};
exports.getClub = (req, res) => {
    Club.findById(req.body.id).exec().then(club => {
        console.log(club);
        res.status(200).json(club);
    }).catch(error => {
        console.log(error);
        res.status(error.code).json({error: error});
    });
};

/** Member functions **/
exports.addMember = (req, res) => {
    Club.findOneAndUpdate({_id: req.body.id}, {
        $addToSet: {
            members: [{
                _id: req.body.members,
            }]
        }
    }, function (error, result) {
        if (error) {
            console.log(req.body);
            return res.status(error.code).json({error: error});
        }
        return res.status(200).json(result);
    });
};
exports.removeMember = (req, res) => {
    Club.findOneAndUpdate(
        {_id: req.body.id},
        {$pull: {members: {_id: req.body.members}}},
        function (error, result) {
            if (error) {
                return res.status(error.code).json({error: error});
            }
            User.findOneAndUpdate(
                {_id: req.body.members},
                {$pull: {club: {_id: req.body.id}}},
                function (error, result) {
                    if (error) {
                        return res.status(error.code).json({error: error});
                    }
                    return res.status(200).json(result);
                });
        });
};
exports.acceptInvitation = (req, res) => {
    Club.findOneAndUpdate({_id: req.body.id}, {
        $addToSet: {
            members: [{
                _id: req.body.members,
            }]
        }, $pull: {invitations: {_id: req.body.members}}
    }, function (error, result) {
        if (error) {
            console.log(req.body);
            return res.status(error.code).json({error: error});
        }
        User.updateOne({_id: req.body.members}, {
            $addToSet: {
                club: [{
                    _id: req.body.id,
                }],
            }
        }, function (error, result) {
            if (error) {
                return res.status(error.code).json({error: error});
            }
            return res.status(200).json(result);
        });
    });
};
exports.declineInvitation = (req, res) => {
    Club.findOneAndUpdate(
        {_id: req.body.id},
        {$pull: {invitations: {_id: req.body.invitations}}},
        function (error, result) {
            if (error) {
                return res.status(error.code).json({error: error});
            }
            return res.status(200).json(result);
        });
};
exports.addSensei = (req, res) => {
    Club.findOneAndUpdate({_id: req.body.id}, {
        $addToSet: {
            sensei: [{
                _id: req.body.sensei,
            }]
        }
    }, function (error, result) {
        if (error) {
            console.log(req.body);
            return res.status(error.code).json({error: error});
        }
        return res.status(200).json(result);
    });
};
exports.removeSensei = (req, res) => {
    Club.findOneAndUpdate(
        {_id: req.body.id},
        {$pull: {sensei: {_id: req.body.sensei}}},
        function (error, result) {
            if (error) {
                return res.status(error.code).json({error: error});
            }
            return res.status(200).json(result);
        });
};

exports.joinClub = (req, res) => {
    Club.findOneAndUpdate({_id: req.body.id}, {
        $addToSet: {
            invitations: [{
                _id: req.body.invitations,
            }]
        }
    }, function (error, result) {
        if (error) {
            console.log(req.body);
            return res.status(error.code).json({error: error});
        }
        return res.status(200).json(result);
    });
};

/** Contact functions **/
exports.addContact = (req, res) => {
    Club.updateOne({_id: req.body.id}, {
        $addToSet: {
            contact: [{
                email: req.body.email,
                webSite: req.body.webSite,
                facebook: req.body.facebook,
                phone: req.body.phone,
            }],
        }
    }, function (error, result) {
        if (error) {
            return res.status(error.code).json({error: error});
        }
        return res.status(200).json(result);
    });
};
exports.editContact = (req, res) => {
    Club.findOneAndUpdate({_id: req.body.id, 'contact._id': req.body.contact}, {
        $set: {
            'contact.$.email': req.body.email,
            'contact.$.webSite': req.body.webSite,
            'contact.$.facebook': req.body.facebook,
            'contact.$.phone': req.body.phone,
        }
    }, function (error, result) {
        if (error) {
            return res.status(error.code).json({error: error});
        }
        return res.status(200).json(result);
    });

};
exports.removeContact = (req, res) => {
    Club.findOneAndUpdate(
        {_id: req.body.id},
        {$pull: {contact: {_id: req.body.contact}}},
        function (error, result) {
            if (error) {
                return res.status(error.code).json({error: error});
            }
            return res.status(200).json(result);
        });
};

/** Lesson functions **/
exports.addLesson = (req, res) => {
    Club.updateOne({_id: req.body.id}, {
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
    Club.findOneAndUpdate({_id: req.body.id, 'lesson._id': req.body.lesson}, {
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
    Club.findOneAndUpdate(
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
    Club.updateOne({_id: req.body.id, 'lesson._id': req.body.lesson}, {
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
