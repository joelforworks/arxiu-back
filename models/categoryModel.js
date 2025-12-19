const db = require('../config/db');

const getAllCategories = async () => {
  const [rows] = await db.query('SELECT * FROM categories ORDER BY id DESC');
  return rows;
};

const getCategoryBy = async (field,value) => {
  const query = `SELECT * FROM categories WHERE ${field} = ? ORDER BY id DESC`;
  const [rows] = await db.query(query, [value]);
  return rows;
};

const getCategoryById = async (id) => {
  const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0];
};

const createCategory = async ({name}) => {
  const [result] = await db.query(
    'INSERT INTO categories (name) VALUES (?)',
    [name]
  );
  return { id: result.insertId, name };
};

const updateCategory = async (id, name) => {
  await db.query(
    'UPDATE categories SET name = ? WHERE id = ?',
    [name, id]
  );
};

const deleteCategory = async (id) => {
  await db.query('DELETE FROM categories WHERE id = ?', [id]);
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryBy,
  createCategory,
  updateCategory,
  deleteCategory,
};
