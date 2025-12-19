const db = require('../config/db');

const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM images ORDER BY id DESC');
  return rows;
};

const getAllBy = async (field,value) => {
  const query = `SELECT * FROM images WHERE ${field} = ? ORDER BY id DESC`;
  const [rows] = await db.query(query, [value]);
  return rows;
};

const create = async ({url,alt_text=""}) => {
  const [result] = await db.query(
    'INSERT INTO images (url,alt_text) VALUES (?, ?)',
    [url,alt_text]
  );
  return { id: result.insertId, url, alt_text};
};

const deleteImages = async (id) => {
  await db.query('DELETE FROM images WHERE id = ?', [id]);
};

module.exports = { 
  getAll, 
  getAllBy, 
  create,
  deleteImages
};
