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

CategoryRouter.post('/new', upload.single('categoryImage'), (req, res) => {
  const { Name, Description } = JSON.parse(req.body.category)
  // console.log(Name, Description);
  const url = `/images/category/${req.file.filename}`;
  res.status(200).json({ url, filename: req.file.filename });
});
export { CategoryRouter };