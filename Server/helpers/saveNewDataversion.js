import Knex from '../config/knex';

export default async (typeVersion) => {
    const maxId = await Knex('dataVersions').max('id');
    const dataVersion = await Knex.select().from('dataVersions').where('id', maxId[0].max);
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
    
    return Knex('dataVersions').insert({
        menus, userMenus, roles, categories, units, warehouses, products, customers, customerGroups
    });
};
