import { Router } from 'express';
import { NewSaleOrderValidator } from '../../Shared/validators/index';
import Knex from '../config/knex';
import dataversionHelper from '../helpers/saveNewDataversion';
import fs from 'fs';
import path from 'path';
import moment from '../../Shared/utils/moment';
import DocDefinition from '../../Shared/templates/saleOrderTemplate';

const Printer = require('pdfmake');
const SaleOrderRouter = Router();

SaleOrderRouter.get('/getInvoice/:orderId', async (req, res) => {
    const orderId = req.params.orderId;

    const saleOrder = await Knex.raw(`
        SELECT s."id", s."date" , s."customerId", s."userId", s."debtCustomerId", s."orderTypeId", 
        s."title", s."total", s."totalIncludeVat", s."vat", s."taxId" d."newDebt", d."oldDebt", d."minus"
        FROM "saleOrders" as s
        INNER JOIN "debtCustomers" AS d ON d."id" = s."debtCustomerId" 
        WHERE s."id" = ${orderId};                      
    `);
    const saleOrderDetails = await Knex.raw(`
        SELECT s."id" , s."saleOrderId", s."productId", s."unitId", u."name" AS "unitName", s."quantity", s."salePrice", p."name" 
        FROM "saleOderDetails" as s
        INNER JOIN "products" AS p ON p."id" = s."productId" 
        INNER JOIN "units" AS u ON u."id" = s."unitId" 
        WHERE s."saleOrderId" = ${orderId};                      
    `);

    const {
        id,
        customerId,
        date,
        total,
        totalIncludeVat,
        vat,
        taxId,
        oldDebt,
        minus,
        newDebt,
    } = saleOrder.rows[0];

    const customer = await Knex('customers')
        .where({ id: customerId });

    const fontDescriptors = {
        Roboto: {
            normal: path.resolve('Shared/templates/fonts/Roboto.ttf'),
            bold: path.resolve('Shared/templates/fonts/Roboto_medium.ttf'),
            italics: path.resolve('Shared/templates/fonts/Roboto_medium.ttf'),
            bolditalics: path.resolve('Shared/templates/fonts/Roboto_medium.ttf'),
        }
    };

    const printer = new Printer(fontDescriptors);
    const docDefin = DocDefinition(
        id,
        customer.name,
        date,
        total,
        totalIncludeVat,
        vat,
        oldDebt,
        minus,
        newDebt,
        saleOrderDetails.rows
    );
    let doc = printer.createPdfKitDocument(docDefin);
    // res.send('success');
    let chunks = [];
    let result;

    doc.on('data', function (chunk) {
        chunks.push(chunk);
    });
    doc.on('end', function () {
        result = Buffer.concat(chunks);

        res.contentType('application/pdf');
        res.send(result);
    });
    doc.end();
});

