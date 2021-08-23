const { hash } = require('bcrypt');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mailer = require('nodemailer');
const { jsPDF } = require("jspdf");
const fs = require('fs');

const Club = require('../models/club');
const User = require('../models/user');
const path = require("path");
/** Config **/
const transporter = mailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    },
});

/** Auth functions **/
exports.register = async (req, res) => {
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(400).json({ message: 'Email exist' });
    }
    const resetCode = Math.floor(Math.random() * 9999);
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        birthday: req.body.birthday,
        role: req.body.role,
        resetCode: resetCode
    });
    const newUser = await user.save();
    if (newUser) {
        let mailOptions = {
            from: 'Aikido.ClubT@gmail.com',
            to: req.body.email,
            subject: 'Verify your Account',
            text: 'Here is your verification code: ' + resetCode
        };
        sendmail(mailOptions);
        return res.status(201).json(newUser);
    }
};


exports.login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: 'E-mail does not exist' });
    }
    const verifyPassword = await bcrypt.compare(req.body.password, user.password);
    if (!verifyPassword) {
        return res.status(400).send({ message: 'Password is invalid' });
    }
    if (!user.isActive) {
        return res.status(400).send({ message: 'Account is disabled' });
    }
    return await res.status(200).json(user);
};

exports.activateAccount = async (req, res) => {
    const code = req.body.code;
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: 'E-mail does not exist' });
    }
    if (user.resetCode === code) {
        User.findOneAndUpdate({ email: req.body.email }, { $set: { isActive: true } }, function (error, user) {
            if (error) {
                return res.status(error.code).json(error);
            }
            return res.status(200).json(user);
        });
    } else {
        return res.status(400).json({ message: "Invalid verification code" });
    }
};

exports.forgetPassword = async (req, res) => {
    const emailExist = await User.findOne({ email: req.body.email });
    if (!emailExist) {
        return res.status(400).json({ message: 'Email does not exist' });
    }
    const resetCode = Math.floor(Math.random() * 9999);
    User.findOneAndUpdate({ email: req.body.email }, { $set: { resetCode: resetCode } }, function (error, user) {
        if (error) {
            return res.status(error.code).json(error);
        }
        let mailOptions = {
            from: 'Aikido.ClubT@gmail.com',
            to: req.body.email,
            subject: 'Reset Password',
            text: 'Here is your reset code: ' + resetCode
        };
        sendmail(mailOptions);
        return res.status(200).json({ message: "Reset code sent successfully" });
    });
};
exports.resetPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: 'Email does not exist' });
    }
    if (user.resetCode === req.body.resetCode) {
        User.findOneAndUpdate({ email: req.body.email }, { $set: { password: bcrypt.hashSync(req.body.password, 10) } }, function (error, user) {
            if (error) {
                return res.status(error.code).json(error);
            }
            return res.status(200).json({ message: "Password updated successfully" });
        });
    } else {
        return res.status(400).json({ message: "Invalid credentials!" });
    }
};

exports.updatePassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: 'Email does not exist' });
    }
    User.findOneAndUpdate({ email: req.body.email }, { $set: { password: bcrypt.hashSync(req.body.password, 10) } }, function (error, user) {
        if (error) {
            return res.status(error.code).json(error);
        }
        return res.status(200).json({ message: "Password updated successfully" });
    });
};
exports.deleteAccount = (req, res) => {
    const id = req.body.id;
    User.remove({ _id: id })
        .exec()
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            return res.status(error.code).json({ error: error });
        });
};
//unfinished fonction with upload image
exports.updateProfile = (req, res) => {
    const imageLink = process.env.BASE_URL + "uploads/" + req.file.filename;
    User.findOneAndUpdate({ _id: req.body.id },
        {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                gender: req.body.gender,
                birthday: req.body.birthday,
                nationality: req.body.nationality,
                phone: req.body.phone,
                role: req.body.role,
                image: imageLink,
            },
            $push: {
                address: {
                    street: req.body.street,
                    city: req.body.city,
                    country: req.body.country,
                    zipCode: req.body.zipCode,
                }
            }
        },
        function (error, result) {
            if (error) {
                console.log(req.body);
                return res.status(error.code).json({ error: error });
            }
            return res.status(200).json(result);
        });
};

exports.getUser = (req, res) => {
    searchUser(req, res, req.body.id);
};

