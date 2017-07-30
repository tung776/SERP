
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('typeCargoes')
    .then(() => {
      // Inserts seed entries
      return knex('typeCargoes').insert([
        {
          name: 'Nguyên Liệu'
        },
        {
          name: 'Thành Phẩm'
        },
      ]);
    });
};
