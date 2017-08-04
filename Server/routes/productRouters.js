import { Router } from 'express';
import { ProductFormValidator } from '../../Shared/validators/index';
import multer from 'multer';
import Knex from '../config/knex';
import dataversionHelper from '../helpers/saveNewDataversion';
import fs from 'fs';
import path from 'path';
const ProductRouter = Router();

//Xác định nơi lưu ảnh
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './Server/public/images/products');
    },
    filename(req, file, cb) {
        const extent = file.originalname.slice(file.originalname.length - 4, file.originalname.length);
        cb(null, `${file.fieldname}-${Date.now()}${extent}`);
    }
});
const upload = multer({ storage });

const stringConvert = ({
    CategoryId,
    UnitId,
    TypeCargoId,
    IsPublic,
    PurchasePrice,
    SalePrice,
    MinQuantity,
    IsAvaiable,
    Name,
    Description
    }) => ({
        CategoryId: parseInt(CategoryId),
        UnitId: parseInt(UnitId),
        TypeCargoId: parseInt(TypeCargoId),
        IsPublic: JSON.parse(IsPublic),
        IsAvaiable: JSON.parse(IsAvaiable),
        PurchasePrice: parseFloat(PurchasePrice),
        SalePrice: parseFloat(SalePrice),
        MinQuantity: parseFloat(MinQuantity),
        Name,
        Description
    });