exports.getUserByRole = (req, res) => {
    User.findOne({ role: req.body.role })
        .exec()
        .then((doc) => {
            if (doc) {
                return res.status(200).json(doc);
            } else {
                return res.status(404).json({ message: "404 NOT FOUND" });
            }
        })
        .catch((error) => {
            return res.status(error.code).json({ error: error });
        });
};

/** Grade functions **/
exports.addGrade = (req, res) => {
    const imageLink = process.env.BASE_URL + "uploads/" + req.file.filename;

    User.findOneAndUpdate({ _id: req.body.id }, {
        $addToSet: {
            grade: [{
                _id: new mongoose.Types.ObjectId(),
                belt: req.body.belt,
                date: req.body.date,
                place: {
                    longitude: req.body.longitude,
                    latitude: req.body.latitude,
                },
                examiner: req.body.examiner,
                image: imageLink,
                video: req.body.video,
            }],
        }
    }, function (error, result) {
        if (error) {
            console.log(req.body);
            return res.status(error.code).json({ error: error });
        }
        return res.status(200).json(result);
    });
};
exports.editGrade = (req, res) => {
    const imageLink = process.env.BASE_URL + "uploads/" + req.file.filename;
    User.findOneAndUpdate({ _id: req.body.id, 'grade._id': req.body.grade }, {
        $set: {
            'grade.$.belt': req.body.belt,
            'grade.$.date': req.body.date,
            'grade.$.place': {
                longitude: req.body.longitude,
                latitude: req.body.latitude,
            },
            'grade.$.examiner': req.body.examiner,
            'grade.$.image': imageLink,
            'grade.$.video': req.body.video,
        }
    }, function (error, result) {
        if (error) {
            return res.status(error.code).json({ error: error });
        }
        //  console.log(updateOptions);
        return res.status(200).json(result);
    });
};
exports.removeGrade = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.body.id },
        { $pull: { grade: { _id: req.body.grade } } },
        function (error, result) {
            if (error) {
                return res.status(error.code).json({ error: error });
            }
            return res.status(200).json(result);
        });
};

/** Stage functions **/
exports.addStage = (req, res) => {
    User.updateOne({ _id: req.body.id }, {
        $addToSet: {
            stage: [{
                _id: new mongoose.Types.ObjectId(),
                title: req.body.title,
                date: req.body.date,
                place: [{
                    longitude: req.body.longitude,
                    latitude: req.body.latitude,
                }],
                category: req.body.category,
                sensei: req.body.sensei,
            }],
        }
    }, function (error, result) {
        if (error) {
            return res.status(error.code).json({ error: error });
        }
        return res.status(200).json(result);
    });
};
exports.editStage = (req, res) => {
    User.findOneAndUpdate({ _id: req.body.id, 'stage._id': req.body.stage }, {
        $set: {
            'stage.$.title': req.body.title,
            'stage.$.date': req.body.date,
            place: [{
                longitude: req.body.longitude,
                latitude: req.body.latitude,
            }],
            'stage.$.category': req.body.category,
            'stage.$.sensei': req.body.sensei,

        }
    }, function (error, result) {
        if (error) {
            return res.status(error.code).json({ error: error });
        }
        return res.status(200).json(result);
    });
};
exports.removeStage = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.body.id },
        { $pull: { stage: { _id: req.body.stage } } },
        function (error, result) {
            if (error) {
                return res.status(error.code).json({ error: error });
            }
            return res.status(200).json(result);
        });
};

/** Attestation functions **/
exports.addAttestation = (req, res) => {
    const imageLink = process.env.BASE_URL + "uploads/" + req.files.image[0].filename;
    const logoLink = process.env.BASE_URL + "uploads/" + req.files.logo[0].filename;
    User.updateOne({ _id: req.body.id }, {
        $addToSet: {
            attestation: [{
                _id: new mongoose.Types.ObjectId(),
                date: req.body.date,
                category: req.body.category,
                logo: logoLink,
                signature: imageLink,
            }],
        }
    }, function (error, result) {
        if (error) {
            return res.status(error.code).json({ error: error });
        }
        return res.status(200).json(result);
    });
};
exports.editAttestation = (req, res) => {
    const imageLink = process.env.BASE_URL + "uploads/" + req.files.image[0].filename;
    const logoLink = process.env.BASE_URL + "uploads/" + req.files.logo[0].filename;
    User.findOneAndUpdate({ _id: req.body.id, 'attestation._id': req.body.attestation }, {
        $set: {
            'attestation.$.date': req.body.date,
            'attestation.$.category': req.body.category,
            'attestation.$.logo': logoLink,
            'attestation.$.signature': imageLink,

        }
    }, function (error, result) {
        if (error) {
            return res.status(error.code).json({ error: error });
        }
        return res.status(200).json(result);
    });
};
exports.removeAttestation = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.body.id },
        { $pull: { attestation: { _id: req.body.attestation } } },
        function (error, result) {
            if (error) {
                return res.status(error.code).json({ error: error });
            }
            return res.status(200).json(result);
        });
};

