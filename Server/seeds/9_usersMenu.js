
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('userMenus').del()
    .then(function () {
      // Inserts seed entries
      return knex('userMenus').insert([
        {id: 1, menuId: 1, userId: 1},
        {id: 2, menuId: 2, userId: 1},
        {id: 3, menuId: 3, userId: 1},
        {id: 4, menuId: 4, userId: 1},
        {id: 5, menuId: 5, userId: 1},
        {id: 6, menuId: 6, userId: 1},
        {id: 7, menuId: 7, userId: 1},
        {id: 8, menuId: 8, userId: 1}
      ]);
    });
};
