const db = require('../config/db');

const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM entity_image ORDER BY id DESC');
  return rows;
};

const getAllBy = async (field,value,entity_type) => {
  const query = `SELECT * FROM entity_image WHERE ${field} = ? AND entity_type = '${entity_type}' ORDER BY id DESC`;
  const [rows] = await db.query(query, [value]);
  return rows;
};

const create = async ({entity_type,entity_id,image_id}) => {
  const [result] = await db.query(
    'INSERT INTO entity_image (entity_type,entity_id,image_id) VALUES (?, ?, ?)',
    [entity_type,entity_id,image_id]
  );
  return { id: result.insertId, entity_type,entity_id,image_id};
};

const deleteEntityBy = async (field,id) => {
  await db.query(`DELETE FROM entity_image WHERE ${field} = ?`, [id]);
};

module.exports = { 
  getAll, 
  getAllBy, 
  create,
  deleteEntityBy
};
