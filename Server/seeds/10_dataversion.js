
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('dataVersions').del()
    .then(() => {
      // Inserts seed entries
      return knex('dataVersions').insert([
        {
            id: 1, 
            menus: 0, 
            roles: 0,
            permisions: 0,
            permisionRoles: 0,
            categories: 0,
            products: 0,
            units: 0,
            customers: 0,
        },
      ]);
    });
};
