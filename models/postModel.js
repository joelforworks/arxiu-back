const db = require('../config/db');

const getAllPosts = async () => {
  const [rows] = await db.query('SELECT * FROM posts ORDER BY id DESC');
  return rows;
};

const get = async (field,value) => {
  const query = `
    SELECT
      p.*,
      (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', i.id,
              'url', i.url
            )
          )
          FROM entity_image AS e
          INNER JOIN images AS i ON e.image_id = i.id
          WHERE e.entity_type = 'posts' AND e.entity_id = p.id
      ) AS images,
      (
        SELECT JSON_ARRAYAGG(c.id)
        FROM post_category AS pc
        INNER JOIN categories AS c ON pc.category_id = c.id
        WHERE pc.post_id = p.id
      ) AS categories
    FROM posts AS p
    WHERE p.${field} = ?;
  `;
  const [rows] = await db.query(query, [value]);
  return rows;
}

const getAllPostsBy = async (field,value) => {
  const query = `SELECT * FROM posts WHERE ${field} = ? ORDER BY id DESC`;
  const [rows] = await db.query(query, [value]);
  return rows;
};

const getAllPostsByCategory = async (category_id) => {
  const query = `SELECT *,posts.id AS id FROM posts INNER JOIN post_category ON post_category.post_id = posts.id WHERE post_category.category_id = ? ORDER BY posts.id DESC`;
  const [rows] = await db.query(query, [category_id]);
  return rows;
};

const createPost = async (title, content,author_id) => {
  const [result] = await db.query(
    'INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)',
    [title, content, author_id]
  );
  return { id: result.insertId, title, content, author_id };
};

const update = async (id, {title,content,author_id}) => {
  await db.query(
    'UPDATE posts SET title=?, content=?, author_id=? WHERE id = ?',
    [title,content,author_id, id]
  );
};

module.exports = { 
  get,
  getAllPosts, 
  getAllPostsBy, 
  createPost,
  update,
  getAllPostsByCategory
};
