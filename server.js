const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const WebSocket = require("ws");
const { validateTask } = require("./middleware");
const db = require("./db");

const app = express();
const port = 3000;
const secretKey = "secret123";

app.use(express.json());
app.use(express.static("public"));

// WebSocket untuk notifikasi real-time
const wss = new WebSocket.Server({ port: 8080 });
wss.on("connection", (ws) => {
    console.log("🔗 Client terhubung");
    ws.send("Selamat datang di notifikasi tugas!");
});

// **1. Registrasi pengguna**
app.post("/auth/register", (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
        if (err) return res.status(500).json({ message: "Gagal mendaftar" });
        res.json({ message: "Registrasi berhasil" });
    });
});

// **2. Login pengguna**
app.post("/auth/login", (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: "User tidak ditemukan" });

        const user = results[0];
        if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ message: "Password salah" });

        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });
        res.json({ message: "Login sukses", token });
    });
});

// **3. GET: Ambil semua tugas atau filter berdasarkan kategori**
app.get("/tasks", (req, res) => {
    const { category } = req.query;
    let sql = "SELECT * FROM tasks";
    let params = [];

    if (category) {
        sql += " WHERE category = ?";
        params.push(category);
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal mengambil data" });
        res.json(results);
    });
});

// **4. POST: Tambah tugas baru**
app.post("/tasks", validateTask, (req, res) => {
    const { title, category } = req.body;
    db.query("INSERT INTO tasks (title, category) VALUES (?, ?)", [title, category], (err) => {
        if (err) return res.status(500).json({ message: "Gagal menambahkan tugas" });

        // Notifikasi real-time untuk tugas baru
        wss.clients.forEach(client => client.send("Tugas baru ditambahkan!"));
        res.json({ message: "Tugas berhasil ditambahkan" });
    });
});

// **5. PUT: Update tugas berdasarkan ID**
app.put("/tasks/:id", validateTask, (req, res) => {
    const { id } = req.params;
    const { title, category } = req.body;
    db.query("UPDATE tasks SET title = ?, category = ? WHERE id = ?", [title, category, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal memperbarui tugas" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Tugas tidak ditemukan" });
        res.json({ message: "Tugas berhasil diperbarui" });
    });
});

// **6. DELETE: Hapus tugas berdasarkan ID**
app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM tasks WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal menghapus tugas" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Tugas tidak ditemukan" });
        res.json({ message: "Tugas berhasil dihapus" });
    });
});

// **Jalankan server**
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
