import { Router } from 'express';
import { NewCategoryValidator } from '../../Shared/validators/index';
import multer from 'multer';
import CategoryModel from '../models/CategoryModel';
import Knex from '../config/knex';
import dataversionHelper from '../helpers/saveNewDataversion';
import fs from 'fs';
import path from 'path';
const CategoryRouter = Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './Server/public/images/category');
  },
  filename(req, file, cb) {
    const extent = file.originalname.slice(file.originalname.length - 4, file.originalname.length);
    cb(null, `${file.fieldname}-${Date.now()}${extent}`);
  }
});
const upload = multer({ storage });

CategoryRouter.post('/new', upload.single('categoryImage'), async (req, res) => { 
  let ImageUrl = '';
  if (req.file) {
    ImageUrl = `/images/category/${req.file.filename}`;
  }
  const { Name, Description } = JSON.parse(req.body.category);
  const { isValid, errors } = NewCategoryValidator(JSON.parse(req.body.category));

  if (isValid) {
    let newDataversion;
    let data;
    try {

      Knex.transaction(async (t) => {
        try {
          const dataVersion = await Knex('dataVersions').where('id', 1);

          let { menus, userMenus, roles, categories, units, warehouses, products, customers, customerGroups } = dataVersion[0];
          categories++;
          data = await t('categories')
            .returning('*')
            .insert({ name: Name, description: Description, imageUrl: ImageUrl });
          newDataversion = await t('dataVersions')
            .returning('*')
            .whereRaw('id = 1')
            .update({
              id: 1, menus, userMenus, roles, categories, units, warehouses, products, customers, customerGroups
            });            
        } catch (e) {
          t.rollback();
          console.log(e);
          res.status(400).json({ success: false, error: e });
        }
      }).then(
        () => {
          res.json({
            success: true,
            category: data,
            dataversion: newDataversion
          });
        }
        )
        .catch(
        e => {
          res.status(400).json({ success: false, error: e });
        }
        );
      //end transaction
    } catch (e) {
      //It failed
    }
  }
});
CategoryRouter.post('/update', upload.single('categoryImage'), async (req, res) => { 
  let ImageUrl = '';
  if (req.file) {
    ImageUrl = `/images/category/${req.file.filename}`;
  }
  const { Id, Name, Description } = JSON.parse(req.body.category);
  const { isValid, errors } = NewCategoryValidator(JSON.parse(req.body.category));

  if (isValid) {
    let newDataversion;
    let data;
    try {
      Knex.transaction(async (t) => {
        try {
          const dataVersion = await Knex('dataVersions').where('id', 1);

          let { menus, userMenus, roles, categories, units, warehouses, products, customers, customerGroups } = dataVersion[0];
          categories++;
          const oldCategory = await t('categories').where('id', Id);
          
          let oldImage;
          if(oldCategory.length > 0) {
            oldImage = oldCategory[0].imageUrl;
          } 
          data = await t('categories')
            .returning('*')
            .whereRaw(`id = ${Id}`)
            .update({ name: Name, description: Description, imageUrl: ImageUrl });

          newDataversion = await t('dataVersions')
            .returning('*')
            .whereRaw('id = 1')
            .update({
              id: 1, menus, userMenus, roles, categories, units, warehouses, products, customers, customerGroups
            });

          //Xóa ảnh cũ
          const dir = path.resolve('Server/public');
          const filePath = path.resolve(dir + oldImage); 
          if(fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

        } catch (e) {
          t.rollback();
          console.log(e);
          res.status(400).json({ success: false, error: e });
        }
      }).then(
        () => {
          res.json({
            success: true,
            category: data,
            dataversion: newDataversion
          });
        }
        )
        .catch(
        e => {
          res.status(400).json({ success: false, error: e });
        }
        );
      //end transaction
    } catch (e) {
      //It failed
    }
  }
});
export { CategoryRouter };
