const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "evergrow",
    password: "test",
    port: 5433,
});

module.exports = pool;