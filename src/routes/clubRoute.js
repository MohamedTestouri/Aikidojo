const express = require('express');
const multer = require("multer");
// importing multer configuration function and the url of the web site(domain name)
const { upload } = require("../utils/multerConfig");
const {
    showClub, addClub, removeClub, editClub, acceptInvitation, addContact, addLesson,
    addMember, addPresence, getClub,
    addSensei,
    declineInvitation, editContact, editLesson, removeContact, removeLesson,
    removeMember,
    removeSensei, joinClub
} = require("../functions/clubFunction");
const router = express.Router();

var multipleUpload = upload.fields([{ name: "logo", maxCount: 1 }, { name: "image", maxCount: 1 }]);
router.get('/show', showClub);
router.post('/add', multipleUpload, addClub);
router.patch('/edit', multipleUpload, editClub);
router.delete('/delete', removeClub);
router.get('/getClub', getClub);

router.put('/member/add', addMember);
router.delete('/member/delete', removeMember);
router.post('/invitation/accept', acceptInvitation);
router.delete('/invitation/decline', declineInvitation);
router.put('/sensei/add', addSensei);
router.delete('/sensei/delete', removeSensei);
router.put('/invitation/join', joinClub);

router.put('/contact/add', addContact);
router.patch('/contact/edit', editContact);
router.delete('/contact/delete', removeContact);

router.put('/lesson/add', addLesson);
router.patch('/lesson/edit', editLesson);
router.delete('/lesson/delete', removeLesson);
router.put('/lesson/presence/add', addPresence);

module.exports = router;