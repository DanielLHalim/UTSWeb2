//Koneksi Database
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Terhubung ke database MySQL!");
});

module.exports = db;