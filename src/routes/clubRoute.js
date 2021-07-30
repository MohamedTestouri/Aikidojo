const express = require('express');
const {
    showClub, addClub, removeClub, editClub, acceptInvitation, addContact, addLesson,
    addMember, addPresence, getClub,
    addSensei,
    declineInvitation, editContact, editLesson, removeContact, removeLesson,
    removeMember,
    removeSensei, joinClub
} = require("../functions/clubFunction");
const router = express.Router();


router.get('/show', showClub);
router.post('/add', addClub);
router.patch('/edit', editClub);
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