const db = require('../config/db');

const allowedFields = ['id', 'name'];

const getAll = async () => {
  const result = await db.query(
    'SELECT * FROM authors ORDER BY id DESC'
  );
  return result.rows;
};

const get = async (field, value) => {

  if (!allowedFields.includes(field)) {
    throw new Error('Invalid field');
  }

  const query = `
    SELECT
      p.*,
      (
        SELECT json_agg(i.url)
        FROM entity_image e
        JOIN images i ON e.image_id = i.id
        WHERE e.entity_type = 'authors'
          AND e.entity_id = p.id
      ) AS cover
    FROM authors p
    WHERE p.${field} = $1
  `;

  const result = await db.query(query, [value]);
  return result.rows;
};

const getAllBy = async (field, value) => {

  if (!allowedFields.includes(field)) {
    throw new Error('Invalid field');
  }

  const query = `
    SELECT * FROM authors
    WHERE ${field} = $1
    ORDER BY id DESC
  `;

  const result = await db.query(query, [value]);
  return result.rows;
};

const create = async ({ name, description }) => {

  const result = await db.query(
    `INSERT INTO authors (name, description)
     VALUES ($1, $2)
     RETURNING id`,
    [name, description]
  );

  return { id: result.rows[0].id, name, description };
};

const update = async (id, { name, description }) => {

  await db.query(
    `UPDATE authors
     SET name = $1, description = $2
     WHERE id = $3`,
    [name, description, id]
  );

  return { id, name, description };
};

const deleteAuthor = async (id) => {
  await db.query(
    'DELETE FROM authors WHERE id = $1',
    [id]
  );
};

module.exports = {
  get,
  getAll,
  getAllBy,
  create,
  update,
  deleteAuthor
};
