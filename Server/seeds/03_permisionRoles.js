
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('permisionsRoles')
    .then(function () {
      // Inserts seed entries
      return knex('permisionsRoles').insert([
        {roleId: 1, permisionId: 1 },
      ]);
    });
};
