const mysql = require('mysql')

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'admin123',
  database: 'my_db_01',
})

module.exports = db