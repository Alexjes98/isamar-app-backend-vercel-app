require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('./img'))

const mysql = require("mysql2");
const util = require("util");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const dbquery = util.promisify(connection.query).bind(connection);

const query = async (text) => {
  try {
    const rows = await dbquery(text);
    return JSON.parse(JSON.stringify(rows));
  } catch (e) {
    console.log(e);
    return [];
  }
};

const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  }
});

app.get("/", (req, res) => {
  res.send(`API us up`);
});

app.get('/about', (req, res) => res.send('About Page Route'));

app.get('/portfolio', (req, res) => res.send('Portfolio Page Route'));

app.get('/contact', (req, res) => res.send('Contact Page Route'));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));


module.exports = app;