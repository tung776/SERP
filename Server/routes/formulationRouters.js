import { Router } from 'express';
import { NewFormulationValidator } from '../../Shared/validators/index';
import Knex from '../config/knex';
import dataversionHelper from '../helpers/saveNewDataversion';
import fs from 'fs';
import path from 'path';
import moment from '../../Shared/utils/moment';

const FormulationRouter = Router();


FormulationRouter.post('/getById', async (req, res) => {
    const { formulationId } = req.body;

    try {
        const formulation = await Knex.raw(`
            SELECT s."id", s."date", s."productId", s."isActive", s."unitId", s."unitId", s."quantity", s."note"
            FROM "formulations" as s
            WHERE s."id" = ${formulationId};                      
        `);

        
        const formulationDetails = await Knex.raw(`
        SELECT s."id" , s."formulationId", s."productId", s."unitId", s."quantity" , p."name"
        FROM "formulationDetails" as s
        INNER JOIN "products" AS p ON p."id" = s."productId" 
        WHERE s."formulationId" = ${formulationId};                      
        `);
        res.status(200).json({
            success: true,
            formulation: formulation.rows,
            formulationDetails: formulationDetails.rows
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({
            success: false
        });
    }

});

FormulationRouter.post('/getByProductId', async (req, res) => {
    const { productId } = req.body;
    const count = 10; //10 dòng trong 1 trang
    const page = 1;
    try {
        const formulations = await Knex('formulations')
            .where({ productId })
            .formulationBy('id', 'desc')
        // .limit(count)
        // .offset(30);
        res.status(200).json({
            success: true,
            formulations,
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({
            success: false
        });
    }

});

FormulationRouter.post('/new', async (req, res) => {
    let {
        date, note, productId, unitId, quantity, isActive, formulationDetails
    } = req.body;

    console.log({date, note, productId, unitId, quantity, isActive, formulationDetails})
    return;
    const { isValid, errors } = NewFormulationValidator({
        date, isActive, note, productId, unitId, total, quantity, formulationDetails,
    });
    let formulation = []
    if (isValid) {
        let data;
        try {
            Knex.transaction(async (t) => {
                try {
                    
                    formulation = await t('formulations')
                        .returning('*')
                        .insert({
                            productId: productId,
                            unitIdId: 1,
                            quantity:quantity,
                            isActive: isActive,
                            formulationTypeId: 1,
                            note: note,
                            date: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
                        });


                    formulationDetails.forEach(async ({ id, unitId, quantity, salePrice }) => {

                        const total = quantity * salePrice;
                        const temp = await t('formulationDetails')
                            .returning('*')
                            .insert({
                                formulationId: formulation[0].id,
                                productId: id,
                                unitId,
                                quantity
                            });
                    });

                    const dataVersion = await Knex('dataVersions').where('id', 1);

                    let { debtformulations } = dataVersion[0];

                    debtformulations++;

                    newDataversion = await t('dataVersions')
                        .returning('*')
                        .whereRaw('id = 1')
                        .update({
                            id: 1,
                            debtformulations
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
                        debtformulations: data,
                        dataversion: newDataversion,
                        formulation: formulation
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
FormulationRouter.post('/update', async (req, res) => {

    let {
        id, date, title, formulationId, total, totalIncludeVat, vat, taxId, pay,
        newDebt, oldDebt, formulationDetails, debtformulationId, user
    } = req.body;

    const { isValid, errors } = NewFormulationValidator({
        date, title, formulationId, total, totalIncludeVat, vat, pay,
        newDebt, oldDebt, formulationDetails,
    });


    //b1: xác định các bản ghi cần bị xóa. là những bản ghi có trong cơ sở dữ liệu
    //nhưng không có trong dữ liệu dc gửi tới server
    let detailBeRemoved = [];
    let detailBeUpdated = [];
    let detailBeInsersted = [];
    let detailInDatabase = await Knex('formulationDetails')
        .whereRaw(`"formulationId" = ${id}`);

    detailInDatabase.forEach(detailInData => {
        let isRemove = true;
        let itemUpdated = null;
        formulationDetails.forEach(detail => {
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
    detailBeInsersted = formulationDetails.filter(item => {
        if (item.isNew) return item;
    });
    const formulation = await Knex('formulations')
        .where({ id: id });

    const formulationDebtBeChanged = await Knex('debtformulations')
        .formulationBy('id', 'asc')
        .whereRaw(`id > ${formulation[0].debtformulationId} AND "formulationId" = ${formulation[0].formulationId}`);

    const formulationDebt = await Knex('debtformulations')
        .where({ id: debtformulationId });

    const dataVersion = await Knex('dataVersions').where('id', 1);

    if (isValid) {
        let data;
        let newDataversion;
        try {
            Knex.transaction(async (t) => {
                try {

                    let { debtformulations } = dataVersion[0];
                    debtformulations++;
                    newDataversion = await t('dataVersions')
                        .returning('*')
                        .whereRaw('id = 1')
                        .update({
                            id: 1,
                            debtformulations
                        });

                    const So_tien_Dieu_Chinh = totalIncludeVat - formulation[0].totalIncludeVat - (pay - formulationDebt[0].minus);

                    data = await t('debtformulations')
                        // .debug(true)
                        .returning('*')
                        .whereRaw(`id = ${debtformulationId}`)
                        .update({
                            formulationId: formulationId,
                            createdDate: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                            title: title,
                            newDebt: newDebt,
                            oldDebt: oldDebt,
                            minus: pay,
                            plus: totalIncludeVat
                        });

                    //Lấy toàn bộ bảng dữ liệu công nợ có liên quan đến bảng công nợ bị xóa

                    //Điều chỉnh toàn bộ công nợ có liêu quan
                    if (formulationDebtBeChanged.length >= 0) {
                        formulationDebtBeChanged.forEach(async (debt) => {
                            if (debt.newDebt == 'NAN') debt.newDebt = 0;
                            if (debt.oldDebt == 'NAN') debt.oldDebt = 0;
                            const _newDebt = debt.newDebt + So_tien_Dieu_Chinh;
                            const _oldDebt = debt.oldDebt + So_tien_Dieu_Chinh;

                            await t('debtformulations')
                                .debug(true)
                                .returning('*')
                                .formulationBy('id', 'asc')
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
                        await Knex('formulationDetails')
                            .transacting(t)
                            .debug(true)
                            .insert({
                                formulationId: id,
                                productId: detail.productId,
                                unitId: detail.unitId,
                                quantity: detail.quantity,
                                salePrice: detail.salePrice,
                                total: detail.salePrice * detail.quantity
                            });
                    });

                    detailBeRemoved.forEach(async detail => {
                        await Knex('formulationDetails')
                            .transacting(t)
                            // .debug(true)
                            .whereRaw(`"id" = ${detail.id}`)
                            .del();
                    });

                    detailBeUpdated.forEach(async detail => {
                        await Knex('formulationDetails')
                            .transacting(t)
                            .debug(true)
                            .whereRaw(`id = ${detail.id}`)
                            .update({
                                formulationId: id,
                                productId: detail.productId,
                                unitId: detail.unitId,
                                quantity: detail.quantity,
                                salePrice: detail.salePrice,
                                total: detail.quantity * detail.salePrice
                            });
                    });


                    // data = await t('debtformulations')
                    //     .returning('*')
                    //     .whereRaw(`id = ${debtformulationId}`)
                    //     .update({
                    //         formulationId: formulationId,
                    //         createdDate: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    //         title: title,
                    //         newDebt: newDebt,
                    //         oldDebt: oldebt,
                    //         minus: pay,
                    //         plus: totalIncludeVat
                    //     });

                    await t('formulations')
                        .returning('*')
                        .whereRaw(`id = ${id}`)
                        .update({
                            formulationId: formulationId,
                            userId: user.id,
                            debtformulationId: debtformulationId,
                            formulationTypeId: 1,
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
                        debtformulations: [...data],
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

FormulationRouter.post('/delete', async (req, res) => {

    const { id, date, title, formulationId, total, totalIncludeVat, vat, pay,
        newDebt, oldebt, formulationDetails, debtformulationId, user } = req.body;
    let newDataversion;

    try {
        Knex.transaction(async (t) => {
            try {
                const dataVersion = await Knex('dataVersions').where('id', 1);

                let { debtformulations } = dataVersion[0];

                debtformulations++;
                newDataversion = await t('dataVersions')
                    .returning('*')
                    .whereRaw('id = 1')
                    .update({
                        id: 1,
                        debtformulations
                    });
                const formulation = await Knex('formulations')
                    .where({ id: id });
                //Lấy thông tin bảng công nợ sẽ bị xóa
                const formulationDebt = await Knex('debtformulations')
                    .where({ id: formulation[0].debtformulationId });

                //phát sinh giảm - phát sinh tăng
                const So_tien_Dieu_Chinh = parseFloat(formulationDebt[0].minus) - parseFloat(formulation[0].totalIncludeVat);

                //Lấy toàn bộ bảng dữ liệu công nợ có liên quan đến bảng công nợ bị xóa
                const formulationDebtBeChanged = await Knex('debtformulations')
                    .whereRaw(`id > ${formulation[0].debtformulationId} AND "formulationId" = ${formulation[0].formulationId}`);
                //Điều chỉnh toàn bộ công nợ có liêu quan
                if (formulationDebtBeChanged.length > 0) {
                    formulationDebtBeChanged.forEach(async (debt) => {
                        await t('debtformulations')
                            .returning('*')
                            .whereRaw(`id = ${debt.id}`)
                            .update({
                                newDebt: parseFloat(debt.newDebt) + So_tien_Dieu_Chinh,
                                oldDebt: parseFloat(debt.oldDebt) + So_tien_Dieu_Chinh,
                            });
                    });
                }

                //xoa hóa đơn chi tiết có liên quan
                await Knex('formulationDetails')
                    .transacting(t)
                    .where({ formulationId: id })
                    .del()
                    .catch((error) => {
                        console.error('delete formulationDetails error: ', error);
                    });
                //Xóa hóa đơn
                await Knex('formulations')
                    .transacting(t)
                    .where({ id: id })
                    .del()
                    .catch((error) => {
                        console.error('delete formulations error: ', error);
                    });
                //Xóa bảng công nợ
                await Knex('debtformulations')
                    .transacting(t)
                    .where({ id: formulation[0].debtformulationId })
                    .del()
                    .catch((error) => {
                        console.error('delete debtformulations error: ', error);
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

export default FormulationRouter;
