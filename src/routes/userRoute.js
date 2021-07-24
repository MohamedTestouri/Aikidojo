const {
    activateAccount,
    deleteAccount,
    forgetPassword,
    getUser,
    login,
    register,
    resetPassword,
    updatePassword,
    updateProfile, addGrade, editGrade, removeGrade, addStage,
    editStage,
    removeStage,
    removeClub,
    addAttestation,
    editAttestation,
    removeAttestation,
    addSocial,
    editSocial,
    removeSocial,
    getUserByRole
} = require("../functions/userFunction");

const express = require('express');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.patch('/activateAccount/', activateAccount);
router.delete('/deleteAccount', deleteAccount);
router.get('/getUser', getUser);
router.get('/getUserByRole', getUserByRole);
router.patch('/forgetPassword', forgetPassword);
router.patch('/resetPassword', resetPassword);
router.patch('/updateProfile', updateProfile);
router.patch('/updatePassword', updatePassword);

router.put('/grade/add', addGrade);
router.patch('/grade/edit', editGrade);
router.delete('/grade/delete', removeGrade);

router.put('/stage/add', addStage);
router.patch('/stage/edit', editStage);
router.delete('/stage/delete', removeStage);

router.delete('/club/delete', removeClub);

router.put('/attestation/add', addAttestation);
router.patch('/attestation/edit', editAttestation);
router.delete('/attestation/delete', removeAttestation);

router.put('/socialMedia/add', addSocial);
router.patch('/socialMedia/edit', editSocial);
router.delete('/socialMedia/delete', removeSocial);

module.exports = router;