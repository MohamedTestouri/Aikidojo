const express = require('express');
const router = express.Router();
const {addLesson, addPresence, editLesson,  removeLesson, removeEvent, editEvent, addEvent, showEvent, getEvent, addGrade, editGrade, joinEvent, leaveEvent} = require("../functions/eventFunction");

router.get('/show', showEvent);
router.post('/add', addEvent);
router.patch('/edit', editEvent);
router.delete('/delete', removeEvent);
router.get('/getEvent', getEvent);

router.put('/lesson/add', addLesson);
router.patch('/lesson/edit', editLesson);
router.delete('/lesson/delete', removeLesson);
router.put('/lesson/presence/add', addPresence);

router.put('/grade/add', addGrade);
router.patch('/grade/edit', editGrade);

router.put('/members/join', joinEvent);
router.put('/members/leave', leaveEvent);

module.exports = router;