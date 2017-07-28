
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('typeCargoes')
    .then(() => {
      // Inserts seed entries
      return knex('typeCargoes').insert([
        {
          id: 1,
          name: 'Nguyên Liệu'
        },
        {
          id: 2,
          name: 'Thành Phẩm'
        },
      ]);
    });
};
