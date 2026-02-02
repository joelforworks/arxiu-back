const db = require('../config/db');

const allowedFields = ['id', 'name'];

const getAllCategories = async () => {
  const result = await db.query(
    'SELECT * FROM categories ORDER BY id DESC'
  );
  return result.rows;
};

const getCategoryBy = async (field, value) => {

  if (!allowedFields.includes(field)) {
    throw new Error('Invalid field');
  }

  const query = `
    SELECT * FROM categories
    WHERE ${field} = $1
    ORDER BY id DESC
  `;

  const result = await db.query(query, [value]);
  return result.rows;
};

const getCategoryById = async (id) => {
  const result = await db.query(
    'SELECT * FROM categories WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const createCategory = async ({ name }) => {

  const result = await db.query(
    `INSERT INTO categories (name)
     VALUES ($1)
     RETURNING id`,
    [name]
  );

  return { id: result.rows[0].id, name };
};

const updateCategory = async (id, name) => {

  await db.query(
    `UPDATE categories
     SET name = $1
     WHERE id = $2`,
    [name, id]
  );
};

const deleteCategory = async (id) => {
  await db.query(
    'DELETE FROM categories WHERE id = $1',
    [id]
  );
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryBy,
  createCategory,
  updateCategory,
  deleteCategory,
};
