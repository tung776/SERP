import { Router } from 'express';
import { NewPaymentCustomerValidator } from '../../Shared/validators/index';
import Knex from '../config/knex';
import dataversionHelper from '../helpers/saveNewDataversion';
import fs from 'fs';
import path from 'path';
import moment from '../../Shared/utils/moment';

const Printer = require('pdfmake');
const PaymentCustomerRouter = Router();

PaymentCustomerRouter.post('/getById', async (req, res) => {
    const { id } = req.body;

    if (id == undefined) {
        console.log('id = undefined');
        return;
    }

    try {
        const paymentCustomer = await Knex.raw(`
            SELECT s."id", s."createdDate" , s."customerId", s."debtCustomerId", 
            s."title",d."newDebt", d."oldDebt", s."amount"
            FROM "paymentCustomers" as s
            INNER JOIN "debtCustomers" AS d ON d."id" = s."debtCustomerId" 
            WHERE s."id" = ${id};                      
        `);
        res.status(200).json({
            success: true,
            paymentCustomer: paymentCustomer.rows,
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({
            success: false
        });
    }

});

PaymentCustomerRouter.post('/getByCustomerId', async (req, res) => {
    const { customerId } = req.body;
    const count = 10; //10 dòng trong 1 trang
    const page = 1;
    try {
        const payment = await Knex('paymentCustomers')
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

PaymentCustomerRouter.post('/new', async (req, res) => {
    let {
        createdDate, title, customerId, pay,
        newDebt, oldDebt, debtCustomerId, user
    } = req.body;
    // return;
    const { isValid, errors } = NewPaymentCustomerValidator({
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

                    data = await t('debtCustomers')
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

                    payment = await t('paymentCustomers')
                        .returning('*')
                        .insert({
                            customerId: customerId,
                            debtCustomerId: data[0].id,
                            title: title,
                            amount: pay,
                            createdDate: moment(createdDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
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
                        paymentCustomer: payment
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
PaymentCustomerRouter.post('/update', async (req, res) => {

    let {
        id, createdDate, title, customerId, pay,
        newDebt, oldDebt, debtCustomerId, user
    } = req.body;


    const { isValid, errors } = NewPaymentCustomerValidator({
        createdDate, title, customerId, pay,
        newDebt, oldDebt,
    });

    title = (title == "") ? `Thu công nợ khách hàng` : title;


    // const oldPaymentCustomer = await Knex('paymentCustomers')
    //     .where({ id: id });

    const customerDebtBeChanged = await Knex('debtCustomers')
        .orderBy('id', 'asc')
        .whereRaw(`id > ${debtCustomerId} AND "customerId" = ${customerId}`);



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

                    const So_tien_Dieu_Chinh = (customerDebt[0].minus - pay);
                    console.log('customerDebt = ', customerDebt);
                    console.log('So_tien_Dieu_Chinh = ', So_tien_Dieu_Chinh);
                    data = await t('debtCustomers')
                        // .debug(true)
                        .returning('*')
                        .whereRaw(`id = ${debtCustomerId}`)
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
                            console.log('customerDebtBeChanged = ', data);
                        });
                    }


                    await t('paymentCustomers')
                        .returning('*')
                        .whereRaw(`id = ${id}`)
                        .update({
                            customerId: customerId,
                            debtCustomerId: debtCustomerId,
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

PaymentCustomerRouter.post('/delete', async (req, res) => {

    let {
        id
    } = req.body;
    let newDataversion;

    const paymentCustomer = await Knex('paymentCustomers')
        .where({ id: id });
    //Lấy thông tin bảng công nợ sẽ bị xóa
    const customerDebt = await Knex('debtCustomers')
        .where({ id: paymentCustomer[0].debtCustomerId });

    //phát sinh giảm - phát sinh tăng
    const So_tien_Dieu_Chinh = paymentCustomer[0].amount;

    //Lấy toàn bộ bảng dữ liệu công nợ có liên quan đến bảng công nợ bị xóa
    const customerDebtBeChanged = await Knex('debtCustomers')
        .whereRaw(`id > ${paymentCustomer[0].debtCustomerId} AND "customerId" = ${paymentCustomer[0].customerId}`);

    try {
        Knex.transaction(async (t) => {
            try {
                const dataVersion = await Knex('dataVersions').where('id', 1);

                let { debtCustomers } = dataVersion[0];

                debtCustomers++;
                newDataversion = await t('dataVersions')
                    .debug(true)
                    .returning('*')
                    .whereRaw('id = 1')
                    .update({
                        id: 1,
                        debtCustomers
                    });

                //Điều chỉnh toàn bộ công nợ có liêu quan
                if (customerDebtBeChanged.length > 0) {
                    customerDebtBeChanged.forEach(async (debt) => {
                        console.log('debt = ', debt);
                        await t('debtCustomers')
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
                await Knex('paymentCustomers')
                    .debug(true)
                    .transacting(t)
                    .where({ id: id })
                    .del()
                    .catch((error) => {
                        console.error('delete paymentCustomers error: ', error);
                    });

                await Knex('debtCustomers')
                    .debug(true)
                    .transacting(t)
                    .where({ id: paymentCustomer[0].debtCustomerId })
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

export default PaymentCustomerRouter;
