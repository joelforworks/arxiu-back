const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/auth'); 

// Public routes
router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);

// Protected routes (require token)
router.post('/', verifyToken,  postController.createPost);
router.put('/:id', verifyToken, postController.updatePost);
router.delete('/:id', verifyToken, postController.deletePost);

module.exports = router;