SaleOrderRouter.post('/getById', async (req, res) => {
    const { orderId } = req.body;

    try {
        const saleOrder = await Knex.raw(`
            SELECT s."id", s."date" , s."customerId", s."userId", s."debtCustomerId", s."orderTypeId", 
            s."title", s."total", s."totalIncludeVat", s."vat", s."taxId", d."newDebt", d."oldDebt", d."minus"
            FROM "saleOrders" as s
            INNER JOIN "debtCustomers" AS d ON d."id" = s."debtCustomerId" 
            WHERE s."id" = ${orderId};                      
        `);

        
        const saleOrderDetails = await Knex.raw(`
        SELECT s."id" , s."saleOrderId", s."productId", s."unitId", s."quantity", s."salePrice", p."name" 
        FROM "saleOderDetails" as s
        INNER JOIN "products" AS p ON p."id" = s."productId" 
        WHERE s."saleOrderId" = ${orderId};                      
        `);
        res.status(200).json({
            success: true,
            saleOrder: saleOrder.rows,
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
    const count = 10; //10 dòng trong 1 trang
    const page = 1;
    try {
        const orders = await Knex('saleOrders')
            .where({ customerId })
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

SaleOrderRouter.post('/new', async (req, res) => {
    let {
        date, title, customerId, total, totalIncludeVat, vat, taxId, pay,
        newDebt, oldebt, saleOderDetails, debtCustomerId, user
    } = req.body;
    // return;
    const { isValid, errors } = NewSaleOrderValidator({
        date, title, customerId, total, totalIncludeVat, vat, pay,
        newDebt, oldebt, saleOderDetails,
    });
    let order = []
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
                            createdDate: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                            title: title,
                            newDebt: newDebt,
                            oldDebt: oldebt,
                            minus: pay,
                            plus: totalIncludeVat
                        });

                    order = await t('saleOrders')
                        .returning('*')
                        .insert({
                            customerId: customerId,
                            userId: user.id,
                            debtCustomerId: data[0].id,
                            orderTypeId: 1,
                            title: title,
                            total: total,
                            vat: vat,
                            taxId,
                            totalIncludeVat: totalIncludeVat,
                            date: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
                        });


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
                        dataversion: newDataversion,
                        saleOrder: order
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
        id, date, title, customerId, total, totalIncludeVat, vat, taxId, pay,
        newDebt, oldDebt, saleOrderDetails, debtCustomerId, user
    } = req.body;

    const { isValid, errors } = NewSaleOrderValidator({
        date, title, customerId, total, totalIncludeVat, vat, pay,
        newDebt, oldDebt, saleOrderDetails,
    });


    //b1: xác định các bản ghi cần bị xóa. là những bản ghi có trong cơ sở dữ liệu
    //nhưng không có trong dữ liệu dc gửi tới server
    let detailBeRemoved = [];
    let detailBeUpdated = [];
    let detailBeInsersted = [];
    let detailInDatabase = await Knex('saleOderDetails')
        .whereRaw(`"saleOrderId" = ${id}`);

    detailInDatabase.forEach(detailInData => {
        let isRemove = true;
        let itemUpdated = null;
        saleOrderDetails.forEach(detail => {
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
    detailBeInsersted = saleOrderDetails.filter(item => {
        if (item.isNew) return item;
    });
    const saleOrder = await Knex('saleOrders')
        .where({ id: id });

    const customerDebtBeChanged = await Knex('debtCustomers')
        .orderBy('id', 'asc')
        .whereRaw(`id > ${saleOrder[0].debtCustomerId} AND "customerId" = ${saleOrder[0].customerId}`);

    const customerDebt = await Knex('debtCustomers')
        .where({ id: debtCustomerId });

    const dataVersion = await Knex('dataVersions').where('id', 1);

    if (isValid) {
        let data;
        let newDataversion;
        try {
            Knex.transaction(async (t) => {
                try {

                    let { debtCustomers } = dataVersion[0];
                    debtCustomers++;
                    newDataversion = await t('dataVersions')
                        .returning('*')
                        .whereRaw('id = 1')
                        .update({
                            id: 1,
                            debtCustomers
                        });

                    const So_tien_Dieu_Chinh = totalIncludeVat - saleOrder[0].totalIncludeVat - (pay - customerDebt[0].minus);

                    data = await t('debtCustomers')
                        // .debug(true)
                        .returning('*')
                        .whereRaw(`id = ${debtCustomerId}`)
                        .update({
                            customerId: customerId,
                            createdDate: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                            title: title,
                            newDebt: newDebt,
                            oldDebt: oldDebt,
                            minus: pay,
                            plus: totalIncludeVat
                        });

                    //Lấy toàn bộ bảng dữ liệu công nợ có liên quan đến bảng công nợ bị xóa

                    //Điều chỉnh toàn bộ công nợ có liêu quan
                    if (customerDebtBeChanged.length >= 0) {
                        customerDebtBeChanged.forEach(async (debt) => {
                            if (debt.newDebt == 'NAN') debt.newDebt = 0;
                            if (debt.oldDebt == 'NAN') debt.oldDebt = 0;
                            const _newDebt = debt.newDebt + So_tien_Dieu_Chinh;
                            const _oldDebt = debt.oldDebt + So_tien_Dieu_Chinh;

                            await t('debtCustomers')
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
                        });
                    }

                    detailBeInsersted.forEach(async (detail) => {
                        await Knex('saleOderDetails')
                            .transacting(t)
                            .debug(true)
                            .insert({
                                saleOrderId: id,
                                productId: detail.productId,
                                unitId: detail.unitId,
                                quantity: detail.quantity,
                                salePrice: detail.salePrice,
                                total: detail.salePrice * detail.quantity
                            });
                    });

                    detailBeRemoved.forEach(async detail => {
                        await Knex('saleOderDetails')
                            .transacting(t)
                            // .debug(true)
                            .whereRaw(`"id" = ${detail.id}`)
                            .del();
                    });

                    detailBeUpdated.forEach(async detail => {
                        await Knex('saleOderDetails')
                            .transacting(t)
                            .debug(true)
                            .whereRaw(`id = ${detail.id}`)
                            .update({
                                saleOrderId: id,
                                productId: detail.productId,
                                unitId: detail.unitId,
                                quantity: detail.quantity,
                                salePrice: detail.salePrice,
                                total: detail.quantity * detail.salePrice
                            });
                    });


                    // data = await t('debtCustomers')
                    //     .returning('*')
                    //     .whereRaw(`id = ${debtCustomerId}`)
                    //     .update({
                    //         customerId: customerId,
                    //         createdDate: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    //         title: title,
                    //         newDebt: newDebt,
                    //         oldDebt: oldebt,
                    //         minus: pay,
                    //         plus: totalIncludeVat
                    //     });

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
                        debtCustomers: [...data],
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

    const { id, date, title, customerId, total, totalIncludeVat, vat, pay,
        newDebt, oldebt, saleOrderDetails, debtCustomerId, user } = req.body;
    let newDataversion;

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
                //Lấy thông tin bảng công nợ sẽ bị xóa
                const customerDebt = await Knex('debtCustomers')
                    .where({ id: saleOrder[0].debtCustomerId });

                //phát sinh giảm - phát sinh tăng
                const So_tien_Dieu_Chinh = parseFloat(customerDebt[0].minus) - parseFloat(saleOrder[0].totalIncludeVat);

                //Lấy toàn bộ bảng dữ liệu công nợ có liên quan đến bảng công nợ bị xóa
  
                const customerDebtBeChanged = await Knex('debtCustomers')
                    .whereRaw(`id > ${saleOrder[0].debtCustomerId} AND "customerId" = ${saleOrder[0].customerId}`);
                //Điều chỉnh toàn bộ công nợ có liêu quan
                if (customerDebtBeChanged.length > 0) {
                    customerDebtBeChanged.forEach(async (debt) => {
                        await t('debtCustomers')
                            .returning('*')
                            .whereRaw(`id = ${debt.id}`)
                            .update({
                                newDebt: parseFloat(debt.newDebt) + So_tien_Dieu_Chinh,
                                oldDebt: parseFloat(debt.oldDebt) + So_tien_Dieu_Chinh,
                            });
                    });
                }

                //xoa hóa đơn chi tiết có liên quan
                await Knex('saleOderDetails')
                    .transacting(t)
                    .where({ saleOrderId: id })
                    .del()
                    .catch((error) => {
                        console.error('delete saleOderDetails error: ', error);
                    });
                //Xóa hóa đơn
                await Knex('saleOrders')
                    .transacting(t)
                    .where({ id: id })
                    .del()
                    .catch((error) => {
                        console.error('delete saleOrders error: ', error);
                    });
                //Xóa bảng công nợ
                await Knex('debtCustomers')
                    .transacting(t)
                    .where({ id: saleOrder[0].debtCustomerId })
                    .del()
                    .catch((error) => {
                        console.error('delete debtCustomers error: ', error);
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

export default SaleOrderRouter;
