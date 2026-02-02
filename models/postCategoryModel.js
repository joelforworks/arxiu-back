const db = require('../config/db');

const allowedFields = ['id', 'post_id', 'category_id'];

const getAll = async () => {
  const result = await db.query(
    'SELECT * FROM post_category ORDER BY id DESC'
  );
  return result.rows;
};

const getAllBy = async (field, value) => {

  if (!allowedFields.includes(field)) {
    throw new Error('Invalid field');
  }

  const query = `
    SELECT * FROM post_category
    WHERE ${field} = $1
    ORDER BY id DESC
  `;

  const result = await db.query(query, [value]);
  return result.rows;
};

const create = async ({ post_id, category_id }) => {

  const result = await db.query(
    `INSERT INTO post_category (post_id, category_id)
     VALUES ($1, $2)
     RETURNING id`,
    [post_id, category_id]
  );

  return {
    id: result.rows[0].id,
    post_id,
    category_id
  };
};

const deletePostCategory = async (id) => {
  await db.query(
    'DELETE FROM post_category WHERE id = $1',
    [id]
  );
};

module.exports = {
  getAll,
  getAllBy,
  create,
  deletePostCategory
};
