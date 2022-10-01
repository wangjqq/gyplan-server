const mysql = require('mysql')

const db = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  port: process.env.port,
  password: process.env.password,
  database: process.env.database,
})

module.exports = db