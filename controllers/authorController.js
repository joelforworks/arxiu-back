const authorModel = require('../models/authorModel');
const imageModel = require('../models/imageModel');
const entity_imageModel = require('../models/entity_imageModel');
const cloudinary = require('../config/cloudinary');

exports.getAll = async (req, res) => {
  try {
    const authors = await authorModel.getAll();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching authors' });
  }
};

exports.get = async (req, res) => {
  try {
    const [author] = await authorModel.get('id',req.params.id);
    res.json(author);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching authors' });
  }
};

exports.create = async (req, res) => {
  try {
    const {name,description} = req.body;
    const newAuthor = await authorModel.create({name,description});

    const images = req.files?.cover
      ? Array.isArray(req.files.cover)
          ? req.files.cover
          : [req.files.cover]
      : [];

    await Promise.all(
      images?.map(async (image)=>{

        const base64Image = `data:${image.mimetype};base64,${image.data.toString('base64')}`;
        const result = await cloudinary.uploader.upload(base64Image, {
          folder: 'authors',
          use_filename: true,
          unique_filename: false,
        });
        imageUrl = result.secure_url;

        const imageResult = await imageModel.create({url:imageUrl});
        
        await entity_imageModel.create({
          entity_type:"authors",
          entity_id:newAuthor.id,
          image_id:imageResult.id
        })

      })
    );

    res.json(newAuthor);
  } catch (err) {
    res.status(500).json({ error: `Error creating author: ${err}` });
  }
};

exports.update = async (req, res) => {
  try {
    const { name,description } = req.body;
    const author = await authorModel.update(req.params.id, {name,description});
    const relationImage = await entity_imageModel.getAllBy('entity_id',author.id,'authors');
    
    const images = req.files?.cover
      ? Array.isArray(req.files.cover)
          ? req.files.cover
          : [req.files.cover]
      : [];

    await Promise.all(
      // remover all images
      relationImage?.map(async(relation)=>{
        await imageModel.deleteImages(relation.image_id);
        await entity_imageModel.deleteEntity(relation.id);
      }),
      // add update images
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
          entity_type:"authors",
          entity_id:author.id,
          image_id:imageResult.id
        })
      })
    )
    
    res.json({ message: 'Author updated' });
  } catch (err) {
    res.status(500).json({ error: `Error updating author: ${err}` });
  }
};

exports.delete = async (req, res) => {
  try {
    await authorModel.deleteAuthor(req.params.id);
    res.json({ message: 'Author deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting author' });
  }
};
