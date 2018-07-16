
module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/marslist',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './seeds'
    },
    useNullAsDefault: true
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/marslist',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './seeds'
    },
    useNullAsDefault: true
  },
};
