import { Router } from 'express';
import { NewQuocteValidator } from '../../Shared/validators/index';
import Knex from '../config/knex';
import dataversionHelper from '../helpers/saveNewDataversion';
import fs from 'fs';
import path from 'path';
import moment from '../../Shared/utils/moment';

const QuocteRouter = Router();

QuocteRouter.post('/new', async (req, res) => {
    let {
        customerId,
        customerGroupId,
        title,
        date,
        quocteDetails
    } = req.body;


    console.log('req.body = ', req.body);
    date = moment(date, 'DD-MM-YYYY');
    console.log('date = ', date);

    const { isValid, errors } = NewQuocteValidator(req.body);
    let newQuocte;
    if (isValid) {
        let newDataversion;
        let data;
        let newQuocteDetails = [];
        try {
            //bắt đầu thực hiện giao dịch, một trong nhiệm vụ thất bại sẽ bị rollback
            Knex.transaction(async (t) => {
                try {
                    //lấy dataversion hiện tại
                    const dataVersion = await Knex('dataVersions').where('id', 1);

                    let { menus, userMenus, roles, categoryGroups, units, warehouses, products, customers, customerGroups, quoctes } = dataVersion[0];
                    quoctes++;
                    //thực hiện thay đổi dữ liệu bảng báo giá
                    newQuocte = await t('quoctes')
                        .returning('*')
                        .insert({
                            customerId: customerId,
                            customerGroupId: customerGroupId,
                            title: title,
                            date: date
                        });
                    //thêm các báo giá chi tiết
                    let QuoctedetailItems = [];
                    quocteDetails.forEach(async ({ id, unitId, salePrice }) => {
                        console.log(`insert quocteDetail: id = ${newQuocte[0].id}, productId = ${id}, unitId = ${unitId}, price = ${salePrice}`)
                        let newItem = await t('quocteDetails')
                            .returning('*')
                            .insert({
                                quocteId: newQuocte[0].id,
                                productId: id,
                                unitId: unitId,
                                price: salePrice
                            });
                        newItem[0].id = newQuocte[0].id;
                        newItem[0].customerId = newQuocte[0].customerId;
                        newItem[0].customerGroupId = newQuocte[0].customerGroupId;
                        newItem[0].title = newQuocte[0].title;
                        newItem[0].date = newQuocte[0].date;
                        QuoctedetailItems.push(newItem[0]);
                    });

                    
                    //để cập nhật dataversion mới
                    newDataversion = await t('dataVersions')
                        .returning('*')
                        .whereRaw('id = 1')
                        .update({
                            id: 1, menus, userMenus, roles, categoryGroups, units, warehouses, products, customers, customerGroups, quoctes
                        });
                } catch (e) {
                    //Đã có lỗi phát sinh, rollback lại toàn bộ thay đổi
                    t.rollback();
                    console.log(e);
                    res.status(400).json({ success: false, error: e });
                }
            }).then(
                async () => {
                    //không có lỗi nào xuất hiện, server sẽ gửi tới client nhóm khách hàng vừa được insert, và dataVersion mới nhất
                    
                    data =  await Knex.raw(`
                        SELECT q."id", q."customerId", q."customerGroupId", q."title", q."date", 
                            qd."productId", qd."unitId", qd."price" FROM "quoctes" AS q
                        INNER JOIN "quocteDetails" AS qd ON q."id" = qd."quocteId"
                        WHERE q."id" = ${newQuocte[0].id};                      
                    `);
                    
                    res.json({
                        success: true,
                        quocte: data.rows,
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
QuocteRouter.post('/update', async (req, res) => {
    const {
        Id,
        QuocteGroupId,
        Name,
        Address,
        Phone,
        Email,
        Overdue,
        ExcessDebt,
        CompanyName,
        CompanyAdress,
        DirectorName,
        BankNumber,
        BankName,
        TaxCode,
        Fax,
    } = req.body;
    console.log(req.body);

    const { isValid, errors } = NewQuocteValidator(req.body);

    if (isValid) {
        let newDataversion;
        let data;
        try {
            Knex.transaction(async (t) => {
                try {
                    const dataVersion = await Knex('dataVersions').where('id', 1);

                    let { menus, userMenus, roles, categoryGroups, units, warehouses, products, customers, customerGroups, quoctes } = dataVersion[0];
                    quoctes++;

                    newDataversion = await t('dataVersions')
                        .returning('*')
                        .whereRaw('id = 1')
                        .update({
                            id: 1, menus, userMenus, roles, categoryGroups, units, warehouses, products, customers, customerGroups, quoctes
                        });

                    data = await t('quoctes')
                        .returning('*')
                        .whereRaw(`id = ${Id}`)
                        .update({
                            customerGroupId: QuocteGroupId,
                            name: Name,
                            address: Address || '',
                            phone: Phone || '',
                            email: Email || '',
                            overdue: Overdue || 10,
                            excessDebt: ExcessDebt || 10000000,
                            companyName: CompanyName || '',
                            companyAdress: CompanyAdress || '',
                            directorName: DirectorName || '',
                            bankNumber: BankNumber || '',
                            bankName: BankName || '',
                            taxCode: TaxCode || '',
                            fax: Fax || ''
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
                        customer: data,
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

QuocteRouter.post('/delete', async (req, res) => {
    const { Id } = req.body;
    let newDataversion;
    Knex.transaction(async (t) => {
        try {
            const dataVersion = await Knex('dataVersions').where('id', 1);

            let { menus, userMenus, roles, categoryGroups, units, warehouses, products, customers, customerGroups, quoctes } = dataVersion[0];
            quoctes++;

            newDataversion = await t('dataVersions')
                .returning('*')
                .whereRaw('id = 1')
                .update({
                    id: 1, menus, userMenus, roles, categoryGroups, units, warehouses, products, customers, customerGroups, quoctes
                })
                .catch((error) => {
                    console.error(error);
                });

            await Knex('quoctes')
                .transacting(t)
                .debug(true)
                .where({ id: Id })
                .del()
                .catch((error) => {
                    console.error('delete quoctes error: ', error);
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

export default QuocteRouter;
