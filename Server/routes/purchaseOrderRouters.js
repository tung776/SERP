import { Router } from 'express';
import { NewPurchaseOrderValidator } from '../../Shared/validators/index';
import Knex from '../config/knex';
import dataversionHelper from '../helpers/saveNewDataversion';
import fs from 'fs';
import path from 'path';
import moment from '../../Shared/utils/moment';

const PurchaseOrderRouter = Router();

PurchaseOrderRouter.post('/getById', async (req, res) => {
    const { orderId } = req.body;

    try {
        const purchaseOrder = await Knex.raw(`
            SELECT s."id", s."date" , s."supplierId", s."userId", s."debtSupplierId", s."orderTypeId", 
            s."total", s."totalIncludeVat", s."vat", s."taxId", d."newDebt", d."oldDebt", d."minus"
            FROM "purchaseOrders" as s
            INNER JOIN "debtSuppliers" AS d ON d."id" = s."debtSupplierId" 
            WHERE s."id" = ${orderId};                      
        `);

        
        const purchaseOrderDetails = await Knex.raw(`
        SELECT s."id" , s."purchaseOrderId", s."productId", s."unitId", s."quantity", s."purchasePrice", p."name" 
        FROM "purchaseOrderDetails" as s
        INNER JOIN "products" AS p ON p."id" = s."productId" 
        WHERE s."purchaseOrderId" = ${orderId};                      
        `);
        console.log('purchaseOrderDetails = ', purchaseOrderDetails.rows);
        res.status(200).json({
            success: true,
            purchaseOrder: purchaseOrder.rows,
            purchaseOrderDetails: purchaseOrderDetails.rows
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({
            success: false
        });
    }

});

PurchaseOrderRouter.post('/getBySupplierId', async (req, res) => {
    const { supplierId } = req.body;
    const count = 10; //10 dòng trong 1 trang
    const page = 1;
    try {
        const orders = await Knex('purchaseOrders')
            .where({ supplierId })
            .orderBy('id', 'desc')
        // .limit(count)
        // .offset(30);
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

PurchaseOrderRouter.post('/new', async (req, res) => {
    let {
        date, supplierId, total, totalIncludeVat, vat, taxId, pay,
        newDebt, oldebt, purchaseOrderDetails, debtSupplierId, user
    } = req.body;
    // return;
    const { isValid, errors } = NewPurchaseOrderValidator({
        date, supplierId, total, totalIncludeVat, vat, pay,
        newDebt, oldebt, purchaseOrderDetails,
    });
    console.log('purchaseOrderDetails = ', purchaseOrderDetails);
    // return;
    let order = []
    if (isValid) {
        let newDataversion;
        let data;
        try {
            Knex.transaction(async (t) => {
                try {

                    data = await t('debtSuppliers')
                        .returning('*')
                        .insert({
                            supplierId: supplierId,
                            createdDate: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                            title: '',
                            newDebt: newDebt,
                            oldDebt: oldebt,
                            minus: pay,
                            plus: totalIncludeVat
                        });

                    order = await t('purchaseOrders')
                        .returning('*')
                        .insert({
                            supplierId: supplierId,
                            userId: user.id,
                            debtSupplierId: data[0].id,
                            orderTypeId: 1,
                            total: total,
                            vat: vat,
                            taxId,
                            totalIncludeVat: totalIncludeVat,
                            date: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
                        });


                    purchaseOrderDetails.forEach(async ({ id, unitId, quantity, purchasePrice }) => {

                        const total = quantity * purchasePrice;
                        const temp = await t('purchaseOrderDetails')
                            .returning('*')
                            .insert({
                                purchaseOrderId: order[0].id,
                                productId: id,
                                unitId,
                                quantity,
                                purchasePrice,
                                total
                            });
                    });

                    const dataVersion = await Knex('dataVersions').where('id', 1);

                    let { debtSuppliers } = dataVersion[0];

                    debtSuppliers++;

                    newDataversion = await t('dataVersions')
                        .returning('*')
                        .whereRaw('id = 1')
                        .update({
                            id: 1,
                            debtSuppliers
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
                        debtSuppliers: data,
                        dataversion: newDataversion,
                        purchaseOrder: order
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
PurchaseOrderRouter.post('/update', async (req, res) => {

    let {
        id, date, supplierId, total, totalIncludeVat, vat, taxId, pay,
        newDebt, oldDebt, purchaseOrderDetails, debtSupplierId, user
    } = req.body;

    const { isValid, errors } = NewPurchaseOrderValidator({
        date, supplierId, total, totalIncludeVat, vat, pay,
        newDebt, oldDebt, purchaseOrderDetails,
    });


    //b1: xác định các bản ghi cần bị xóa. là những bản ghi có trong cơ sở dữ liệu
    //nhưng không có trong dữ liệu dc gửi tới server
    let detailBeRemoved = [];
    let detailBeUpdated = [];
    let detailBeInsersted = [];
    let detailInDatabase = await Knex('purchaseOrderDetails')
        .whereRaw(`"purchaseOrderId" = ${id}`);

    detailInDatabase.forEach(detailInData => {
        let isRemove = true;
        let itemUpdated = null;
        purchaseOrderDetails.forEach(detail => {
            if (detail.id == detailInData.id) {                
                isRemove = false;
                itemUpdated = detail;
            } 
        })
        if (isRemove) {
            detailBeRemoved.push(detailInData);
        } else {
            detailBeUpdated.push(itemUpdated);
        }
    });
    detailBeInsersted = purchaseOrderDetails.filter(item => {
        if (item.isNew) return item;
    });
    const purchaseOrder = await Knex('purchaseOrders')
        .where({ id: id });

    const supplierDebtBeChanged = await Knex('debtSuppliers')
        .orderBy('id', 'asc')
        .whereRaw(`id > ${purchaseOrder[0].debtSupplierId} AND "supplierId" = ${purchaseOrder[0].supplierId}`);

    const supplierDebt = await Knex('debtSuppliers')
        .where({ id: debtSupplierId });

    const dataVersion = await Knex('dataVersions').where('id', 1);

    if (isValid) {
        let data;
        let newDataversion;
        try {
            Knex.transaction(async (t) => {
                try {

                    let { debtSuppliers } = dataVersion[0];
                    debtSuppliers++;
                    newDataversion = await t('dataVersions')
                        .returning('*')
                        .whereRaw('id = 1')
                        .update({
                            id: 1,
                            debtSuppliers
                        });

                    const So_tien_Dieu_Chinh = totalIncludeVat - purchaseOrder[0].totalIncludeVat - (pay - supplierDebt[0].minus);

                    data = await t('debtSuppliers')
                        // .debug(true)
                        .returning('*')
                        .whereRaw(`id = ${debtSupplierId}`)
                        .update({
                            supplierId: supplierId,
                            createdDate: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                            newDebt: newDebt,
                            oldDebt: oldDebt,
                            minus: pay,
                            plus: totalIncludeVat
                        });

                    //Lấy toàn bộ bảng dữ liệu công nợ có liên quan đến bảng công nợ bị xóa

                    //Điều chỉnh toàn bộ công nợ có liêu quan
                    if (supplierDebtBeChanged.length >= 0) {
                        supplierDebtBeChanged.forEach(async (debt) => {
                            if (debt.newDebt == 'NAN') debt.newDebt = 0;
                            if (debt.oldDebt == 'NAN') debt.oldDebt = 0;
                            const _newDebt = debt.newDebt + So_tien_Dieu_Chinh;
                            const _oldDebt = debt.oldDebt + So_tien_Dieu_Chinh;

                            await t('debtSuppliers')
                                .debug(true)
                                .returning('*')
                                .orderBy('id', 'asc')
                                .whereRaw(`id = ${debt.id}`)
                                .update({
                                    newDebt: _newDebt,
                                    oldDebt: _oldDebt,
                                });
                            data = [debt];
                            data[0].newDebt = _newDebt;
                            data[0].oldDebt = _oldDebt;
                            console.log('supplierDebt = ', data);
                        });
                    }

                    detailBeInsersted.forEach(async (detail) => {
                        await Knex('purchaseOrderDetails')
                            .transacting(t)
                            .debug(true)
                            .insert({
                                purchaseOrderId: id,
                                productId: detail.productId,
                                unitId: detail.unitId,
                                quantity: detail.quantity,
                                purchasePrice: detail.purchasePrice,
                                total: detail.purchasePrice * detail.quantity
                            });
                    });

                    detailBeRemoved.forEach(async detail => {
                        await Knex('purchaseOrderDetails')
                            .transacting(t)
                            // .debug(true)
                            .whereRaw(`"id" = ${detail.id}`)
                            .del();
                    });

                    detailBeUpdated.forEach(async detail => {
                        await Knex('purchaseOrderDetails')
                            .transacting(t)
                            .debug(true)
                            .whereRaw(`id = ${detail.id}`)
                            .update({
                                purchaseOrderId: id,
                                productId: detail.productId,
                                unitId: detail.unitId,
                                quantity: detail.quantity,
                                purchasePrice: detail.purchasePrice,
                                total: detail.quantity * detail.purchasePrice
                            });
                    });


                    // data = await t('debtSuppliers')
                    //     .returning('*')
                    //     .whereRaw(`id = ${debtSupplierId}`)
                    //     .update({
                    //         supplierId: supplierId,
                    //         createdDate: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    //         newDebt: newDebt,
                    //         oldDebt: oldebt,
                    //         minus: pay,
                    //         plus: totalIncludeVat
                    //     });

                    await t('purchaseOrders')
                        .returning('*')
                        .whereRaw(`id = ${id}`)
                        .update({
                            supplierId: supplierId,
                            userId: user.id,
                            debtSupplierId: debtSupplierId,
                            orderTypeId: 1,
                            total: total,
                            vat: vat,
                            taxId,
                            totalIncludeVat: totalIncludeVat,
                            date: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
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
                        debtSuppliers: [...data],
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

PurchaseOrderRouter.post('/delete', async (req, res) => {

    const { id, date, supplierId, total, totalIncludeVat, vat, pay,
        newDebt, oldebt, purchaseOrderDetails, debtSupplierId, user } = req.body;
    let newDataversion;
    console.log('deleting order ', id);

    try {
        Knex.transaction(async (t) => {
            try {
                const dataVersion = await Knex('dataVersions').where('id', 1);

                let { debtSuppliers } = dataVersion[0];

                debtSuppliers++;
                console.log('go 1');
                newDataversion = await t('dataVersions')
                    .returning('*')
                    .whereRaw('id = 1')
                    .update({
                        id: 1,
                        debtSuppliers
                    });
                console.log('go 2');
                const purchaseOrder = await Knex('purchaseOrders')
                    .where({ id: id });
                //Lấy thông tin bảng công nợ sẽ bị xóa
                console.log('go 3');
                const supplierDebt = await Knex('debtSuppliers')
                    .where({ id: purchaseOrder[0].debtSupplierId });

                //phát sinh giảm - phát sinh tăng
                const So_tien_Dieu_Chinh = parseFloat(supplierDebt[0].minus) - parseFloat(purchaseOrder[0].totalIncludeVat);
                console.log('totalIncludeVat = ', totalIncludeVat);
                console.log('purchaseOrder[0].totalIncludeVat = ', purchaseOrder[0].totalIncludeVat);
                console.log('So_tien_Dieu_Chinh = ', So_tien_Dieu_Chinh);
                //Lấy toàn bộ bảng dữ liệu công nợ có liên quan đến bảng công nợ bị xóa
                console.log('go 3');
                const supplierDebtBeChanged = await Knex('debtSuppliers')
                    .whereRaw(`id > ${purchaseOrder[0].debtSupplierId} AND "supplierId" = ${purchaseOrder[0].supplierId}`);
                //Điều chỉnh toàn bộ công nợ có liêu quan
                if (supplierDebtBeChanged.length > 0) {
                    supplierDebtBeChanged.forEach(async (debt) => {
                        console.log('debt = ', debt);
                        await t('debtSuppliers')
                            .returning('*')
                            .whereRaw(`id = ${debt.id}`)
                            .update({
                                newDebt: parseFloat(debt.newDebt) + So_tien_Dieu_Chinh,
                                oldDebt: parseFloat(debt.oldDebt) + So_tien_Dieu_Chinh,
                            });
                    });
                }

                //xoa hóa đơn chi tiết có liên quan
                console.log('go 5');
                await Knex('purchaseOrderDetails')
                    .transacting(t)
                    .where({ purchaseOrderId: id })
                    .del()
                    .catch((error) => {
                        console.error('delete purchaseOrderDetails error: ', error);
                    });
                //Xóa hóa đơn
                console.log('go 6');
                await Knex('purchaseOrders')
                    .transacting(t)
                    .where({ id: id })
                    .del()
                    .catch((error) => {
                        console.error('delete purchaseOrders error: ', error);
                    });
                //Xóa bảng công nợ
                console.log('go 4');
                await Knex('debtSuppliers')
                    .transacting(t)
                    .where({ id: purchaseOrder[0].debtSupplierId })
                    .del()
                    .catch((error) => {
                        console.error('delete debtSuppliers error: ', error);
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
    }
    catch (e) {
        console.log(e)
    }
});

export default PurchaseOrderRouter;
