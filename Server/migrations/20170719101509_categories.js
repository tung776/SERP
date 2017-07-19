
exports.up = function (knex, Promise) {
    return knex.schema.createTableIfNotExists('categories', function(table) {
      table.increments();
      table.string('Name').notNullable().unique();
      table.string('Description');
      
      table.timestamps();
  })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('categories');
};
