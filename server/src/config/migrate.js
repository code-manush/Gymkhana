require('dotenv').config()
const mysql = require('mysql2/promise')
const fs    = require('fs')
const path  = require('path')

async function migrate() {
  // Connect without specifying the database first
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,   // needed to run the whole file at once
  })

  const sql = fs.readFileSync(
    path.join(__dirname, 'schema.sql'),
    'utf8'
  )

  console.log('⏳ Running migrations...')
  await conn.query(sql)
  console.log('✅ Database and tables created successfully')
  await conn.end()
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err.message)
  process.exit(1)
})