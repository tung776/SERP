
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('units').del()
    .then(function () {
      // Inserts seed entries
      return knex('units').insert([
        {id: 1, name: 'Kg', rate: 1},
        {id: 2, name: 'Hộp 1kg', rate: 0.9},
        {id: 3, name: 'Hộp 3kg', rate: 2.8},
        {id: 4, name: 'Hộp 4kg', rate: 3.8},
        {id: 5, name: 'Thùng 16kg', rate: 16},
        {id: 6, name: 'Phuy 200 lít', rate: 160},
        {id: 7, name: 'Phuy 170', rate: 170},
        {id: 8, name: 'Thùng 180', rate: 180},
        {id: 9, name: 'Thùng 186', rate: 186}
      ]);
    });
};
