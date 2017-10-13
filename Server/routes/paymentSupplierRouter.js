import { Router } from 'express';
import { NewPaymentSupplierValidator } from '../../Shared/validators/index';
import Knex from '../config/knex';
import dataversionHelper from '../helpers/saveNewDataversion';
import fs from 'fs';
import path from 'path';
import moment from '../../Shared/utils/moment';

const Printer = require('pdfmake');
const PaymentSupplierRouter = Router();

PaymentSupplierRouter.post('/getById', async (req, res) => {
    const { id } = req.body;

    if (id == undefined) {
        console.log('id = undefined');
        return;
    }

    try {
        const paymentSupplier = await Knex.raw(`
            SELECT s."id", s."createdDate" , s."customerId", s."debtSupplierId", 
            s."title",d."newDebt", d."oldDebt", s."amount"
            FROM "paymentSuppliers" as s
            INNER JOIN "debtSuppliers" AS d ON d."id" = s."debtSupplierId" 
            WHERE s."id" = ${id};                      
        `);
        res.status(200).json({
            success: true,
            paymentSupplier: paymentSupplier.rows,
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({
            success: false
        });
    }

});

PaymentSupplierRouter.post('/getBySupplierId', async (req, res) => {
    const { customerId } = req.body;
    const count = 10; //10 dòng trong 1 trang
    const page = 1;
    try {
        const payment = await Knex('paymentSuppliers')
            .where({ customerId })
            .orderBy('id', 'desc')
        // .limit(count)
        // .offset(30);
        res.status(200).json({
            success: true,
            payment,
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({
            success: false
        });
    }

});

PaymentSupplierRouter.post('/new', async (req, res) => {
    let {
        createdDate, title, customerId, pay,
        newDebt, oldDebt, debtSupplierId, user
    } = req.body;
    // return;
    const { isValid, errors } = NewPaymentSupplierValidator({
        createdDate, title, customerId, pay,
        newDebt, oldDebt
    });

    title = (title == "") ? `Thu công nợ khách hàng` : title;

    if (isValid) {
        let newDataversion;
        let data;
        let payment;
        try {
            Knex.transaction(async (t) => {
                try {

                    data = await t('debtSuppliers')
                        .returning('*')
                        .insert({
                            customerId: customerId,
                            createdDate: moment(createdDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                            title: title,
                            newDebt: newDebt,
                            oldDebt: oldDebt,
                            minus: pay,
                            plus: 0
                        });

                    payment = await t('paymentSuppliers')
                        .returning('*')
                        .insert({
                            customerId: customerId,
                            debtSupplierId: data[0].id,
                            title: title,
                            amount: pay,
                            createdDate: moment(createdDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
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
                        paymentSupplier: payment
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
PaymentSupplierRouter.post('/update', async (req, res) => {

    let {
        id, createdDate, title, customerId, pay,
        newDebt, oldDebt, debtSupplierId, user
    } = req.body;


    const { isValid, errors } = NewPaymentSupplierValidator({
        createdDate, title, customerId, pay,
        newDebt, oldDebt,
    });

    title = (title == "") ? `Thu công nợ khách hàng` : title;


    // const oldPaymentSupplier = await Knex('paymentSuppliers')
    //     .where({ id: id });

    const customerDebtBeChanged = await Knex('debtSuppliers')
        .orderBy('id', 'asc')
        .whereRaw(`id > ${debtSupplierId} AND "customerId" = ${customerId}`);



    const customerDebt = await Knex('debtSuppliers')
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

                    const So_tien_Dieu_Chinh = (customerDebt[0].minus - pay);
                    console.log('customerDebt = ', customerDebt);
                    console.log('So_tien_Dieu_Chinh = ', So_tien_Dieu_Chinh);
                    data = await t('debtSuppliers')
                        // .debug(true)
                        .returning('*')
                        .whereRaw(`id = ${debtSupplierId}`)
                        .update({
                            customerId: customerId,
                            createdDate: moment(createdDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                            title: title,
                            newDebt: newDebt,
                            oldDebt: oldDebt,
                            minus: pay,
                            plus: 0
                        });

                    //Lấy toàn bộ bảng dữ liệu công nợ có liên quan đến bảng công nợ bị xóa

                    //Điều chỉnh toàn bộ công nợ có liêu quan
                    if (customerDebtBeChanged.length >= 0) {
                        customerDebtBeChanged.forEach(async (debt) => {
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
                            console.log('customerDebtBeChanged = ', data);
                        });
                    }


                    await t('paymentSuppliers')
                        .returning('*')
                        .whereRaw(`id = ${id}`)
                        .update({
                            customerId: customerId,
                            debtSupplierId: debtSupplierId,
                            title: title,
                            amount: pay,
                            createdDate: moment(createdDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
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

PaymentSupplierRouter.post('/delete', async (req, res) => {

    let {
        id
    } = req.body;
    let newDataversion;

    const paymentSupplier = await Knex('paymentSuppliers')
        .where({ id: id });
    //Lấy thông tin bảng công nợ sẽ bị xóa
    const customerDebt = await Knex('debtSuppliers')
        .where({ id: paymentSupplier[0].debtSupplierId });

    //phát sinh giảm - phát sinh tăng
    const So_tien_Dieu_Chinh = paymentSupplier[0].amount;

    //Lấy toàn bộ bảng dữ liệu công nợ có liên quan đến bảng công nợ bị xóa
    const customerDebtBeChanged = await Knex('debtSuppliers')
        .whereRaw(`id > ${paymentSupplier[0].debtSupplierId} AND "customerId" = ${paymentSupplier[0].customerId}`);

    try {
        Knex.transaction(async (t) => {
            try {
                const dataVersion = await Knex('dataVersions').where('id', 1);

                let { debtSuppliers } = dataVersion[0];

                debtSuppliers++;
                newDataversion = await t('dataVersions')
                    .debug(true)
                    .returning('*')
                    .whereRaw('id = 1')
                    .update({
                        id: 1,
                        debtSuppliers
                    });

                //Điều chỉnh toàn bộ công nợ có liêu quan
                if (customerDebtBeChanged.length > 0) {
                    customerDebtBeChanged.forEach(async (debt) => {
                        console.log('debt = ', debt);
                        await t('debtSuppliers')
                            .debug(true)
                            .returning('*')
                            .whereRaw(`id = ${debt.id}`)
                            .update({
                                newDebt: debt.newDebt + So_tien_Dieu_Chinh,
                                oldDebt: debt.oldDebt + So_tien_Dieu_Chinh,
                            });
                    });
                }

                //Điều chỉnh lại phiếu thu
                await Knex('paymentSuppliers')
                    .debug(true)
                    .transacting(t)
                    .where({ id: id })
                    .del()
                    .catch((error) => {
                        console.error('delete paymentSuppliers error: ', error);
                    });

                await Knex('debtSuppliers')
                    .debug(true)
                    .transacting(t)
                    .where({ id: paymentSupplier[0].debtSupplierId })
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

export default PaymentSupplierRouter;
