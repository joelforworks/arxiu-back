//const mysql = require('mysql2/promise'); require('dotenv').config();
//
//const pool = mysql.createPool({
//  host: process.env.DB_HOST,
//  user: process.env.DB_USER,
//  password: process.env.DB_PASSWORD,
//  database: process.env.DB_NAME
//});
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
});

const initOnConnect = async () => {
  const client = await pool.connect();
  try {
    console.log("✅ PostgreSQL connected");
    
      console.log("🔄 Initializing database tables...");
      
      await client.query(`
        DROP TABLE IF  EXISTS post_category CASCADE;
        DROP TABLE IF  EXISTS entity_image CASCADE;
        DROP TABLE IF  EXISTS images CASCADE;
        DROP TABLE IF  EXISTS categories CASCADE;
        DROP TABLE IF  EXISTS users CASCADE;
        DROP TABLE IF  EXISTS posts CASCADE;
        DROP TABLE IF  EXISTS authors CASCADE;
      `);
      
      await client.query(`
        CREATE TABLE authors (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          description VARCHAR(255)
        );
      `);
      
      await client.query(`
        CREATE TABLE posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          author_id INTEGER,
          CONSTRAINT fk_authors
            FOREIGN KEY (author_id)
            REFERENCES authors(id)
        );
      `);
      
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL
        );
      `);
      
      await client.query(`
        CREATE TABLE categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        );
      `);
      
      await client.query(`
        CREATE TABLE images (
          id SERIAL PRIMARY KEY,
          url VARCHAR(255) NOT NULL,
          alt_text VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      await client.query(`
        CREATE TABLE entity_image (
          id SERIAL PRIMARY KEY,
          entity_type VARCHAR(255) NOT NULL,
          entity_id INTEGER NOT NULL,
          image_id INTEGER NOT NULL,
          CONSTRAINT fk_entity_image_image
            FOREIGN KEY (image_id)
            REFERENCES images(id)
            ON DELETE CASCADE
        );
      `);
      
      await client.query(`
        CREATE TABLE post_category (
          id SERIAL PRIMARY KEY,
          post_id INTEGER NOT NULL,
          category_id INTEGER NOT NULL,
          CONSTRAINT fk_post_category_post
            FOREIGN KEY (post_id)
            REFERENCES posts(id)
            ON DELETE CASCADE,
          CONSTRAINT fk_post_category_category
            FOREIGN KEY (category_id)
            REFERENCES categories(id)
            ON DELETE CASCADE
        );
      `);
      await client.query(`
        INSERT INTO users (username, password) VALUES ('joeladmin', '$2a$12$slELhEvc.R.u6i8JpwFrFOtQDIlSG44/ZpNJLql6NPsXYAlvGgatW');
      `);
      
      console.log("✅ Database tables created successfully");
  } catch (err) {
    console.error("❌ Database initialization error:", err.message);
  } finally {
    client.release();
  }
};

// Initialize on startup
initOnConnect().catch(console.error);

module.exports = pool;
