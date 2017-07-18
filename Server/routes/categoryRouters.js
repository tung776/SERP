import express, { Router } from 'express';
import { NewCategoryValidator } from '../../Shared/validators/index';
import Validator from 'validator';
import multer from 'multer';

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

CategoryRouter.post('/new', /*upload.single('categoryImage'), */ (req, res) => {
   req.on('data', data => console.log("data = ", data));
    req.on('category', cate => console.log("category = ", cate));
    console.log("category = ", req.get('category'));
    console.log( req.body);
    console.log( req.category);
    console.log( req.Description);
  // const { NameCategory, Description } = req.body;
  
  console.log('req.file.filename = ', req.file);
  console.log('req.file = ', req.file);
  console.log()
  const url = `/images/category/${req.file.filename}`;
  res.status(200).json({ url, filename: req.file.filename });
});
export { CategoryRouter };