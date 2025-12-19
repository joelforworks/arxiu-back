const db = require('../config/db');

const findUserByUsername = async (username) => {
  const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

const findUserBy = async (field,value) => {
  const query = `SELECT * FROM users WHERE ${field} = ? ORDER BY id DESC`;
  const [rows] = await db.query(query, [value]);
  return rows[0];
};

const createUser = async (username, passwordHash) => {
  const [result] = await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, passwordHash]);
  return { id: result.insertId, username };
};

module.exports = { 
  findUserByUsername, 
  createUser,
  findUserBy
};
