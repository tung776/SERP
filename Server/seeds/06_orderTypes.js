
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('orderTypes')
    .then(function () {
      // Inserts seed entries
      return knex('orderTypes').insert([
        { name: 'Hóa Đơn Bán'},
        { name: 'Khách Hàng Trả lại'}
      ]);
    });
};
