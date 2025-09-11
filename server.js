require("dotenv").config();   // først

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
});

app.get("/api/cars", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM car");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.post("/api/cars", async (req, res) => {
  const { name, year, price, model } = req.body;
  try {
    const [result] = await pool.query("INSERT INTO car (name, year, price, model) VALUES (?, ?, ?, ?)", [name, year, price, model]);
    res.status(201).json({ id: result.insertId, name, year, price, model });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.delete("/api/cars/:id", async (req, res) => {
  const { id } = req.params;
  try {
  console.log('DELETE /api/cars/:id called with id:', id);
  const [result] = await pool.query("DELETE FROM car WHERE id = ?", [Number(id)]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.put("/api/cars/:id", async (req, res) => {
  const { id } = req.params;
  const { name, year, price, model } = req.body;
  console.log('PUT /api/cars/:id body:', req.body);
  console.log('PUT /api/cars/:id params:', req.params);
  console.log('DB NAME', process.env.DB_NAME);
  try {
    const [result] = await pool.query(
      "UPDATE car SET name = ?, year = ?, price = ?, model = ? WHERE id = ?",
      [name, year, price, model, Number(id)]
    );
    console.log('PUT /api/cars/:id query result:', result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json({ id, name, year, price, model });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.listen(3000, () => console.log("API running on http://localhost:3000"));