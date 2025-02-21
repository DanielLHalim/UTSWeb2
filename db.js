const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "utsweb",
});

db.connect(err => {
  if (err) throw err;
  console.log("Terhubung ke database MySQL!");
});

module.exports = db;
