const knex = require('knex');
const env = require('dotenv');

env.config();
const pg_database = process.env.POSTGRES_DATABASE;
const pg_host = process.env.POSTGRES_HOST;
const pg_user = process.env.POSTGRES_USER;
const pg_password = process.env.POSTGRES_PASSWORD;
const pg_port = Number(process.env.POSTGRES_PORT);

const database = knex({
    client: 'pg',
    version: '14.2',
    connection: {
        host: pg_host,
        port: pg_port,
        user: pg_user,
        password: pg_password,
        database: pg_database
    },
    migrations: {
            directory: 'src/database/migrations/',
        },
        seeds: {
            directory: 'src/database/seeds/'        
        }
});

module.exports = database;