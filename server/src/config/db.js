const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  // REQUIRED FOR AIVEN CLOUD MYSQL
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, 'ca.pem'))
  }
})

pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected to Aiven')
    conn.release()
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message)
    process.exit(1)
  })

module.exports = pool