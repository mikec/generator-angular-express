module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      database: '<%= dbName %>',
      user:     '<%= dbUser %>'
    },
    seeds: {
      directory: './db/seeds'
    },
    migrations: {
      directory: './db/migrations'
    }
  }

};
