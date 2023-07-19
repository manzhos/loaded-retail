const { Pool } = require('pg')

const connect = `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DBNAME}`;

const pool = new Pool({
  connectionString: connect,
  ssl: {
    rejectUnauthorized: false
  }
})

module.exports = pool
