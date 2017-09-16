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
    date = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
    console.log('date = ', date);

    const { isValid, errors } = NewQuocteValidator(req.body);
    let newQuocte;
    if (isValid) {
        let newDataversion;
        let data;
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
                    quocteDetails.forEach(async ({ id, unitId, salePrice }) => {
                        await t('quocteDetails')
                            .returning('*')
                            .insert({
                                quocteId: newQuocte[0].id,
                                productId: id,
                                unitId: unitId,
                                salePrice: salePrice
                            });
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

                    data = await Knex.raw(`
                        SELECT q."id", q."customerId", q."customerGroupId", q."title", q."date", 
                            qd."id" AS "detailId", qd."productId", qd."unitId", qd."salePrice" FROM "quoctes" AS q
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
    let {
        id,
        customerId,
        customerGroupId,
        title,
        date,
        quocteDetails
    } = req.body;

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

                    await t('quoctes')
                        .returning('*')
                        .whereRaw(`id = ${id}`)
                        .update({
                            customerGroupId: (customerGroupId == 'null') ? null : customerGroupId,
                            customerId: (customerId == 'null') ? null : customerId,
                            title: title || '',
                            date: date
                        });
                    
                    //b1: xác định các bản ghi cần bị xóa. là những bản ghi có trong cơ sở dữ liệu
                    //nhưng không có trong dữ liệu dc gửi tới server
                    let detailBeRemoved = [];
                    let detailBeUpdated = [];
                    let detailBeInsersted = [];
                    let detailInDatabase = await Knex('quocteDetails')
                        .whereRaw(`"quocteId" = ${id}`);

                    detailInDatabase.forEach(detailInData => {
                        quocteDetails.forEach(detail => {
                            if (detail.detailId == undefined || detail.detail == 'undefined') {
                                detailBeInsersted = detailBeInsersted.filter(item => {
                                    if (item.key != detail.key) return item;
                                });
                                detailBeInsersted.push(detail);
                            } else {
                                if (detail.detailId == detailInData.id) {
                                    detailBeUpdated.push(detail);
                                } else {
                                    detailBeRemoved.push(detailInData);
                                }
                            }
                        })
                    });
                    console.log('detailBeRemoved = ', detailBeRemoved);
                    console.log('detailBeUpdated = ', detailBeUpdated);
                    console.log('detailBeInsersted = ', detailBeInsersted);

                    //b2: xác định các bản ghi dc điều chỉnh. là các bản ghi có trong cả csdl và dữ liệu dc gửi tới server
                    //b3 xác định các bản ghi dc thêm vào. là những bản ghi ko có trong csdl nhưng có trong dữ liệu dc chuyển
                    //tới server
                    // detailBeInsersted.forEach(async ({ productId, unitId, salePrice }) => {
                    //     console.log('insert detail = ', { id, productId, unitId, salePrice })
                    //     await t('quocteDetails')
                    //         .returning('*')
                    //         .insert({
                    //             quocteId: id,
                    //             productId: productId,
                    //             unitId: unitId,
                    //             salePrice: salePrice
                    //         });
                    // });

                    detailBeRemoved.forEach(async detail => {
                        console.log('delete item = ', detail);
                        await Knex("quocteDetails")
                        .transacting(t)
                        .debug(true)
                        .where("id", 10)
                        .del()
                        .catch((error) => {
                            console.error('delete quoctes error: ', error);
                        });
                    });

                    // detailBeUpdated.forEach(async detail => {
                    //     await t('quocteDetails')
                    //     .returning('*')
                    //     .whereRaw(`id = ${detail.detailId}`)
                    //     .update({
                    //         quocteId: id,
                    //         productId: detail.productId,
                    //         unitId: detail.unitId,
                    //         salePrice: detail.salePrice
                    //     });
                    // })

                } catch (e) {
                    t.rollback();
                    console.log(e);
                    res.status(400).json({ success: false, error: e });
                }
            }).then(
                async () => {
                    data = await Knex.raw(`
                        SELECT q."id", q."customerId", q."customerGroupId", q."title", q."date", 
                            qd."id" AS "detailId", qd."productId", qd."unitId", qd."salePrice" FROM "quoctes" AS q
                        INNER JOIN "quocteDetails" AS qd ON q."id" = qd."quocteId"
                        WHERE q."id" = ${id};                      
                    `);

                    res.json({
                        success: true,
                        quocte: data.rows,
                        dataversion: newDataversion
                    });
                })
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
            await Knex('quocteDetails')
                .transacting(t)
                .debug(true)
                .where({ quocteId: Id })
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
