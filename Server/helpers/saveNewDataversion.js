import Knex from '../config/knex';

export default async (typeVersion, t) => {
    debugger;
    const dataVersion = await Knex.select().from('dataVersions').where('id', 1);
    let { menus, userMenus, roles, categories, units, warehouses, products, customers, customerGroups } = dataVersion[0];

    switch (typeVersion) {
        case 'menus':
            menus++;
            break;
        case 'userMenus':
            userMenus++;
            break;
        case 'roles':
            roles++;
            break;
        case 'categories':
            categories++;
            break;
        case 'units':
            units++;
            break;
        case 'warehouses':
            warehouses++;
            break;
        case 'products':
            products++;
            break;
        case 'customers':
            customers++;
            break;
        case 'customerGroups':
            customerGroups++;
            break;
        default:
            break;
    }
    
    return Knex('dataVersions')
    .transacting(t)
    .returning('*')
    .whereRaw(`id = 1`)
    .update({
        id: -21, menus, userMenus, roles, categories, units, warehouses, products, customers, customerGroups
    });
};
