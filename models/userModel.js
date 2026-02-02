const db = require('../config/db');

const findUserByUsername = async (username) => {
  const result = await db.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0];
};

const findUserBy = async (field, value) => {

  const allowedFields = ['id', 'username', 'email'];

  if (!allowedFields.includes(field)) {
    throw new Error('Invalid field');
  }

  const query = `
    SELECT * FROM users
    WHERE ${field} = $1
    ORDER BY id DESC
  `;

  const result = await db.query(query, [value]);
  return result.rows[0];
};

const createUser = async (username, passwordHash) => {

  const result = await db.query(
    `INSERT INTO users (username, password)
     VALUES ($1, $2)
     RETURNING id`,
    [username, passwordHash]
  );

  return { id: result.rows[0].id, username };
};

module.exports = {
  findUserByUsername,
  createUser,
  findUserBy
};
