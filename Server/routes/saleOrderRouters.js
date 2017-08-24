import { Router } from 'express';
import { NewSaleOrderValidator } from '../../Shared/validators/index';
import Knex from '../config/knex';
import dataversionHelper from '../helpers/saveNewDataversion';
import fs from 'fs';
import path from 'path';
import moment from '../../Shared/utils/moment';

const SaleOrderRouter = Router();

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

SaleOrderRouter.post('/new', async (req, res) => {
    debugger;
    let {
        date, title, customerId, total, totalIncludeVat, vat, pay,
        newDebt, oldebt, saleOderDetails, debtCustomerId
    } = req.body;


    console.log({
        date, title, customerId, total, totalIncludeVat, vat, pay,
        newDebt, oldebt, saleOderDetails,
    });
    debugger;
    const { isValid, errors } = NewSaleOrderValidator({
        date, title, customerId, total, totalIncludeVat, vat, pay,
        newDebt, oldebt, saleOderDetails,
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
                    let { debtCustomers } = dataVersion[0];

                    debtCustomers++;

                    newDataversion = await t('dataVersions')
                        .returning('*')
                        .whereRaw('id = 1')
                        .update({
                            id: 1,
                            debtCustomers
                        });
                    order = await t('saleOrders')
                        .returning('*')
                        .insert({
                            customerId: customerId,
                            userId: userId,
                            debtCustomerId: debtCustomerId,
                            orderTypeId: 0,
                            title: title,
                            total: total,
                            vat: vat,
                            totalIncludeVat: totalIncludeVat,
                            minQuantity: MinQuantity,
                            date: moment(date, 'DD-MM-YYYY')
                        });
                    debugger;
                    saleOderDetails.forEach(async (detail) => {
                        await t('saleOderDetails')
                            .returning('*')
                            .insert({
                                saleOrderId: order[0].id,
                                productId: detail.productId,
                                unitId: detail.unitId,
                                quantity: detail.quantity,
                                salePrice: detail.salePrice,
                                total: detail.quantity * detail.salePrice
                            });
                    });

                    data = await t('debtCustomers')
                        .returning('*')
                        .insert({
                            customerId: customerId,
                            createdDate: moment(date, 'DD-MM-YYYY'),
                            title: title,
                            newDebt: newDebt,
                            oldDebt: oldebt,
                            minus: pay,
                            plus: totalIncludeVat
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
                        debtCustomers: data,
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
SaleOrderRouter.post('/update', async (req, res) => {

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
    const { isValid, errors } = NewSaleOrderValidator({
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
                    // const oldSaleOrder = await t('products').where('id', Id);
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

SaleOrderRouter.post('/delete', async (req, res) => {
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
            const oldSaleOrder = await Knex('products')
                .debug(true)
                .where({ id: Id })
                .catch((error) => {
                    console.error('oldSaleOrder error ', error);
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

export default SaleOrderRouter;
