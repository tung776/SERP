import { Router } from 'express';
import { ProductFormValidator } from '../../Shared/validators/index';
import multer from 'multer';
import Knex from '../config/knex';
import dataversionHelper from '../helpers/saveNewDataversion';
import fs from 'fs';
import path from 'path';
const ProductRouter = Router();

//Xác định nơi lưu ảnh
// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         cb(null, './Server/public/images/products');
//     },
//     filename(req, file, cb) {
//         const extent = file.originalname.slice(file.originalname.length - 4, file.originalname.length);
//         cb(null, `${file.fieldname}-${Date.now()}${extent}`);
//     }
// });
// const upload = multer({ storage });

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

ProductRouter.post('/new', async (req, res) => {
    debugger;
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
    } = stringConvert(req.body);


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
    debugger;
    const { isValid, errors } = ProductFormValidator({
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
    console.log('isValid = ', isValid);
    console.log('errors = ', errors);
    if (isValid) {
        let newDataversion;
        let data;
        try {
            Knex.transaction(async (t) => {
                try {
                    debugger;
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
                            isAvaiable: IsAvaiable
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
                    
                    res.status(400).json({ success: false, error: e });
                }
                );
            //end transaction
        } catch (e) {
            //It failed
        }
    }
});
ProductRouter.post('/update', async (req, res) => {

    let {
        Id,
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
    } = req.body;

    debugger;
    const { isValid, errors } = ProductFormValidator({
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
                    // const oldProduct = await t('products').where('id', Id);
                    debugger;                    
                   
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
