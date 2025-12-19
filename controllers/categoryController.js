const categoryModel = require('../models/categoryModel');

exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await categoryModel.getCategoryBy('id',req.params.id)
    if (!category.length) return res.status(404).json({ error: 'category not found' });
    res.json(category[0]);
  } catch (err) {
    res.status(500).json({ error: `Error creating category: ${err}` });
  }
};


exports.createCategory = async (req, res) => {
  try {
    const {name} = req.body;
    const newCategory = await categoryModel.createCategory({name});
    res.json(newCategory);
  } catch (err) {
    res.status(500).json({ error: `Error creating category: ${err}` });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    await categoryModel.updateCategory(req.params.id, name);
    res.json({ message: 'Category updated' });
  } catch (err) {
    res.status(500).json({ error: `Error updating category: ${err}` });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await categoryModel.deleteCategory(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting category' });
  }
};
