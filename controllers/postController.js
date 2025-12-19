const db = require('../config/db');
const postModel = require('../models/postModel');
const postCategoryModel = require('../models/postCategoryModel');
const categoryModel = require('../models/categoryModel');
const imageModel = require('../models/imageModel');
const entity_imageModel = require('../models/entity_imageModel');
const cloudinary = require('../config/cloudinary');

exports.getPosts = async (req, res) => {
  try {
    const {category_id} = req.query;

    let posts =[];
    if(category_id > 0){
      posts = await postModel.getAllPostsByCategory(category_id);
    }
    else{
      [posts] = await db.query('SELECT * FROM posts');
    }
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: `Error fetching posts ${err}` });
  }
};


exports.getPostById = async (req, res) => {
  try {
    const post = await postModel.get('id',req.params.id)
    if (!post.length) return res.status(404).json({ error: 'Post not found' });
    res.json(post[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching post' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { 
      title, 
      content, 
      categories,
      author_id,
    } = req.body;

    const images = req.files?.newImages
      ? Array.isArray(req.files.newImages)
          ? req.files.newImages
          : [req.files.newImages]
      : [];

    const [postResult] = await db.query(
      'INSERT INTO posts (title, content, author_id) VALUES (?,?,?)',
      [
        title, 
        content, 
        author_id,
      ]
    );

    // contver string array to real array
    const categoriesParse = JSON.parse(categories);
    const categoriesArray = categoriesParse
      ? Array.isArray(categoriesParse)
          ? categoriesParse
          : [categoriesParse]
      : [];
    if(categoriesArray){
      categoriesParse.map(async(category_id)=>{
        await postCategoryModel.create({
          post_id: postResult.insertId,
          category_id
        });
      })
    }


    await Promise.all(
      images?.map(async (image)=>{

        const base64Image = `data:${image.mimetype};base64,${image.data.toString('base64')}`;
        const result = await cloudinary.uploader.upload(base64Image, {
          folder: 'posts',
          use_filename: true,
          unique_filename: false,
        });
        imageUrl = result.secure_url;

        const imageResult = await imageModel.create({url:imageUrl});
        
        await entity_imageModel.create({
          entity_type:"posts",
          entity_id:postResult.insertId,
          image_id:imageResult.id
        })

      })
    );

    res.json({
      id: postResult.insertId,
      title, 
      content, 
      author_id, 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Error creating post: ${err}` });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { 
      title, 
      content, 
      author_id,
      categories,
      currentImages
    } = req.body;



    await postModel.update(postId, { title, content, author_id });

    const newImages = req.files?.newImages
      ? Array.isArray(req.files.newImages)
          ? req.files.newImages
          : [req.files.newImages]
      : [];

    // images
    const relationImages = await entity_imageModel.getAllBy(
      "entity_id",
      postId,
      "posts"
    );
    const parsedCurrentImages = JSON.parse(currentImages || "[]");
    const imagesToRemove = relationImages.filter(
      rel => !parsedCurrentImages.some(img => Number(rel.image_id) === Number(img.id))
    );

    //categories
    const postCategories = await postCategoryModel.getAllBy('post_id',postId)
    const parsedCategories = Array.isArray(categories)
      ? categories
      : JSON.parse(categories || "[]");
    const categoriesToRemove = postCategories.filter(
      rel => !parsedCategories.some(img => Number(rel.category_id) === Number(img))
    );
    const newCategories = parsedCategories.filter(
      cat => !postCategories.some(rel => Number(rel.category_id) === Number(cat))
    );

    await Promise.all([
      // remove images
      ...imagesToRemove.map(async img => {
        await imageModel.deleteImages(img.image_id);
        await entity_imageModel.deleteEntityBy("image_id", img.id);
      }),
      //remove categories
      ...categoriesToRemove.map(async relation => {
        await postCategoryModel.deletePostCategory(relation.id);
      }),
      ...newCategories.map(async category =>{
        await postCategoryModel.create({post_id:postId,category_id:category});
      }),

      // add new images
      ...newImages.map(async image => {
        const base64Image = `data:${image.mimetype};base64,${image.data.toString("base64")}`;

        const result = await cloudinary.uploader.upload(base64Image, {
          folder: "posts",
          use_filename: true,
          unique_filename: false,
        });

        const imageUrl = result.secure_url;

        const imageResult = await imageModel.create({ url: imageUrl });

        await entity_imageModel.create({
          entity_type: "posts",
          entity_id: postId,
          image_id: imageResult.id,
        });
      }),
    ]);

    res.json({ message: "Post updated" });
  } catch (err) {
    res.status(500).json({ error: `Error updating post: ${err}` });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting post' });
  }
};
