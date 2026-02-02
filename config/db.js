const mysql = require('mysql2/promise'); require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
//const { Pool } = require("pg");
//require("dotenv").config();
//
//const pool = new Pool({
//  host: process.env.DB_HOST,
//  user: process.env.DB_USER,
//  password: process.env.DB_PASSWORD,
//  database: process.env.DB_NAME,
//  port: process.env.DB_PORT || 5432,
//  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
//});
//pool.connect()
//  .then(client => {
//    console.log("✅ PostgreSQL connected");
//    client.release();
//  })
//  .catch(err => {
//    console.error("❌ PostgreSQL connection error:", err.message);
//  });


module.exports = pool;
