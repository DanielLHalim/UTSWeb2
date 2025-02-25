require("dotenv").config();
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
app.use("/auth", authRoutes);
app.use("/", taskRoutes);

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});