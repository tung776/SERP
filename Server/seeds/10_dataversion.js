
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('dataVersions').del()
    .then(() => {
      // Inserts seed entries
      return knex('dataVersions').insert([
        {
            id: 1, 
            menus: 0, 
            userMenus: 0,
            roles: 0,
            categories: 0,
            units: 0,
            warehouses: 0,
            products: 0,
            customerGroups: 0,
            customers: 0,
        },
      ]);
    });
};
