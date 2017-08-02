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
    console.log("file", file);
    console.log("category = ", req.body);
    const extent = file.originalname.slice(file.originalname.length - 4, file.originalname.length);
    cb(null, `${file.fieldname}-${Date.now()}${extent}`);
  }
});
const upload = multer({ storage });

CategoryRouter.post('/new', upload.single('categoryImage'), async (req, res) => {
  debugger;
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
          //Lưu dữ liệu thất bại, vì vậy cần phải xóa file rác
          if (req.file) {
            const dir = path.resolve('Server/public');
            const filePath = path.resolve(dir + ImageUrl);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
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
  console.log("go here");
  console.log("file = ", req.file);
  let ImageUrl = '';
  if (req.file) {
    ImageUrl = `/images/category/${req.file.filename}`;
  }
  if (!req.body.category) {
    throw new Error('Không tìm thấy nhóm sản phẩm');
  }

  console.log("req.body.category = ", req.body.category);

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
          if (oldCategory.length > 0) {
            oldImage = oldCategory[0].imageUrl;
          }
          newDataversion = await t('dataVersions')
            .returning('*')
            .whereRaw('id = 1')
            .update({
              id: 1, menus, userMenus, roles, categories, units, warehouses, products, customers, customerGroups
            });
          if (ImageUrl !== '') {
            data = await t('categories')
              .returning('*')
              .whereRaw(`id = ${Id}`)
              .update({ name: Name, description: Description, imageUrl: ImageUrl });
            //Xóa ảnh cũ
            const dir = path.resolve('Server/public');
            const filePath = path.resolve(dir + oldImage);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } else {
            data = await t('categories')
              .returning('*')
              .whereRaw(`id = ${Id}`)
              .update({ name: Name, description: Description });
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
      res.status(400).json({ success: false, error: e });
    }
  }
});

CategoryRouter.post('/delete', async (req, res) => {
  debugger;
  const { Id } = req.body;
  let newDataversion;
  console.log('req.body = ', req.body)
  Knex.transaction(async (t) => {
    try {
      debugger;
      const productsOnCategory = await Knex('products')
        .debug(true)
        .where(`categoryId`, Id)
        .catch(function (error) {
          console.error("productsOnCategory error ", error);
        });
      if (productsOnCategory[0]) {
        throw new Error('Bạn cần xóa toàn bộ các sản phẩm thuộc nhóm sản phẩm này trước khi xóa nhóm sản phẩm');
      }
      debugger;
      const dataVersion = await Knex('dataVersions').where('id', 1);
      console.log("dataversion = ", dataVersion);

      let { menus, userMenus, roles, categories, units, warehouses, products, customers, customerGroups } = dataVersion[0];
      categories++;
      newDataversion = await t('dataVersions')
        .returning('*')
        .whereRaw('id = 1')
        .update({
          id: 1, menus, userMenus, roles, categories, units, warehouses, products, customers, customerGroups
        })
        .catch(function (error) {
          console.error(error);
        });
      console.log('newDataversion = ', newDataversion);

      debugger;

      const oldCategories = await Knex('categories')
        .debug(true)
        .where({ id: Id })
        .catch(function (error) {
          console.error("oldcategories error ", error);
        });
      console.log('old categories = ', oldCategories);
      await Knex('categories')
        .transacting(t)
        .debug(true)
        .where({ id: Id })
        .del()
        .catch(function (error) {
          console.error("delete category error: ", error);
        });
      debugger;
      const oldImage = await t('categories')
        .debug(true)
        .returning('imageUrl')
        .where('id', Id)
        .catch(function (error) {
          console.error("get image error ", error);
        });
      debugger;
      if (oldImage[0] && oldImage.length > 0) {
        console.log("oldImage = ", oldImage[0].imageUrl);

        const dir = path.resolve('Server/public');
        const filePath = path.resolve(dir + oldImage[0].imageUrl);
        console.log("filepath = ", filePath);

        debugger;
        if (fs.existsSync(filePath)) {

          fs.unlinkSync(filePath);
          console.log('delete image success!');
          debugger;
        }
      }
      debugger;
    } catch (e) {
      t.rollback();
      res.status(400).json({ success: false, error: e });
    }
  }).then(
    () => {
      res.json({
        success: true,
        dataversion: newDataversion
      });
    }
    ).catch(
    e => console.log(`Error: ${e}`)
    );
});

export { CategoryRouter };
