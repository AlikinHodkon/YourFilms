const Pool = require("pg").Pool
require('dotenv').config()

const pool = new Pool({
    user: "postgres",
    password: process.env.PASSWORD,
    host: 'localhost',
    port: 5432,
    database: 'online_cinema'
});

module.exports = pool;
