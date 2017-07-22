import express, { Router } from 'express';
const dataRoutes = Router();
import passport from 'passport';
import Knex from '../config/knex';

dataRoutes.post('/checkDataVersion', async function (req, res) {
    const { id, menus, userMenus, roles,
        categories, units, warehouses,
        products, customerGroups, customers, userId
     } = req.body;

     console.log({ id, menus, userMenus, roles,
        categories, units, warehouses,
        products, customerGroups, customers
     });
    try {
        let shouldUpdate = {};
        const maxId = await Knex('dataVersions').max('id');
        console.log("maxId = ", maxId[0].max);
        const dataVersion = await Knex.select().from('dataVersions').where('id', maxId[0].max);
        console.log(dataVersion);
        if( dataVersion[0].menus !== menus) {
            console.log("dataVersion[0] = ", dataVersion[0])
            console.log("menus = ", menus)
            shouldUpdate.menus = dataVersion[0].menus;
            console.log(shouldUpdate);
        }
        if(dataVersion[0].userMenus !== req.body.userMenus) {
            const menusData = await Knex('userMenus')
                .where('userId', userId)
                .innerJoin('menus', 'userMenus.menuId', 'menus.id')
                .select('menuId', 'name');
                console.log(menusData);
                shouldUpdate.userMenus = menusData;

        }
        if(dataVersion[0].roles !== roles) {
            shouldUpdate.roles = await Knex('roles').select('id','name')
        }
        if(dataVersion[0].categories !== categories) {
            shouldUpdate.categories = await Knex.select().from('warehouses');
        }
        if(dataVersion[0].units !== units) {
            shouldUpdate.units = await Knex('units').select('id', 'name', 'rate');
        }
        if(dataVersion[0].warehouses !== warehouses) {
            shouldUpdate.warehouses = await Knex.select().from('categories');
        }
        if(dataVersion[0].products !== products) {
            shouldUpdate.products = await Knex.select().from('products');
        }
        if(dataVersion[0].customerGroups !== customerGroups) {
            shouldUpdate.customerGroups = await Knex.select().from('customerGroups');
        }
        res.json(shouldUpdate);
    }
    catch(err) {
        res.json(err);
    }
})

export default dataRoutes;