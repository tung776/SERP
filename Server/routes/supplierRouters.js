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
        let supplierDebt;
        try {
            //bắt đầu thực hiện giao dịch, một trong nhiệm vụ thất bại sẽ bị rollback
            Knex.transaction(async (t) => {
                try {
                    //lấy dataversion hiện tại
                    const dataVersion = await Knex('dataVersions').where('id', 1);

                    let { suppliers } = dataVersion[0];
                    suppliers++;

                    //thực hiện thay đổi dữ liệu khách hàng
                    data = await t('suppliers')
                        .returning('*')
                        .insert({
                            name: Name,
                            address: Address || '',
                            phone: Phone || '',
                            email: Email || '',
                            CurentDebt: CurentDebt || 0,
                            overdue: Overdue || 20,
                            excessDebt: ExcessDebt || 100000000,
                            companyName: CompanyName || "",
                            companyAdress: CompanyAdress || "",
                            directorName: DirectorName || "",
                            bankNumber: BankNumber || "",
                            bankName: BankName || "",
                            taxCode: TaxCode || "",
                            fax: Fax || ""
                        });
                    supplierDebt = await t('debtSuppliers')
                        .returning('*')
                        .insert({
                            supplierId: data[0].id,
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
                            id: 1, suppliers
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
                        supplier: data,
                        supplierDebt,
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
        let supplierDebt;
        try {
            Knex.transaction(async (t) => {
                try {
                    const dataVersion = await Knex('dataVersions').where('id', 1);

                    let { suppliers } = dataVersion[0];
                    suppliers++;

                    newDataversion = await t('dataVersions')
                        .returning('*')
                        .whereRaw('id = 1')
                        .update({
                            id: 1, suppliers
                        });
                    //Thay đổi toàn bộ công nợ khách hàng
                    //Tìm bản ghi công nợ khách hàng đầu tiên
                    const oldestDebt = await Knex.raw(`
                        SELECT q."id", q."supplierId", q."newDebt", q."oldDebt", q."minus", q."plus" FROM "debtSuppliers" AS q
                        WHERE q."id" IN (
                            SELECT min(id) FROM "debtSuppliers"  
                            GROUP BY "id", "supplierId"
                        )    
                        AND q."supplierId" = ${Id};                    
                    `);
                    const So_tien_Dieu_Chinh = CurentDebt - oldestDebt.rows[0].newDebt;
                    //Tiến hành thay đổi toàn bộ bản ghi công nợ phát sinh
                    const supplierDebtBeChanged = await Knex('debtSuppliers')
                        .orderBy('id', 'asc')
                        .whereRaw(`id >= ${oldestDebt.rows[0].id} AND "supplierId" = ${Id}`);
                    //Điều chỉnh toàn bộ công nợ có liêu quan
                    if (supplierDebtBeChanged.length > 0) {
                        supplierDebtBeChanged.forEach(async (debt) => {
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
                            supplierDebt = debt;
                            supplierDebt.newDebt = _newDebt;
                            supplierDebt.oldDebt = _oldDebt;
                        });
                    }

                    console.log('supplierDebt = ', supplierDebt);

                    data = await t('suppliers')
                        .returning('*')
                        .whereRaw(`id = ${Id}`)
                        .update({
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
                    // supplierDebt = await Knex.raw(`
                    //     SELECT q."id", q."supplierId", q."newDebt", q."oldDebt", q."minus", q."plus" FROM "debtSuppliers" AS q
                    //     WHERE q."id" IN (
                    //         SELECT max(id) FROM "debtSuppliers"  
                    //         GROUP BY "id", "supplierId"
                    //     )
                    //     AND q."supplierId" = ${Id};                           
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
                        supplier: data,
                        supplierDebt,
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

            let { suppliers } = dataVersion[0];
            suppliers++;

            newDataversion = await t('dataVersions')
                .returning('*')
                .whereRaw('id = 1')
                .update({
                    id: 1, suppliers
                })
                .catch((error) => {
                    console.error(error);
                });

            await Knex('suppliers')
                .transacting(t)
                .debug(true)
                .where({ id: Id })
                .del()
                .catch((error) => {
                    console.error('delete suppliers error: ', error);
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
