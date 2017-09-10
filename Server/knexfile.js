// Update with your config settings.
var moment = require('moment');
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'SERP',
      user:     'postgres',
      password: 'tung1221982',
      datestyle: 'DMY'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password',
      timezone: 'UTC',
      typeCast: function (field, next) {
        if (field.type == 'DATE') {
          return moment(field.string()).format('DD-MM-YYYY');
        }
        return next();
      }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
