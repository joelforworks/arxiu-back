const db = require('../config/db');

const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM authors ORDER BY id DESC');
  return rows;
};

const get = async (field,value) => {
  const query = `
    SELECT
      p.*,
      (
          SELECT JSON_ARRAYAGG(i.url)
          FROM entity_image AS e
          INNER JOIN images AS i ON e.image_id = i.id
          WHERE e.entity_type = 'authors' AND e.entity_id = p.id
      ) AS cover
    FROM authors AS p
    WHERE p.${field} = ?;
  `;
  const [rows] = await db.query(query, [value]);
  return rows;
}

const getAllBy = async (field,value) => {
  const query = `SELECT * FROM authors WHERE ${field} = ? ORDER BY id DESC`;
  const [rows] = await db.query(query, [value]);
  return rows;
};


const create = async ({name,description}) => {
  const [result] = await db.query(
    'INSERT INTO authors (name,description) VALUES (?, ?)',
    [name,description]
  );
  return { id: result.insertId, name, description};
};

const update = async (id, { name, description }) => {
  await db.query(
    'UPDATE authors SET name = ? , description = ? WHERE id = ?',
    [name, description, id]
  );

  return { id, name, description };
};

const deleteAuthor = async (id) => {
  await db.query('DELETE FROM authors WHERE id = ?', [id]);
};


module.exports = { 
  get,
  getAll, 
  getAllBy, 
  create,
  update,
  deleteAuthor
};
