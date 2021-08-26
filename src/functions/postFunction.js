const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');

/** Post functions **/
exports.showForum = (req, res) => {
    Post.find({}).then(forum => {
        return res.status(200).json(forum)
    }).catch(error => {
        return res.status(500).json(error)
    });
};
exports.addPost = (req, res) => {
    var post = new Post({
        _id: mongoose.Types.ObjectId(),
        idUser: req.body.idUser,
        text: req.body.text,
        date: Date.now(),
    });
    if (req.file) {
        const imageLink = process.env.BASE_URL + "uploads/" + req.file.filename;
        post = new Post({
            _id: mongoose.Types.ObjectId(),
            idUser: req.body.idUser,
            text: req.body.text,
            date: Date.now(),
            image: imageLink,
        });
    }

    post.save().then(result => {
        return res.status(200).json(result);
    }).catch(error => {
        return res.status(500).json(result);
    });
};
exports.editPost = async (req, res) => {
    if (req.file) {
        const imageLink = process.env.BASE_URL + "uploads/" + req.file.filename;
        Post.update({ _id: req.body._id, idUser: req.body.idUser },
            {
                $set: {
                    text: req.body.text,
                    date: Date.now(),
                    image: imageLink,
                }

            }
        ).then(post => {
            return res.status(200).json(post);
        }).catch(error => {
            return res.status(500).json(error);
        });
    }
    Post.update({ _id: req.body._id, idUser: req.body.idUser },
        {
            $set: {
                text: req.body.text,
                date: Date.now(),
            }

        }
    ).then(post => {
        return res.status(200).json(post);
    }).catch(error => {
        return res.status(500).json(error);
    });

};
exports.removePost = async (req, res) => {
    const user = await User.findById(req.body.idUser);
    if (!user) return res.status(400).send("user not found");

    Post.find({ _id: req.body._id, idUser: req.body.idUser }).remove().then(result => {
        return res.send(200).json(result);
    }).catch(error => {
        return res.send(500).json(error);
    });

};
exports.likePost = (req, res) => { };
exports.dislikePost = (req, res) => { };
exports.getPost = (req, res) => {
    Post.findById(req.body._id).then(post => {
        return res.status(200).json(post);
    }).catch(error => {
        return res.status(500).json(error);
    });
};

/** Comment functions **/
exports.addComment = (req, res) => {
    Post.update({ _id: req.body._id }, {
        $push: {
            comments: {
                _id: mongoose.Types.ObjectId(),
                text: req.body.text,
                date: Date.now(),
                idUser: req.body.idUser,
            }
        }
    }).then(comment => {
        return res.status(200).json(comment);
    }).catch(error => {
        return res.status(500).json(error);
    })
};
exports.editComment = (req, res) => {
    Post.update(
        { _id: req.body.id, "comments._id": req.body.idComments, "comments._idUser": req.body.idUser },
        {
            $set: {
                comments: {
                    text: req.body.comments.text,
                    date: Date.now(),

                }
            }
        }).then(comment => {
            return res.status(200).json(comment);
        }).catch(error => {
            return res.status(500).json(error);
        });
};

exports.removeComment = (req, res) => {
    Post.update(
        { _id: req.body.id, "comments._id": req.body.idComment, "comments.idUser": req.body.idUser },

        {
            $pull: {
                comments: {
                    _id: req.body.idComment,
                    idUser: req.body.idUser,
                }
            }
        }).then(comment => {
            return res.status(200).json(comment);
        }).catch(error => {
            return res.status(500).json(error);
        });
};