/** Club functions **/
exports.removeClub = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.body.id },
        { $pull: { club: { _id: req.body.club } } },
        function (error, result) {
            if (error) {
                return res.status(error.code).json({ error: error });
            }
            Club.findOneAndUpdate(
                { _id: req.body.club },
                { $pull: { members: { _id: req.body.id } } },
                function (error, result) {
                    if (error) {
                        return res.status(error.code).json({ error: error });
                    }
                    return res.status(200).json(result);
                });
        });
};

/** Social media functions **/
exports.addSocial = (req, res) => {
    User.updateOne({ _id: req.body.id }, {
        $addToSet: {
            socialMedia: [{
                _id: new mongoose.Types.ObjectId(),
                facebook: req.body.facebook,
                instagram: req.body.instagram,
            }],
        }
    }, function (error, result) {
        if (error) {
            return res.status(error.code).json({ error: error });
        }
        return res.status(200).json(result);
    });
};
exports.editSocial = (req, res) => {
    User.findOneAndUpdate({ _id: req.body.id, 'socialMedia._id': req.body.socialMedia }, {
        $set: {
            'socialMedia.$.facebook': req.body.facebook,
            'socialMedia.$.instagram': req.body.instagram,
        }
    }, function (error, result) {
        if (error) {
            return res.status(error.code).json({ error: error });
        }
        return res.status(200).json(result);
    });
};
exports.removeSocial = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.body.id },
        { $pull: { socialMedia: { _id: req.body.socialMedia } } },
        function (error, result) {
            if (error) {
                return res.status(error.code).json({ error: error });
            }
            return res.status(200).json(result);
        });
};

exports.generateAttestation = async (req, res) => {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: [4, 2]
    });
    const user = await User.findById(
        req.body.id
    );
    if (user) {
        const array = user.attestation;
        console.log(array);
        for (obj of array) {
            if (obj._id.toString() === req.body.attestation) {
                // Add your fields here !!
                doc.text(obj.logo, 1, 1);
                doc.text(obj.category, 1, 2);
                console.log(obj.logo);
            }
            console.log(obj._id);
        }
        doc.save(req.body.attestation + ".pdf");
        var filePath = path.dirname("app.js") + "/" + req.body.attestation + `.pdf`;
        console.log(filePath);
        return res.status(200).download(req.body.attestation + '.pdf', function (error) {
            if (error) {
                console.log("Error:" + error);
            }
            fs.unlinkSync(filePath);
        });

    }
    else {
        return res.status(404).json({ message: "Not found !" });
    }
};

exports.generateCv = (req, res) => {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: [4, 2]
    });
    User.findById(req.body.id).exec().then(
        (result) => {
            // add the other fields here !!
            doc.text(result.lastName, 1, 1);
            doc.text(result.firstName, 1, 2);
            doc.save(req.body.id + ".pdf");
            console.log(result);
            var filePath = path.dirname("app.js") + "/" + req.body.id + `.pdf`;
            return res.status(200).download(req.body.id + ".pdf", function (error) {
                if (error) {
                    console.log("Error:" + error);
                }
                fs.unlinkSync(filePath);
            })
        }
    ).catch(error => console.log(error));
}
/** Utils functions **/

function sendmail(mailOptions) {
    transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

/**
 * to get user by id
 * @param req : request
 * @param res : response
 * @param id : id user
 * we needd it t
 */
function searchUser(req, res, id) {
    User.findById(id)
        .exec()
        .then((doc) => {
            if (doc) {
                return res.status(200).json(doc);
            } else {
                return res.status(404).json({ message: "404 NOT FOUND" });
            }
        })
        .catch((error) => {
            return res.status(error.code).json({ error: error });
        });
}