require("dotenv").config();// Load konfigurasi dari file .env
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const WebSocket = require("ws");

const app = express(); //instal express
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// WebSocket untuk notifikasi real-time
const wss = new WebSocket.Server({ port: 8080 });
wss.on("connection", (ws) => {
    console.log("🔗 Client terhubung");
    ws.send("Selamat datang di notifikasi tugas!");
});

// Gunakan rute API
app.use("/api/auth", authRoutes);// Rute untuk register & login
app.use("/api", taskRoutes);// Rute untuk CRUD tugas

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
