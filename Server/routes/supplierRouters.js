import { Router } from 'express';
import { NewSupplierValidator } from '../../Shared/validators/index';
import Knex from '../config/knex';
import dataversionHelper from '../helpers/saveNewDataversion';
import fs from 'fs';
import path from 'path';
import moment from '../../Shared/utils/moment';

const SupplierRouter = Router();

SupplierRouter.post('/new', async (req, res) => {
    const {
        Id,
        SupplierGroupId,
        Name,
        Address,
        Phone,
        Email,
        CurentDebt,
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

    const { isValid, errors } = NewSupplierValidator(req.body);

    if (isValid) {
        let newDataversion;
        let data;
        let customerDebt;
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
                            customerGroupId: SupplierGroupId,
                            name: Name,
                            address: Address || '',
                            phone: Phone || '',
                            email: Email || '',
                            CurentDebt: CurentDebt || 0,
                            overdue: Overdue || 10,
                            excessDebt: ExcessDebt || 10000000,
                            companyName: CompanyName || "",
                            companyAdress: CompanyAdress || "",
                            directorName: DirectorName || "",
                            bankNumber: BankNumber || "",
                            bankName: BankName || "",
                            taxCode: TaxCode || "",
                            fax: Fax || ""
                        });
                    customerDebt = await t('debtSuppliers')
                        .returning('*')
                        .insert({
                            customerId: data[0].id,
                            createdDate: moment().format('YYYY-MM-DD'),
                            title: 'Khởi tạo công nợ',
                            newDebt: CurentDebt || 0,
                            oldDebt: 0,
                            minus: 0,
                            plus: 0
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
                        customerDebt,
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
SupplierRouter.post('/update', async (req, res) => {
    const {
        Id,
        SupplierGroupId,
        Name,
        Address,
        Phone,
        Email,
        CurentDebt,
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

    const { isValid, errors } = NewSupplierValidator(req.body);

    if (isValid) {
        let newDataversion;
        let data;
        let customerDebt;
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
                    //Thay đổi toàn bộ công nợ khách hàng
                    //Tìm bản ghi công nợ khách hàng đầu tiên
                    const oldestDebt = await Knex.raw(`
                        SELECT q."id", q."customerId", q."newDebt", q."oldDebt", q."minus", q."plus" FROM "debtSuppliers" AS q
                        WHERE q."id" IN (
                            SELECT min(id) FROM "debtSuppliers"  
                            GROUP BY "id", "customerId"
                        )    
                        AND q."customerId" = ${Id};                    
                    `);
                    const So_tien_Dieu_Chinh = CurentDebt - oldestDebt.rows[0].newDebt;
                    //Tiến hành thay đổi toàn bộ bản ghi công nợ phát sinh
                    const customerDebtBeChanged = await Knex('debtSuppliers')
                        .orderBy('id', 'asc')
                        .whereRaw(`id >= ${oldestDebt.rows[0].id} AND "customerId" = ${Id}`);
                    //Điều chỉnh toàn bộ công nợ có liêu quan
                    if (customerDebtBeChanged.length > 0) {
                        customerDebtBeChanged.forEach(async (debt) => {
                            if (debt.newDebt == 'NAN') debt.newDebt = 0;
                            if (debt.oldDebt == 'NAN') debt.oldDebt = 0;
                            const _newDebt = debt.newDebt + So_tien_Dieu_Chinh;
                            const _oldDebt = debt.oldDebt + So_tien_Dieu_Chinh;

                            await t('debtSuppliers')
                                .returning('*')
                                .whereRaw(`id = ${debt.id}`)
                                .update({
                                    newDebt: _newDebt,
                                    oldDebt: _oldDebt,
                                });
                            customerDebt = debt;
                            customerDebt.newDebt = _newDebt;
                            customerDebt.oldDebt = _oldDebt;
                        });
                    }

                    console.log('customerDebt = ', customerDebt);

                    data = await t('customers')
                        .returning('*')
                        .whereRaw(`id = ${Id}`)
                        .update({
                            customerGroupId: SupplierGroupId,
                            name: Name,
                            address: Address || '',
                            phone: Phone || '',
                            email: Email || '',
                            CurentDebt: CurentDebt || 0,
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
                    // customerDebt = await Knex.raw(`
                    //     SELECT q."id", q."customerId", q."newDebt", q."oldDebt", q."minus", q."plus" FROM "debtSuppliers" AS q
                    //     WHERE q."id" IN (
                    //         SELECT max(id) FROM "debtSuppliers"  
                    //         GROUP BY "id", "customerId"
                    //     )
                    //     AND q."customerId" = ${Id};                           
                    // `);
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
                        customerDebt,
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

SupplierRouter.post('/delete', async (req, res) => {
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

export default SupplierRouter;
