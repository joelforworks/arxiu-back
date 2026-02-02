const db = require('../config/db');

const allowedFields = ['id', 'entity_id', 'image_id'];

const getAll = async () => {
  const result = await db.query(
    'SELECT * FROM entity_image ORDER BY id DESC'
  );
  return result.rows;
};

const getAllBy = async (field, value, entity_type) => {

  if (!allowedFields.includes(field)) {
    throw new Error('Invalid field');
  }

  const query = `
    SELECT * FROM entity_image
    WHERE ${field} = $1
      AND entity_type = $2
    ORDER BY id DESC
  `;

  const result = await db.query(query, [value, entity_type]);
  return result.rows;
};

const create = async ({ entity_type, entity_id, image_id }) => {

  const result = await db.query(
    `INSERT INTO entity_image (entity_type, entity_id, image_id)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [entity_type, entity_id, image_id]
  );

  return {
    id: result.rows[0].id,
    entity_type,
    entity_id,
    image_id
  };
};

const deleteEntityBy = async (field, id) => {

  if (!allowedFields.includes(field)) {
    throw new Error('Invalid field');
  }

  await db.query(
    `DELETE FROM entity_image WHERE ${field} = $1`,
    [id]
  );
};

module.exports = {
  getAll,
  getAllBy,
  create,
  deleteEntityBy
};
