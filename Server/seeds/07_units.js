
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('units')
    .then(() => {
      // Inserts seed entries
      return knex('units').insert([
        { name: 'Kg', rate: 1 },
        { name: 'Hộp 1kg', rate: 1 },
        { name: 'Chai 1kg', rate: 1 },
        { name: 'Chai 1.5kg', rate: 1.5 },
        { name: 'Chai 2kg', rate: 2 },
        { name: 'Hộp 3kg', rate: 3 },
        { name: 'Hộp 4kg', rate: 4 },
        { name: 'Thùng 16kg', rate: 16 },
        { name: 'Phuy 200 lít', rate: 160 },
        { name: 'Phuy 170', rate: 170 },
        { name: 'Phuy 180', rate: 180 },
        { name: 'Phuy 186', rate: 186 },
        { name: 'Phuy 190', rate: 190 },
        { name: 'Phuy 200', rate: 200 },
      ]);
    });
};
