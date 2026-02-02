const db = require('../config/db');

const allowedFields = ['id', 'url'];

const getAll = async () => {
  const result = await db.query(
    'SELECT * FROM images ORDER BY id DESC'
  );
  return result.rows;
};

const getAllBy = async (field, value) => {

  if (!allowedFields.includes(field)) {
    throw new Error('Invalid field');
  }

  const query = `
    SELECT * FROM images
    WHERE ${field} = $1
    ORDER BY id DESC
  `;

  const result = await db.query(query, [value]);
  return result.rows;
};

const create = async ({ url, alt_text = "" }) => {

  const result = await db.query(
    `INSERT INTO images (url, alt_text)
     VALUES ($1, $2)
     RETURNING id`,
    [url, alt_text]
  );

  return {
    id: result.rows[0].id,
    url,
    alt_text
  };
};

const deleteImages = async (id) => {
  await db.query(
    'DELETE FROM images WHERE id = $1',
    [id]
  );
};

module.exports = {
  getAll,
  getAllBy,
  create,
  deleteImages
};
