import express, { Router } from 'express';
const dataRoutes = Router();
import passport from 'passport';
import Knex from '../config/knex';

dataRoutes.post('/checkDataVersion', async function (req, res) {
    const { 
        id, menus, userMenus, roles,
        categories, units, warehouses,
        products, customerGroups, customers, userId, typeCargoes,
        quoctes
     } = req.body;
    try {
        let shouldUpdate = {};
        const maxId = await Knex('dataVersions').max('id');
        const dataVersion = await Knex.select().from('dataVersions').where('id', maxId[0].max);
        // console.log("dataversion = ", JSON.stringify(dataVersion));
        if (dataVersion[0].id != id) {
            shouldUpdate.id = dataVersion[0].id;
        }
        if (dataVersion[0].menus != menus) {
            shouldUpdate.menus = dataVersion[0].menus;
            shouldUpdate.menusVersion = dataVersion[0].menus;
        }
        if (dataVersion[0].userMenus != req.body.userMenus) {
            const menusData = await Knex('userMenus')
                .where('userId', userId)
                .innerJoin('menus', 'userMenus.menuId', 'menus.id')
                .select('userId', 'menuId', 'name', 'parentId');
            shouldUpdate.userMenus = menusData;
            shouldUpdate.userMenusVersion = dataVersion[0].userMenus;

        }
        if (dataVersion[0].roles != roles) {
            shouldUpdate.roles = await Knex('roles').select('id', 'name');
            shouldUpdate.rolesVersion = dataVersion[0].roles;
        }
        if (dataVersion[0].categories != categories) {
            shouldUpdate.categories = await Knex.select().from('categories');
            shouldUpdate.categoriesVersion = dataVersion[0].categories;
        }
        if (dataVersion[0].units != units) {
            shouldUpdate.units = await Knex('units').select('id', 'name', 'rate');
            shouldUpdate.unitsVersion = dataVersion[0].units;
        }
        if (dataVersion[0].typeCargoes != typeCargoes) {
            shouldUpdate.typeCargoes = await Knex('typeCargoes').select('id', 'name');
            shouldUpdate.typeCargoesVersion = dataVersion[0].typeCargoes;
        }
        if (dataVersion[0].warehouses != warehouses) {
            shouldUpdate.warehouses = await Knex.select().from('warehouses');
            shouldUpdate.warehousesVersion = dataVersion[0].warehouses;
        }
        if (dataVersion[0].quoctes != quoctes) {
            //kết quả chỉ trả về là báo giá mới nhất (có id lớn nhất) 
            //của toàn bộ khách hàng hoặc nhóm khách hàng

            // shouldUpdate.quoctes = await Knex.raw(`
            //     SELECT "q"."id", "q"."customerId", "q"."title", "q"."date", 
            //         "qd"."productId", "qd"."unitId", "qd"."price" FROM "quoctes" AS "q"
            //     INNER JOIN "quocteDetails" AS "qd" on "q"."id" = "qd"."quocteId"
            //     WHERE "q"."id" IN (
            //         SELECT max(id) FROM "quoctes"  
            //         WHERE "customerGroupId" IS NULL
            //         GROUP BY "customerId"
            //     );                
            // `)
            const result = await Knex.raw(`
                SELECT q."id", q."customerId", q."customerGroupId", q."title", q."date", 
                    qd."id" AS "detailId", qd."productId", qd."unitId", qd."price" FROM "quoctes" AS q
                INNER JOIN "quocteDetails" AS qd ON q."id" = qd."quocteId"
                WHERE q."id" IN (
                    SELECT max(id) FROM "quoctes"  
                    GROUP BY "customerGroupId", "customerId"
                );                           
            `);
            shouldUpdate.quoctes = result.rows;

            shouldUpdate.quoctesVersion = dataVersion[0].quoctes;
        }
        if (dataVersion[0].products != products) {
            shouldUpdate.products = await Knex.select().from('products');
            shouldUpdate.productsVersion = dataVersion[0].products;
        }
        if (dataVersion[0].customers != customers) {
            shouldUpdate.customers = await Knex.select().from('customers');
            shouldUpdate.customersVersion = dataVersion[0].customers;

        }
        if (dataVersion[0].customerGroups != customerGroups) {
            shouldUpdate.customerGroups = await Knex.select().from('customerGroups');
            shouldUpdate.customerGroupsVersion = dataVersion[0].customerGroups;

        }
        // console.log('shouldUpdate = ', shouldUpdate);
        res.status(200).json(shouldUpdate);
    }
    catch (err) {
        console.log(err);
        res.json(err);
    }
})

export default dataRoutes;