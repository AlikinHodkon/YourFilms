const Pool = require("pg").Pool

const pool = new Pool({
    user: "root",
    password: "root",
    host: 'localhost',
    port: 5432,
    database: 'online_kino'
});

module.exports = pool;
