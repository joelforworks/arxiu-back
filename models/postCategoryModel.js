const db = require('../config/db');

const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM post_category ORDER BY id DESC');
  return rows;
};

const getAllBy = async (field,value) => {
  const query = `SELECT * FROM post_category WHERE ${field} = ? ORDER BY id DESC`;
  const [rows] = await db.query(query, [value]);
  return rows;
};

const create = async ({post_id,category_id}) => {
  const [result] = await db.query(
    'INSERT INTO post_category (post_id,category_id) VALUES (?, ?)',
    [post_id,category_id]
  );
  return { id: result.insertId, post_id, category_id};
};

const deletePostCategory = async (id) => {
  await db.query('DELETE FROM post_category WHERE id = ?', [id]);
};

module.exports = { 
  getAll, 
  getAllBy, 
  create,
  deletePostCategory
};
