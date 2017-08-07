import { Router } from 'express';
import { NewCustomerValidator } from '../../Shared/validators/index';
import Knex from '../config/knex';
import dataversionHelper from '../helpers/saveNewDataversion';
import fs from 'fs';
import path from 'path';

const CustomerRouter = Router();

CustomerRouter.post('/new', async (req, res) => {
    const {
        Id,
        CustomerGroupId,
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

    const { isValid, errors } = NewCustomerValidator(req.body);

    if (isValid) {
        let newDataversion;
        let data;
        try {
            //bắt đầu thực hiện giao dịch, một trong nhiệm vụ thất bại sẽ bị rollback
            Knex.transaction(async (t) => {
                try {
                    //lấy dataversion hiện tại
                    const dataVersion = await Knex('dataVersions').where('id', 1);

                    let { menus, userMenus, roles, categoryGroups, units, warehouses, products, customers, customerGroups } = dataVersion[0];
                    customers++;
                    //thực hiện thay đổi dữ liệu khách hàng
                    data = await t('customers')
                        .returning('*')
                        .insert({
                            customerGroupId: CustomerGroupId,
                            name: Name,
                            address: Address || '',
                            phone: Phone || '',
                            email: Email || '',
                            overdue: Overdue || 10,
                            excessDebt: ExcessDebt || 10000000,
                            companyName: CompanyName || null,
                            companyAdress: CompanyAdress || null,
                            directorName: DirectorName || null,
                            bankNumber: BankNumber || null,
                            bankName: BankName || null,
                            taxCode: TaxCode || null,
                            fax: Fax || null
                        });
                    //để cập nhật dataversion mới
                    newDataversion = await t('dataVersions')
                        .returning('*')
                        .whereRaw('id = 1')
                        .update({
                            id: 1, menus, userMenus, roles, categoryGroups, units, warehouses, products, customers, customerGroups
                        });
                } catch (e) {
                    //Đã có lỗi phát sinh, rollback lại toàn bộ thay đổi
                    t.rollback();
                    console.log(e);
                    res.status(400).json({ success: false, error: e });
                }
            }).then(
                () => {
                    //không có lỗi nào xuất hiện, server sẽ gửi tới client nhóm khách hàng vừa được insert, và dataVersion mới nhất
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
            //It failed
        }
    }
});
CustomerRouter.post('/update', async (req, res) => {
    const {
        Id,
        CustomerGroupId,
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

    const { isValid, errors } = NewCustomerValidator(req.body);

    if (isValid) {
        let newDataversion;
        let data;
        try {
            Knex.transaction(async (t) => {
                try {
                    const dataVersion = await Knex('dataVersions').where('id', 1);

                    let { menus, userMenus, roles, categoryGroups, units, warehouses, products, customers, customerGroups } = dataVersion[0];
                    customers++;

                    newDataversion = await t('dataVersions')
                        .returning('*')
                        .whereRaw('id = 1')
                        .update({
                            id: 1, menus, userMenus, roles, categoryGroups, units, warehouses, products, customers, customerGroups
                        });

                    data = await t('customers')
                        .returning('*')
                        .whereRaw(`id = ${Id}`)
                        .update({
                            customerGroupId: CustomerGroupId,
                            name: Name,
                            address: Address || '',
                            phone: Phone || '',
                            email: Email || '',
                            overdue: Overdue || 10,
                            excessDebt: ExcessDebt || 10000000,
                            companyName: CompanyName || null,
                            companyAdress: CompanyAdress || null,
                            directorName: DirectorName || null,
                            bankNumber: BankNumber || null,
                            bankName: BankName || null,
                            taxCode: TaxCode || null,
                            fax: Fax || null
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

CustomerRouter.post('/delete', async (req, res) => {
    const { Id } = req.body;
    let newDataversion;
    Knex.transaction(async (t) => {
        try {
            const dataVersion = await Knex('dataVersions').where('id', 1);

            let { menus, userMenus, roles, categoryGroups, units, warehouses, products, customers, customerGroups } = dataVersion[0];
            customers++;

            newDataversion = await t('dataVersions')
                .returning('*')
                .whereRaw('id = 1')
                .update({
                    id: 1, menus, userMenus, roles, categoryGroups, units, warehouses, products, customers, customerGroups
                })
                .catch((error) => {
                    console.error(error);
                });

            await Knex('customers')
                .transacting(t)
                .debug(true)
                .where({ id: Id })
                .del()
                .catch((error) => {
                    console.error('delete customers error: ', error);
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

export default CustomerRouter;
