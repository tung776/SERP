
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('orderTypes').del()
    .then(function () {
      // Inserts seed entries
      return knex('orderTypes').insert([
        {id: 1, name: 'Hóa Đơn Bán'},
        {id: 2, name: 'Khách Hàng Trả lại'}
      ]);
    });
};
