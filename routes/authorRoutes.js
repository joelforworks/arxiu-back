const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const verifyToken = require('../middleware/auth'); 

// Public routes
router.get('/', authorController.getAll);
router.get('/:id', authorController.get);

// Protected routes (require token)
router.post('/', verifyToken, authorController.create);
router.put('/:id', verifyToken, authorController.update);
router.delete('/:id', verifyToken, authorController.delete);

module.exports = router;
