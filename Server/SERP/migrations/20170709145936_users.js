
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('users', function(table) {
      table.increments();
      table.string('username').notNullable().unique();
      table.string('email').notNullable().unique();
      table.string('phone').notNullable();
      table.string('password').notNullable();
      table.string('role').notNullable();
      table.string('gender').notNullable();
      table.timestamps();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
