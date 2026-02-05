const db = require('../config/db');

const getAllPosts = async () => {
  const [rows] = await db.query('SELECT * FROM posts ORDER BY id DESC');
  return rows;
};

const get = async (field,value) => {
  const query = `
    SELECT 
      p.*,
      GROUP_CONCAT(DISTINCT CONCAT(i.id, ':', i.url) SEPARATOR ',') AS images,
      GROUP_CONCAT(DISTINCT pc.category_id SEPARATOR ',') AS categories
    FROM posts AS p
    LEFT JOIN entity_image AS e 
           ON e.entity_type = 'posts' AND e.entity_id = p.id
    LEFT JOIN images AS i 
           ON e.image_id = i.id
    LEFT JOIN post_category AS pc 
           ON pc.post_id = p.id
    WHERE p.${field} = ?
    GROUP BY p.id;
  `;
 const [rows] = await db.query(query, [value]);

  rows.forEach(post => {

      // IMAGES
      if (post.images && post.images.length > 0) {
        post.images = post.images.split(',').map(str => {
          const [id, url] = str.split(':');
          return {
            id: Number(id),
            url
          };
        });
      } else {
        post.images = [];
      }

      // CATEGORIES
      if (post.categories && post.categories.length > 0) {
        post.categories = post.categories
          .split(',')
          .map(id => Number(id));
      } else {
        post.categories = [];
      }

    });
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
