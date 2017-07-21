
exports.up = function (knex, Promise) {
    return knex.schema.createTableIfNotExists('menus', (table) => {
        table.increments();
        table.string('name').notNullable().unique();
        table.timestamps();
    })
        .createTableIfNotExists('userMenus', (table) => {
            table.increments();
            table.integer('menuId').references('id').inTable('menus');
            table.integer('userId').references('id').inTable('users');
        })
        .createTableIfNotExists('dataVersions', (table) => {
            table.increments();
            table.integer('menus').notNullable().defaultTo(1);
            table.integer('userMenus').notNullable().defaultTo(1);
            table.integer('roles').notNullable().defaultTo(1);
            table.integer('units').notNullable().defaultTo(1);
            table.integer('warehouses').notNullable().defaultTo(1);
            table.integer('categories').notNullable().defaultTo(1);
            table.integer('products').notNullable().defaultTo(1);
            table.integer('units').notNullable().defaultTo(1);
            table.integer('customerGroups').notNullable().defaultTo(1);
            table.integer('customers').notNullable().defaultTo(1);
        });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('menus')
        .dropTableIfExists('userMenus')
        .dropTableIfExists('dataVersions');
};
