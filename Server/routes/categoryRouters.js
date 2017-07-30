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

CategoryRouter.post('/new', upload.single('categoryImage'), async (req, res) => {
  debugger;
  const ImageUrl = `/images/category/${req.file.filename}`;
  const { Name, Description } = JSON.parse(req.body.category);
  const { isValid, errors } = NewCategoryValidator(JSON.parse(req.body.category));
  if (isValid) {
    let newDataversion, data;
    try {
      // var t = Knex.transaction();
      Knex.transaction(async(t)=> {
        try {
          data = await Knex('categories')
            .transacting(t)
            .returning('*')
            .insert({ name: Name, description: Description, imageUrl: ImageUrl })
          newDataversion = dataversionHelper('categories', t)

          t.commit();
          
        }
        catch (e) {
          t.rollback();
          console.log(e);
          res.status(400).json({ success: false, error: e });
        }
      }).then(
        ()=> {
          res.json({
            success: true,
            category: data,
            dataversion: newDataversion
          });
        }
      )
      .catch(e => console.log(e));
      //end transaction

    }
    catch (e) {
      //It failed
    }

  }
});
export { CategoryRouter };