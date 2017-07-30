var bcrypt = require('bcrypt');

exports.seed = function (knex, Promise) {
  const password_hash = bcrypt.hashSync('tung1982', 10);
  return knex('users')
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: 'thanhtung',
          email: 'thanhtung776@gmail.com',
          password: password_hash,
          firstName: 'Nguyen',
          lastName: 'Thanh Tung',
          phone: '0916678845',
          address: '152 Giải Phóng - Cửa Bắc - Nam Định',
          roleId: 1,
          departmentId: 1,
          gender: 'Nam',
          rememberToken: null,
        },
      ]);
    });
};
