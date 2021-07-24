const express = require('express');
const {showForum,
    addComment,
    addPost,
    dislikePost,
    editComment,
    editPost,
    likePost, removeComment, getPost,
    removePost} = require("../functions/forumFunction");
const router = express.Router();

router.get('/showForum', showForum);
router.get('/getPost', getPost);
router.post('/addPost', addPost);
router.patch('/editPost', editPost);
router.delete('/removePost', removePost);
router.patch('/likePost', likePost);
router.patch('/dislikePost', dislikePost);

router.post('/comment/addComment', addComment);
router.patch('/comment/editComment', editComment);
router.delete('/comment/removeComment', removeComment);
module.exports = router;