
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('units')
    .then(() => {
      // Inserts seed entries
      return knex('units').insert([
        { name: 'Kg', rate: 1 },
        { name: 'Hộp 1kg', rate: 0.9 },
        { name: 'Hộp 3kg', rate: 2.8 },
        { name: 'Hộp 4kg', rate: 3.8 },
        { name: 'Thùng 16kg', rate: 16 },
        { name: 'Phuy 200 lít', rate: 160 },
        { name: 'Phuy 170', rate: 170 },
        { name: 'Thùng 180', rate: 180 },
        { name: 'Thùng 186', rate: 186 }
      ]);
    });
};
