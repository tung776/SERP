
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('userMenus')
    .then(() => {
      // Inserts seed entries
      return knex('userMenus').insert([
        { menuId: 1, userId: 1 },
        { menuId: 2, userId: 1 },
        { menuId: 3, userId: 1 },
        { menuId: 4, userId: 1 },
        { menuId: 5, userId: 1 },
        { menuId: 6, userId: 1 },
        { menuId: 7, userId: 1 },
        { menuId: 8, userId: 1 },
        { menuId: 9, userId: 1 },
        { menuId: 10, userId: 1 },
        { menuId: 11, userId: 1 },
        { menuId: 12, userId: 1 },
        { menuId: 13, userId: 1 },
        { menuId: 14, userId: 1 },
        { menuId: 15, userId: 1 },
        { menuId: 16, userId: 1 },
        { menuId: 17, userId: 1 },
        { menuId: 18, userId: 1 },
        { menuId: 19, userId: 1 },
        { menuId: 20, userId: 1 },
        { menuId: 21, userId: 1 },
        { menuId: 22, userId: 1 },
        { menuId: 23, userId: 1 },
        { menuId: 24, userId: 1 },
        { menuId: 25, userId: 1 },
        { menuId: 26, userId: 1 },
        { menuId: 27, userId: 1 },
        { menuId: 28, userId: 1 },
        { menuId: 29, userId: 1 },
        { menuId: 30, userId: 1 },
        { menuId: 31, userId: 1 },
        { menuId: 32, userId: 1 },
        { menuId: 33, userId: 1 },
        { menuId: 34, userId: 1 },
        { menuId: 35, userId: 1 },
        { menuId: 36, userId: 1 },
        { menuId: 37, userId: 1 },
        { menuId: 38, userId: 1 },
        { menuId: 39, userId: 1 },
        { menuId: 40, userId: 1 },
        { menuId: 41, userId: 1 },
        { menuId: 42, userId: 1 },
        { menuId: 43, userId: 1 },
        { menuId: 44, userId: 1 },
        { menuId: 45, userId: 1 },
        { menuId: 46, userId: 1 },
        { menuId: 47, userId: 1 },
        { menuId: 48, userId: 1 },
        { menuId: 49, userId: 1 },
        { menuId: 50, userId: 1 },
        { menuId: 51, userId: 1 },
        { menuId: 52, userId: 1 },
        { menuId: 53, userId: 1 },
        { menuId: 54, userId: 1 },
        { menuId: 55, userId: 1 },
        { menuId: 56, userId: 1 },
        { menuId: 57, userId: 1 },
        { menuId: 58, userId: 1 },
        { menuId: 59, userId: 1 },
        { menuId: 60, userId: 1 },
        { menuId: 61, userId: 1 },
        { menuId: 62, userId: 1 },
        { menuId: 63, userId: 1 },
        { menuId: 64, userId: 1 },
        { menuId: 65, userId: 1 },
        { menuId: 66, userId: 1 },

        { menuId: 67, userId: 1 },
        { menuId: 68, userId: 1 },
      ]);
    });
};
