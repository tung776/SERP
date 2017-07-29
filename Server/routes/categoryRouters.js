import { Router } from 'express';
import { NewCategoryValidator } from '../../Shared/validators/index';
import multer from 'multer';
import CategoryModel from '../models/CategoryModel';
import Knex from '../config/knex';
import dataversionHelper from '../helpers/saveNewDataversion';

const CategoryRouter = Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './Server/public/images/categories');
  },
  filename(req, file, cb) {
    const extent = file.originalname.slice(file.originalname.length - 4, file.originalname.length);
    cb(null, `${file.fieldname}-${Date.now()}${extent}`);
  }
});
const upload = multer({ storage });

CategoryRouter.post('/new', upload.single('categoryImage'), (req, res) => {
  debugger;
  const ImageUrl = `/images/category/${req.file.filename}`;
  const { Name, Description } = JSON.parse(req.body.category);
  const { isValid, errors } = NewCategoryValidator(JSON.parse(req.body.category));
  if (isValid) {
    Knex('categories').insert({ name: Name, description: Description, imageUrl: ImageUrl })    
    .then(
      async (data) => {
        console.log('data', data);
        const newDataversion = await dataversionHelper();
        res.json({
          success: true, 
          category: data, 
          dataversion: newDataversion 
        });
      }
    )
    .catch(
      err=> {
        console.log(err);
        res.status(400).json({success: false, error: err});
      }
    )
  }
  
  // console.log(Name, Description);
  
  // res.status(200).json({ url, filename: req.file.filename });
});
export { CategoryRouter };