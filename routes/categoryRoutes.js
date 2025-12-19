const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const verifyToken = require('../middleware/auth'); 

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes (require token)
router.post('/', verifyToken, categoryController.createCategory);
router.put('/:id', verifyToken, categoryController.updateCategory);
router.delete('/:id', verifyToken, categoryController.deleteCategory);

module.exports = router;
