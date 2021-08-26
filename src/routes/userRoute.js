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
    addSocial, generateCv,
    editSocial,
    removeSocial, generateAttestation,
    getUserByRole
} = require("../functions/userFunction");

const express = require('express');
const router = express.Router();
const { upload } = require("../utils/multerConfig");
var multipleUpload = upload.fields([{ name: "logo", maxCount: 1 }, { name: "image", maxCount: 1 }]);

router.post('/login', login);
router.post('/register', register);
router.patch('/activateAccount/', activateAccount);
router.delete('/deleteAccount', deleteAccount);
router.get('/getUser', getUser);
router.get('/getUserByRole', getUserByRole);
router.patch('/forgetPassword', forgetPassword);
router.patch('/resetPassword', resetPassword);
router.patch('/updateProfile', upload.single('image'), updateProfile);
router.patch('/updatePassword', updatePassword);
router.get('/pdf', generateAttestation);
router.get('/cv/pdf', generateCv);

router.put('/grade/add', upload.single('image'), addGrade);
router.patch('/grade/edit', upload.single('image'), editGrade);
router.delete('/grade/delete', removeGrade);

router.put('/stage/add', addStage);
router.patch('/stage/edit', editStage);
router.delete('/stage/delete', removeStage);

router.delete('/club/delete', removeClub);

router.put('/attestation/add', multipleUpload, addAttestation);
router.patch('/attestation/edit', multipleUpload, editAttestation);
router.delete('/attestation/delete', removeAttestation);

router.put('/socialMedia/add', addSocial);
router.patch('/socialMedia/edit', editSocial);
router.delete('/socialMedia/delete', removeSocial);

module.exports = router;