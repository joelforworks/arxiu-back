const db = require('../config/db');

const allowedFields = ['id', 'title', 'author_id'];

const getAllPosts = async () => {
  const result = await db.query('SELECT * FROM posts ORDER BY id DESC');
  return result.rows;
};

const get = async (field, value) => {
  if (!allowedFields.includes(field)) {
    throw new Error(`Invalid field: ${field}`);
  }

  const query = `
    SELECT
      p.*,
      COALESCE(json_agg(DISTINCT jsonb_build_object('id', i.id, 'url', i.url)) 
               FILTER (WHERE i.id IS NOT NULL), '[]') AS images,
      COALESCE(json_agg(DISTINCT c.id) 
               FILTER (WHERE c.id IS NOT NULL), '[]') AS categories
    FROM posts p
    LEFT JOIN entity_image e ON e.entity_type = 'posts' AND e.entity_id = p.id
    LEFT JOIN images i ON e.image_id = i.id
    LEFT JOIN post_category pc ON pc.post_id = p.id
    LEFT JOIN categories c ON pc.category_id = c.id
    WHERE p.${field} = $1
    GROUP BY p.id
  `;

  const result = await db.query(query, [value]);
  return result.rows;
};

const getAllPostsBy = async (field, value) => {
  if (!allowedFields.includes(field)) {
    throw new Error(`Invalid field: ${field}`);
  }

  const query = `SELECT * FROM posts WHERE ${field} = $1 ORDER BY id DESC`;
  const result = await db.query(query, [value]);
  return result.rows;
};

const getAllPostsByCategory = async (category_id) => {
  const query = `
    SELECT p.*, p.id AS id
    FROM posts p
    INNER JOIN post_category pc ON pc.post_id = p.id
    WHERE pc.category_id = $1
    ORDER BY p.id DESC
  `;
  const result = await db.query(query, [category_id]);
  return result.rows;
};

const createPost = async (title, content, author_id) => {
  if (!title || !content || !author_id) {
    throw new Error('Missing required fields: title, content, or author_id');
  }
  
  const query = `
    INSERT INTO posts (title, content, author_id)
    VALUES ($1, $2, $3)
    RETURNING id
  `;
  const result = await db.query(query, [title, content, author_id]);
  return { id: result.rows[0].id, title, content, author_id };
};

const update = async (id, { title, content, author_id }) => {
  const query = `
    UPDATE posts
    SET title = $1, content = $2, author_id = $3
    WHERE id = $4
  `;
  await db.query(query, [title, content, author_id, id]);
};

module.exports = {
  get,
  getAllPosts,
  getAllPostsBy,
  createPost,
  update,
  getAllPostsByCategory
};
