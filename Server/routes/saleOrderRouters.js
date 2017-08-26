import { Router } from 'express';
import { NewSaleOrderValidator } from '../../Shared/validators/index';
import Knex from '../config/knex';
import dataversionHelper from '../helpers/saveNewDataversion';
import fs from 'fs';
import path from 'path';
import moment from '../../Shared/utils/moment';

const SaleOrderRouter = Router();

SaleOrderRouter.post('/getById', async (req, res) => {
    const { orderId } = req.body;

    try {
        console.log('id = ', orderId);
        const saleOrder = await Knex('saleOrders')
            .where({ id: orderId });

        const saleOrderDetails = await Knex.raw(`
            SELECT "id" , "saleOrderId", "productId", "unitId", "quantity", "salePrice" 
            FROM "saleOderDetails" 
            WHERE "saleOrderId" = ${orderId};                      
        `);
        console.log('saleOrderDetails = ', saleOrderDetails);
        res.status(200).json({
            success: true,
            saleOrder,
            saleOrderDetails: saleOrderDetails.rows
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({
            success: false
        });
    }

});

SaleOrderRouter.post('/getByCustomerId', async (req, res) => {
    const { customerId } = req.body;

    try {
        const orders = await Knex('saleOrders')
            .where({ customerId });
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({
            success: false
        });
    }

});

SaleOrderRouter.post('/new', async (req, res) => {
    let {
        date, title, customerId, total, totalIncludeVat, vat, pay,
        newDebt, oldebt, saleOderDetails, debtCustomerId, user
    } = req.body;

    const { isValid, errors } = NewSaleOrderValidator({
        date, title, customerId, total, totalIncludeVat, vat, pay,
        newDebt, oldebt, saleOderDetails,
    });
    console.log('saleOderDetails = ', saleOderDetails);
    console.log('isValid = ', isValid);
    console.log('errors = ', errors);
    if (isValid) {
        let newDataversion;
        let data;
        try {
            Knex.transaction(async (t) => {
                try {

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

                    const order = await t('saleOrders')
                        .returning('*')
                        .insert({
                            customerId: customerId,
                            userId: user.id,
                            debtCustomerId: data[0].id,
                            orderTypeId: 1,
                            title: title,
                            total: total,
                            vat: vat,
                            totalIncludeVat: totalIncludeVat,
                            date: moment(date, 'DD-MM-YYYY')
                        });

                    console.log('order = ', order);

                    saleOderDetails.forEach(async ({ id, unitId, quantity, salePrice }) => {

                        const total = quantity * salePrice;
                        const temp = await t('saleOderDetails')
                            .returning('*')
                            .insert({
                                saleOrderId: order[0].id,
                                productId: id,
                                unitId,
                                quantity,
                                salePrice,
                                total
                            });
                        console.log('saleOderDetail = ', temp);
                    });

                    const dataVersion = await Knex('dataVersions').where('id', 1);

                    let { debtCustomers } = dataVersion[0];

                    debtCustomers++;

                    newDataversion = await t('dataVersions')
                        .returning('*')
                        .whereRaw('id = 1')
                        .update({
                            id: 1,
                            debtCustomers
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
        id, date, title, customerId, total, totalIncludeVat, vat, pay,
        newDebt, oldebt, saleOderDetails, debtCustomerId, user
    } = req.body;

    const { isValid, errors } = NewSaleOrderValidator({
        date, title, customerId, total, totalIncludeVat, vat, pay,
        newDebt, oldebt, saleOderDetails,
    });

    if (isValid) {
        let newDataversion;
        let data;
        try {
            Knex.transaction(async (t) => {
                try {
                    const dataVersion = await Knex('dataVersions').where('id', 1);

                    let { debtCustomers } = dataVersion[0];

                    debtCustomers++;

                    newDataversion = await t('dataVersions')
                        .returning('*')
                        .whereRaw('id = 1')
                        .update({
                            id: 1,
                            debtCustomers
                        });

                    const saleOrder = await Knex('saleOrders')
                        .where({ id: id });

                    const customerDebt = await Knex('debtCustomers')
                        .where({ id: saleOrder[0].debtCustomerId });

                    const So_tien_Dieu_Chinh = totalIncludeVat - saleOrder[0].totalIncludeVat;
                    //Lấy toàn bộ bảng dữ liệu công nợ có liên quan đến bảng công nợ bị xóa
                    customerDebtBeChanged = await Knex('debtCustomers')
                        .whereRaw(`id > saleOrder[0].debtCustomerId AND customerId = ${saleOrder[0].customerId}`);
                    //Điều chỉnh toàn bộ công nợ có liêu quan
                    customerDebtBeChanged.forEach(async (debt) => {
                        await t('debtCustomers')
                            .returning('*')
                            .whereRaw(`id = ${debt.id}`)
                            .update({
                                newDebt: debt.newDebt + So_tien_Dieu_Chinh,
                                oldDebt: debt.oldebt + So_tien_Dieu_Chinh,
                            });
                    });

                    await t('saleOrders')
                        .returning('*')
                        .whereRaw(`id = ${id}`)
                        .update({
                            customerId: customerId,
                            userId: user.id,
                            debtCustomerId: debtCustomerId,
                            orderTypeId: 1,
                            title: title,
                            total: total,
                            vat: vat,
                            totalIncludeVat: totalIncludeVat,
                            date: moment(date, 'DD-MM-YYYY')
                        });

                    saleOderDetails.forEach(async (detail) => {
                        await t('saleOderDetails')
                            .returning('*')
                            .whereRaw(`id = ${detail.id}`)
                            .update({
                                saleOrderId: id,
                                productId: detail.id,
                                unitId: detail.unitId,
                                quantity: detail.quantity,
                                salePrice: detail.salePrice,
                                total: detail.quantity * detail.salePrice
                            });
                    });

                    await t('debtCustomers')
                        .returning('*')
                        .whereRaw(`id = ${debtCustomerId}`)
                        .update({
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
            res.status(400).json({ success: false, error: e });
        }
    }
});

SaleOrderRouter.post('/delete', async (req, res) => {

    const { id } = req.body;
    let newDataversion;

    Knex.transaction(async (t) => {
        try {
            const dataVersion = await Knex('dataVersions').where('id', 1);

            let { debtCustomers } = dataVersion[0];

            debtCustomers++;

            newDataversion = await t('dataVersions')
                .returning('*')
                .whereRaw('id = 1')
                .update({
                    id: 1,
                    debtCustomers
                });

            const saleOrder = await Knex('saleOrders')
                .where({ id: id });
            //Lấy thông tin bảng công nợ sẽ bị xóa
            const customerDebt = await Knex('debtCustomers')
                .where({ id: saleOrder[0].debtCustomerId });

            const So_tien_Dieu_Chinh = saleOrder[0].pay - saleOrder[0].totalIncludeVat;
            //Lấy toàn bộ bảng dữ liệu công nợ có liên quan đến bảng công nợ bị xóa
            customerDebtBeChanged = await Knex('debtCustomers')
                .whereRaw(`id > saleOrder[0].debtCustomerId AND customerId = ${saleOrder[0].customerId}`);
            //Điều chỉnh toàn bộ công nợ có liêu quan
            customerDebtBeChanged.forEach(async (debt) => {
                await t('debtCustomers')
                    .returning('*')
                    .whereRaw(`id = ${debt.id}`)
                    .update({
                        newDebt: debt.newDebt + So_tien_Dieu_Chinh,
                        oldDebt: debt.oldebt + So_tien_Dieu_Chinh,
                    });
            });
            //Xóa bảng công nợ
            await Knex('debtCustomers')
                .transacting(t)
                .debug(true)
                .where({ id: saleOrder[0].debtCustomerId })
                .del()
                .catch((error) => {
                    console.error('delete debtCustomers error: ', error);
                });
            //xoa hóa đơn chi tiết có liên quan
            await Knex('saleOderDetails')
                .transacting(t)
                .debug(true)
                .where({ saleOrderId: id })
                .del()
                .catch((error) => {
                    console.error('delete saleOderDetails error: ', error);
                });
            //Xóa hóa đơn
            await Knex('saleOrders')
                .transacting(t)
                .debug(true)
                .where({ id: id })
                .del()
                .catch((error) => {
                    console.error('delete saleOrders error: ', error);
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