ProductRouter.post('/new', upload.single('productImage'), async (req, res) => {
    let ImageUrl = '';
    if (req.file) {
        ImageUrl = `/images/products/${req.file.filename}`;
    }
    let {
        CategoryId,
        UnitId,
        TypeCargoId,
        Name,
        Description,
        IsPublic,
        PurchasePrice,
        SalePrice,
        MinQuantity,
        IsAvaiable
    } = stringConvert(JSON.parse(req.body.product));


    console.log({
        CategoryId,
        UnitId,
        TypeCargoId,
        Name,
        Description,
        IsPublic,
        PurchasePrice,
        SalePrice,
        MinQuantity,
        IsAvaiable
    });

    const { isValid, errors } = ProductFormValidator(JSON.parse(req.body.product));
    console.log('isValid = ', isValid);
    console.log('errors = ', errors);
    if (isValid) {
        let newDataversion;
        let data;
        try {
            Knex.transaction(async (t) => {
                try {
                    const dataVersion = await Knex('dataVersions').where('id', 1);
                    debugger;
                    let { menus, userMenus, roles, categories,
                        units, warehouses, products, customers,
                        customerGroups } = dataVersion[0];

                    products++;
                    newDataversion = await t('dataVersions')
                        .returning('*')
                        .whereRaw('id = 1')
                        .update({
                            id: 1,
                            menus,
                            userMenus,
                            roles,
                            categories,
                            units,
                            warehouses,
                            products,
                            customers,
                            customerGroups
                        });
                    debugger;
                    data = await t('products')
                        .returning('*')
                        .insert({
                            categoryId: CategoryId,
                            unitId: UnitId,
                            typeCargoId: TypeCargoId,
                            name: Name,
                            description: Description,
                            isPublic: IsPublic,
                            purchasePrice: PurchasePrice,
                            salePrice: SalePrice,
                            minQuantity: MinQuantity,
                            isAvaiable: IsAvaiable,
                            imageUrl: ImageUrl
                        });
                    debugger;
                } catch (e) {
                    t.rollback();
                    console.log(e);
                    res.status(400).json({ success: false, error: e });
                }
            }).then(
                () => {
                    res.json({
                        success: true,
                        product: data,
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
ProductRouter.post('/update', upload.single('productImage'), async (req, res) => {
    let ImageUrl = '';
    if (req.file) {
        ImageUrl = `/images/products/${req.file.filename}`;
    }
    if (!req.body.product) {
        throw new Error('Không tìm thấy sản phẩm');
    }

    let {
        CategoryId,
        UnitId,
        TypeCargoId,
        Name,
        Description,
        IsPublic,
        PurchasePrice,
        SalePrice,
        MinQuantity,
        IsAvaiable
    } = stringConvert(JSON.parse(req.body.product));

    const { Id } = JSON.parse(req.body.product);
    debugger;
    const { isValid, errors } = ProductFormValidator(JSON.parse(req.body.product));

    if (isValid) {
        let newDataversion;
        let data;
        try {
            Knex.transaction(async (t) => {
                try {
                    const dataVersion = await Knex('dataVersions').where('id', 1);
                    debugger;
                    let { menus, userMenus, roles,
                        categories, units, warehouses, products,
                        customers, customerGroups } = dataVersion[0];

                    products++;

                    newDataversion = await t('dataVersions')
                        .returning('*')
                        .whereRaw('id = 1')
                        .update({
                            id: 1,
                            menus,
                            userMenus,
                            roles,
                            categories,
                            units,
                            warehouses,
                            products,
                            customers,
                            customerGroups
                        });
                    debugger;
                    const oldProduct = await t('products').where('id', Id);
                    debugger;
                    let oldImage;
                    if (oldProduct.length > 0) {
                        oldImage = oldProduct[0].imageUrl;
                    }
                    if (req.file) {
                        data = await t('products')
                            .returning('*')
                            .whereRaw(`id = ${Id}`)
                            .update({
                                categoryId: CategoryId,
                                unitId: UnitId,
                                typeCargoId: TypeCargoId,
                                name: Name,
                                description: Description,
                                isPublic: IsPublic,
                                purchasePrice: PurchasePrice,
                                salePrice: SalePrice,
                                minQuantity: MinQuantity,
                                isAvaiable: IsAvaiable,
                                imageUrl: ImageUrl
                            });
                    } else {
                        data = await t('products')
                            .returning('*')
                            .whereRaw(`id = ${Id}`)
                            .update({
                                categoryId: CategoryId,
                                unitId: UnitId,
                                typeCargoId: TypeCargoId,
                                name: Name,
                                description: Description,
                                isPublic: IsPublic,
                                purchasePrice: PurchasePrice,
                                salePrice: SalePrice,
                                minQuantity: MinQuantity,
                                isAvaiable: IsAvaiable
                            });
                    }
                    debugger;
                    //Xóa ảnh cũ
                    if (req.file && oldImage.indexOf('images/products') > 0) {
                        const dir = path.resolve('Server/public');
                        const filePath = path.resolve(dir + oldImage);
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                    }
                    debugger;
                } catch (e) {
                    t.rollback();
                    console.log(e);
                    res.status(400).json({ success: false, error: e });
                }
            }).then(
                () => {
                    res.json({
                        success: true,
                        product: data,
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

ProductRouter.post('/delete', async (req, res) => {
    debugger;
    const { Id } = req.body;
    let newDataversion;
    debugger;
    Knex.transaction(async (t) => {
        try {
            const dataVersion = await Knex('dataVersions').where('id', 1);
            debugger;
            let { menus, userMenus, roles, categories,
                units, warehouses, products, customers,
                customerGroups } = dataVersion[0];
            products++;
            newDataversion = await t('dataVersions')
                .returning('*')
                .whereRaw('id = 1')
                .update({
                    id: 1,
                    menus,
                    userMenus,
                    roles,
                    categories,
                    units,
                    warehouses,
                    products,
                    customers,
                    customerGroups
                })
                .catch((error) => {
                    console.error(error);
                });
            debugger;
            const oldProduct = await Knex('products')
                .debug(true)
                .where({ id: Id })
                .catch((error) => {
                    console.error('oldProduct error ', error);
                });
            debugger;
            await Knex('products')
                .transacting(t)
                .debug(true)
                .where({ id: Id })
                .del()
                .catch((error) => {
                    console.error('delete product error: ', error);
                });
            debugger;
            if (oldProduct[0] && oldProduct[0].imageUrl.indexOf('images/products') > 0) {
                debugger
                const dir = path.resolve('Server/public');
                const filePath = path.resolve(dir + oldProduct[0].imageUrl);
                if (fs.existsSync(filePath)) {
                    debugger;
                    fs.unlinkSync(filePath);
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

export default ProductRouter;
