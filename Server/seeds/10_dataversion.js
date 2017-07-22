
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('dataVersions').del()
    .then(() => {
      // Inserts seed entries
      return knex('dataVersions').insert([
        {
            id: 1, 
            menus: 1, 
            userMenus: 1,
            roles: 1,
            categories: 1,
            units: 1,
            warehouses: 1,
            products: 1,
            customerGroups: 1,
            customers: 1,
        },
      ]);
    });
};
